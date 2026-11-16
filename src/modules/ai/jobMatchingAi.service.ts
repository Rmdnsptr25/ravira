import { z } from "zod";
import { env } from "../../config/env";
import { generateGeminiJson, isGeminiConfigured } from "./gemini.service";

export interface AiScoringCandidateInput {
  location: string | null;
  education: string | null;
  experienceSummary: string | null;
  salaryExpectation: number | null;
  mobilityPreference: string | null;
  skills: Array<{
    skillName: string;
    level: string | null;
  }>;
}

export interface AiScoringJobInput {
  id: string;
  title: string;
  description: string;
  location: string | null;
  jobType: string | null;
  workType: string | null;
  employmentType: string | null;
  company: {
    name: string;
    industry: string | null;
  };
  skills: Array<{
    skillName: string;
    required: boolean;
    weight: number | null;
  }>;
}

export interface AiBaselineScore {
  score: number;
  explanation: string[];
  breakdown: Record<string, unknown>;
  ruleVersion: string;
}

const singleMatchSchema = z.object({
  score: z.number().min(0).max(100),
  explanation: z.array(z.string().trim().min(1)).min(1).max(5)
});

const batchRecommendationsSchema = z.object({
  matches: z.array(
    z.object({
      jobId: z.string().trim().min(1),
      score: z.number().min(0).max(100),
      explanation: z.array(z.string().trim().min(1)).min(1).max(4)
    })
  )
});

const GEMINI_HYBRID_RULE_VERSION = "gemini-hybrid-v1";
const MAX_BATCH_JOBS = 15;

const buildCandidateSummary = (candidate: AiScoringCandidateInput) => ({
  location: candidate.location,
  education: candidate.education,
  experienceSummary: candidate.experienceSummary?.slice(0, 600) ?? null,
  mobilityPreference: candidate.mobilityPreference,
  skills: candidate.skills.slice(0, 25).map((item) => ({
    name: item.skillName,
    level: item.level
  }))
});

const buildJobSummary = (job: AiScoringJobInput, baselineScore: number) => ({
  jobId: job.id,
  title: job.title,
  companyName: job.company.name,
  industry: job.company.industry,
  location: job.location,
  jobType: job.jobType,
  workType: job.workType,
  employmentType: job.employmentType,
  description: job.description.slice(0, 500),
  skills: job.skills.slice(0, 20).map((item) => ({
    name: item.skillName,
    required: item.required
  })),
  baselineRuleScore: baselineScore
});

const buildHybridResult = (
  baseline: AiBaselineScore,
  aiScore: number,
  aiExplanation: string[]
): AiBaselineScore => ({
  score: Math.round(aiScore),
  explanation: aiExplanation,
  breakdown: {
    ...baseline.breakdown,
    aiProvider: "gemini",
    aiModel: env.GEMINI_MODEL ?? "gemini-3.8-flash",
    baselineRuleScore: baseline.score
  },
  ruleVersion: GEMINI_HYBRID_RULE_VERSION
});

/**
 * Evaluates candidate-job match using Gemini while keeping deterministic baseline breakdown.
 * Returns null if Gemini is unconfigured or unavailable.
 */
export const evaluateJobMatchWithGemini = async (
  candidate: AiScoringCandidateInput,
  job: AiScoringJobInput,
  baseline: AiBaselineScore
): Promise<AiBaselineScore | null> => {
  if (!isGeminiConfigured()) {
    return null;
  }

  const prompt = [
    "Anda adalah sistem AI job matching untuk platform rekrutmen RAVIRA.",
    "Evaluasi kecocokan kandidat dengan lowongan berikut secara objektif.",
    "Aturan:",
    "- Berikan `score` bilangan bulat 0 sampai 100 (pertimbangkan skill, pengalaman relevan, lokasi/workType, dan baselineRuleScore).",
    "- Berikan `explanation` berupa 2 sampai 4 kalimat singkat berbahasa Indonesia yang jelas dan faktual menjelaskan alasan skor.",
    "- Kembalikan JSON valid dengan format: {\"score\": number, \"explanation\": string[]}.",
    "",
    `Kandidat: ${JSON.stringify(buildCandidateSummary(candidate))}`,
    `Lowongan: ${JSON.stringify(buildJobSummary(job, baseline.score))}`
  ].join("\n");

  const result = await generateGeminiJson({
    prompt,
    schema: singleMatchSchema
  });

  if (!result) {
    return null;
  }

  return buildHybridResult(baseline, result.score, result.explanation);
};

/**
 * Evaluates a batch of candidate job recommendations in a single Gemini call.
 * Returns a Map keyed by jobId; jobs missing or failing fall back to baseline in the caller.
 */
export const evaluateJobRecommendationsWithGemini = async (
  candidate: AiScoringCandidateInput,
  jobsWithBaseline: Array<{ job: AiScoringJobInput; baseline: AiBaselineScore }>
): Promise<Map<string, AiBaselineScore>> => {
  const results = new Map<string, AiBaselineScore>();
  if (!isGeminiConfigured() || jobsWithBaseline.length === 0) {
    return results;
  }

  const targetBatch = jobsWithBaseline.slice(0, MAX_BATCH_JOBS);
  const baselineByJobId = new Map(targetBatch.map((entry) => [entry.job.id, entry.baseline]));

  const prompt = [
    "Anda adalah sistem AI job matching untuk platform rekrutmen RAVIRA.",
    "Evaluasi kecocokan kandidat terhadap daftar lowongan berikut secara objektif.",
    "Aturan:",
    "- Untuk setiap lowongan, kembalikan `jobId` yang persis sama, `score` (0-100), dan `explanation` (2-3 alasan singkat berbahasa Indonesia).",
    "- Jangan mengubah atau mengarang `jobId`.",
    "- Kembalikan JSON valid dengan format: {\"matches\": [{\"jobId\": string, \"score\": number, \"explanation\": string[]}]}.",
    "",
    `Kandidat: ${JSON.stringify(buildCandidateSummary(candidate))}`,
    `Lowongan: ${JSON.stringify(targetBatch.map((entry) => buildJobSummary(entry.job, entry.baseline.score)))}`
  ].join("\n");

  const response = await generateGeminiJson({
    prompt,
    schema: batchRecommendationsSchema,
    timeoutMs: 12000
  });

  if (!response) {
    return results;
  }

  for (const match of response.matches) {
    const baseline = baselineByJobId.get(match.jobId);
    if (baseline) {
      results.set(match.jobId, buildHybridResult(baseline, match.score, match.explanation));
    }
  }

  return results;
};
