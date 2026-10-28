import { JobStatus, Prisma, Role } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { createAuditLog } from "../audit-logs/auditLog.service";
import { requireApprovedRecruiter } from "../recruiters/recruiterAccess.service";

const SCORING_RULE_VERSION = "mvp-rule-v1";

type PrismaExecutor = Prisma.TransactionClient | typeof prisma;

interface ScoreResult {
  score: number;
  explanation: string[];
  breakdown: Record<string, unknown>;
  ruleVersion: string;
}

const candidateScoringSelect = {
  id: true,
  location: true,
  education: true,
  experienceSummary: true,
  salaryExpectation: true,
  mobilityPreference: true,
  cvUrl: true,
  profileVisibility: true,
  user: {
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      isActive: true
    }
  },
  skills: {
    select: {
      id: true,
      skillName: true,
      level: true,
      source: true,
      confidenceScore: true
    }
  }
} satisfies Prisma.CandidateSelect;

const jobScoringSelect = {
  id: true,
  title: true,
  description: true,
  location: true,
  jobType: true,
  workType: true,
  employmentType: true,
  status: true,
  companyId: true,
  company: {
    select: {
      id: true,
      name: true,
      industry: true,
      location: true
    }
  },
  skills: {
    select: {
      id: true,
      skillName: true,
      required: true,
      weight: true
    }
  }
} satisfies Prisma.JobSelect;

type CandidateForScoring = Prisma.CandidateGetPayload<{
  select: typeof candidateScoringSelect;
}>;

type JobForScoring = Prisma.JobGetPayload<{
  select: typeof jobScoringSelect;
}>;

const normalized = (value?: string | null) => value?.trim().toLowerCase() ?? "";

const containsNormalized = (text: string | null | undefined, keyword: string | null | undefined) => {
  const safeText = normalized(text);
  const safeKeyword = normalized(keyword);
  return safeText.length > 0 && safeKeyword.length > 0 && safeText.includes(safeKeyword);
};

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const toJsonValue = (value: unknown): Prisma.InputJsonValue => {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
};

const formatExplanation = (reasons: string[]) => {
  const fallbackReasons = [
    "Perhitungan menggunakan rule-based MVP Ravira.",
    "Skor dipakai sebagai decision support, bukan keputusan otomatis.",
    "Breakdown tersedia untuk menjaga transparansi rekomendasi."
  ];

  return [...reasons, ...fallbackReasons].slice(0, Math.max(3, reasons.length));
};

const getCandidateByUserId = async (userId: string, client: PrismaExecutor = prisma) => {
  const candidate = await client.candidate.findUnique({
    where: { userId },
    select: candidateScoringSelect
  });

  if (!candidate) {
    throw new AppError("Candidate profile not found.", 404);
  }

  return candidate;
};

const getCandidateById = async (candidateId: string, client: PrismaExecutor = prisma) => {
  const candidate = await client.candidate.findUnique({
    where: { id: candidateId },
    select: candidateScoringSelect
  });

  if (!candidate) {
    throw new AppError("Candidate profile not found.", 404);
  }

  return candidate;
};

const getPublishedJobById = async (jobId: string, client: PrismaExecutor = prisma) => {
  const job = await client.job.findFirst({
    where: {
      id: jobId,
      status: JobStatus.PUBLISHED
    },
    select: jobScoringSelect
  });

  if (!job) {
    throw new AppError("Published job not found.", 404);
  }

  return job;
};

const getJobById = async (jobId: string, client: PrismaExecutor = prisma) => {
  const job = await client.job.findUnique({
    where: { id: jobId },
    select: jobScoringSelect
  });

  if (!job) {
    throw new AppError("Job not found.", 404);
  }

  return job;
};

const calculateSkillMatch = (candidate: CandidateForScoring, job: JobForScoring) => {
  if (job.skills.length === 0) {
    return {
      coverage: 1,
      matchedSkills: [] as string[],
      missingRequiredSkills: [] as string[]
    };
  }

  const candidateSkills = new Set(candidate.skills.map((skill) => normalized(skill.skillName)));
  const matchedSkills = job.skills
    .filter((skill) => candidateSkills.has(normalized(skill.skillName)))
    .map((skill) => skill.skillName);

  const requiredSkills = job.skills.filter((skill) => skill.required);
  const missingRequiredSkills = requiredSkills
    .filter((skill) => !candidateSkills.has(normalized(skill.skillName)))
    .map((skill) => skill.skillName);

  const totalWeight = job.skills.reduce((sum, skill) => sum + Math.max(skill.weight, 1), 0);
  const matchedWeight = job.skills
    .filter((skill) => candidateSkills.has(normalized(skill.skillName)))
    .reduce((sum, skill) => sum + Math.max(skill.weight, 1), 0);

  return {
    coverage: totalWeight === 0 ? 0 : matchedWeight / totalWeight,
    matchedSkills,
    missingRequiredSkills
  };
};

const calculateAiMatchScore = (
  candidate: CandidateForScoring,
  job: JobForScoring
): ScoreResult => {
  const skillMatch = calculateSkillMatch(candidate, job);
  const skillScore = skillMatch.coverage * 50;

  const locationMatches =
    normalized(candidate.location).length > 0 &&
    normalized(job.location).length > 0 &&
    (normalized(candidate.location).includes(normalized(job.location)) ||
      normalized(job.location).includes(normalized(candidate.location)));
  const locationScore = locationMatches ? 20 : 0;

  const mobility = normalized(candidate.mobilityPreference);
  const workType = normalized(job.workType);
  const jobType = normalized(job.jobType ?? job.employmentType);
  const workTypeScore =
    (mobility && workType && (mobility.includes(workType) || workType.includes(mobility))) ||
    (mobility && jobType && (mobility.includes(jobType) || jobType.includes(mobility)))
      ? 15
      : 0;

  const experienceText = `${candidate.experienceSummary ?? ""} ${candidate.education ?? ""}`;
  const experienceKeywords = [
    job.title,
    job.jobType,
    job.employmentType,
    ...job.skills.map((skill) => skill.skillName)
  ].filter(Boolean) as string[];
  const matchedExperienceKeywords = experienceKeywords.filter((keyword) =>
    containsNormalized(experienceText, keyword)
  );
  const experienceScore =
    experienceKeywords.length === 0
      ? 0
      : Math.min(matchedExperienceKeywords.length / Math.min(experienceKeywords.length, 3), 1) * 15;

  const score = clampScore(skillScore + locationScore + workTypeScore + experienceScore);

  const reasons = formatExplanation([
    skillMatch.matchedSkills.length > 0
      ? `Skill cocok: ${skillMatch.matchedSkills.slice(0, 5).join(", ")}.`
      : "Belum ada skill kandidat yang cocok dengan skill lowongan.",
    locationMatches
      ? "Lokasi kandidat relevan dengan lokasi lowongan."
      : "Lokasi kandidat belum cocok langsung dengan lokasi lowongan.",
    workTypeScore > 0
      ? "Preferensi mobilitas kandidat relevan dengan work type atau job type lowongan."
      : "Preferensi mobilitas kandidat belum cocok dengan work type atau job type lowongan.",
    matchedExperienceKeywords.length > 0
      ? "Ringkasan pengalaman kandidat memuat kata kunci relevan."
      : "Relevansi pengalaman masih terbatas berdasarkan ringkasan profil."
  ]);

  return {
    score,
    explanation: reasons,
    breakdown: {
      skillMatch: {
        weight: 50,
        score: clampScore(skillScore),
        coverage: Number(skillMatch.coverage.toFixed(2)),
        matchedSkills: skillMatch.matchedSkills,
        missingRequiredSkills: skillMatch.missingRequiredSkills
      },
      locationMatch: {
        weight: 20,
        score: clampScore(locationScore),
        candidateLocation: candidate.location,
        jobLocation: job.location,
        matched: locationMatches
      },
      workTypeJobTypeMatch: {
        weight: 15,
        score: clampScore(workTypeScore),
        mobilityPreference: candidate.mobilityPreference,
        jobType: job.jobType,
        workType: job.workType
      },
      experienceRelevance: {
        weight: 15,
        score: clampScore(experienceScore),
        matchedKeywords: matchedExperienceKeywords.slice(0, 5)
      }
    },
    ruleVersion: SCORING_RULE_VERSION
  };
};

const calculateProfileCompleteness = (candidate: CandidateForScoring) => {
  const fields = [
    candidate.user.fullName,
    candidate.user.phone,
    candidate.location,
    candidate.education,
    candidate.experienceSummary,
    candidate.salaryExpectation,
    candidate.mobilityPreference,
    candidate.skills.length > 0 ? "skills" : null
  ];

  const completed = fields.filter((field) => field !== null && field !== undefined && String(field).trim() !== "")
    .length;

  return completed / fields.length;
};

const calculateCandidateScore = (
  candidate: CandidateForScoring,
  job: JobForScoring,
  matchScore: ScoreResult
): ScoreResult => {
  const skillMatch = calculateSkillMatch(candidate, job);
  const profileCompleteness = calculateProfileCompleteness(candidate);
  const requiredSkills = job.skills.filter((skill) => skill.required);
  const requiredSkillCoverage =
    requiredSkills.length === 0
      ? 1
      : (requiredSkills.length - skillMatch.missingRequiredSkills.length) / requiredSkills.length;
  const basicVerificationScore = candidate.user.isActive ? 1 : 0;

  const matchScoreComponent = (matchScore.score / 100) * 50;
  const profileCompletenessComponent = profileCompleteness * 20;
  const requiredSkillCoverageComponent = requiredSkillCoverage * 20;
  const verificationComponent = basicVerificationScore * 10;

  const score = clampScore(
    matchScoreComponent +
      profileCompletenessComponent +
      requiredSkillCoverageComponent +
      verificationComponent
  );

  const reasons = formatExplanation([
    `AI Match Score berkontribusi ${clampScore(matchScoreComponent)} dari 50 poin.`,
    `Kelengkapan profil mencapai ${Math.round(profileCompleteness * 100)}%.`,
    `Coverage required skill mencapai ${Math.round(requiredSkillCoverage * 100)}%.`,
    candidate.user.isActive
      ? "Status user aktif sehingga lolos basic verification MVP."
      : "Status user tidak aktif sehingga basic verification rendah."
  ]);

  return {
    score,
    explanation: reasons,
    breakdown: {
      matchScore: {
        weight: 50,
        score: clampScore(matchScoreComponent),
        sourceScore: matchScore.score
      },
      profileCompleteness: {
        weight: 20,
        score: clampScore(profileCompletenessComponent),
        percentage: Math.round(profileCompleteness * 100)
      },
      requiredSkillCoverage: {
        weight: 20,
        score: clampScore(requiredSkillCoverageComponent),
        percentage: Math.round(requiredSkillCoverage * 100),
        missingRequiredSkills: skillMatch.missingRequiredSkills
      },
      verificationRiskBasic: {
        weight: 10,
        score: clampScore(verificationComponent),
        userActive: candidate.user.isActive,
        manualReviewRequired: false
      }
    },
    ruleVersion: SCORING_RULE_VERSION
  };
};

const explanationToText = (explanation: string[]) => explanation.join(" ");

export const upsertAiMatchScore = async (
  candidateId: string,
  jobId: string,
  applicationId?: string | null,
  client: PrismaExecutor = prisma,
  requirePublished = true
) => {
  const candidate = await getCandidateById(candidateId, client);
  const job = requirePublished ? await getPublishedJobById(jobId, client) : await getJobById(jobId, client);
  const result = calculateAiMatchScore(candidate, job);
  const breakdownJson = toJsonValue(result.breakdown);

  await client.matchScore.upsert({
    where: {
      candidateId_jobId: {
        candidateId,
        jobId
      }
    },
    update: {
      applicationId: applicationId ?? undefined,
      score: result.score,
      explanation: explanationToText(result.explanation),
      reasons: breakdownJson,
      ruleVersion: result.ruleVersion
    },
    create: {
      candidateId,
      jobId,
      applicationId: applicationId ?? undefined,
      score: result.score,
      explanation: explanationToText(result.explanation),
      reasons: breakdownJson,
      ruleVersion: result.ruleVersion
    }
  });

  return result;
};

export const upsertCandidateScore = async (
  candidateId: string,
  jobId: string,
  applicationId: string | null,
  actorUserId?: string,
  actorRole?: Role,
  client: PrismaExecutor = prisma,
  requirePublished = true
) => {
  const candidate = await getCandidateById(candidateId, client);
  const job = requirePublished ? await getPublishedJobById(jobId, client) : await getJobById(jobId, client);
  const matchScore = calculateAiMatchScore(candidate, job);
  const result = calculateCandidateScore(candidate, job, matchScore);
  const breakdownJson = toJsonValue(result.breakdown);

  const persisted = await client.candidateScore.upsert({
    where: {
      candidateId_jobId: {
        candidateId,
        jobId
      }
    },
    update: {
      applicationId: applicationId ?? undefined,
      score: result.score,
      explanation: explanationToText(result.explanation),
      breakdown: breakdownJson,
      ruleVersion: result.ruleVersion,
      manualReviewRequired: false
    },
    create: {
      candidateId,
      jobId,
      applicationId: applicationId ?? undefined,
      score: result.score,
      explanation: explanationToText(result.explanation),
      breakdown: breakdownJson,
      ruleVersion: result.ruleVersion,
      manualReviewRequired: false
    },
    select: {
      id: true,
      score: true,
      explanation: true,
      breakdown: true,
      ruleVersion: true,
      manualReviewRequired: true,
      createdAt: true,
      updatedAt: true
    }
  });

  await createAuditLog(
    {
      actorUserId,
      actorRole,
      action: "CANDIDATE_SCORE_GENERATED",
      entityType: "CandidateScore",
      entityId: persisted.id,
      afterValue: {
        candidateId,
        jobId,
        applicationId,
        score: result.score,
        ruleVersion: result.ruleVersion
      },
      reason: "Rule-based MVP candidate score generated."
    },
    client
  );

  return result;
};

export const getCandidateJobRecommendations = async (userId: string) => {
  const candidate = await getCandidateByUserId(userId);
  const jobs = await prisma.job.findMany({
    where: { status: JobStatus.PUBLISHED },
    select: jobScoringSelect,
    orderBy: { createdAt: "desc" }
  });

  const recommendations = await Promise.all(
    jobs.map(async (job) => {
      const matchScore = calculateAiMatchScore(candidate, job);
      const breakdownJson = toJsonValue(matchScore.breakdown);
      await prisma.matchScore.upsert({
        where: {
          candidateId_jobId: {
            candidateId: candidate.id,
            jobId: job.id
          }
        },
        update: {
          score: matchScore.score,
          explanation: explanationToText(matchScore.explanation),
          reasons: breakdownJson,
          ruleVersion: matchScore.ruleVersion
        },
        create: {
          candidateId: candidate.id,
          jobId: job.id,
          score: matchScore.score,
          explanation: explanationToText(matchScore.explanation),
          reasons: breakdownJson,
          ruleVersion: matchScore.ruleVersion
        }
      });

      return {
        job: {
          id: job.id,
          title: job.title,
          location: job.location,
          jobType: job.jobType,
          workType: job.workType
        },
        company: job.company,
        matchScore: matchScore.score,
        matchExplanation: matchScore.explanation,
        breakdown: matchScore.breakdown,
        ruleVersion: matchScore.ruleVersion
      };
    })
  );

  return recommendations.sort((left, right) => right.matchScore - left.matchScore);
};

export const getMyJobMatchScore = async (userId: string, jobId: string) => {
  const candidate = await getCandidateByUserId(userId);
  await getPublishedJobById(jobId);
  const result = await upsertAiMatchScore(candidate.id, jobId);

  return {
    jobId,
    matchScore: result.score,
    matchExplanation: result.explanation,
    breakdown: result.breakdown,
    ruleVersion: result.ruleVersion
  };
};

export const getRecruiterJobCandidateScores = async (userId: string, jobId: string) => {
  const { companyId } = await requireApprovedRecruiter(userId);
  const job = await prisma.job.findFirst({
    where: { id: jobId, companyId },
    select: { id: true }
  });

  if (!job) {
    throw new AppError("Job not found.", 404);
  }

  const applications = await prisma.application.findMany({
    where: { jobId, job: { companyId } },
    select: {
      id: true,
      status: true,
      candidateId: true,
      jobId: true,
      candidate: {
        select: {
          id: true,
          location: true,
          education: true,
          experienceSummary: true,
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              phone: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return Promise.all(
    applications.map(async (application) => {
      const matchScore = await upsertAiMatchScore(
        application.candidateId,
        application.jobId,
        application.id,
        prisma,
        false
      );
      const candidateScore = await upsertCandidateScore(
        application.candidateId,
        application.jobId,
        application.id,
        userId,
        Role.RECRUITER,
        prisma,
        false
      );

      return {
        applicationId: application.id,
        applicationStatus: application.status,
        candidate: {
          id: application.candidate.id,
          fullName: application.candidate.user.fullName,
          email: application.candidate.user.email,
          phone: application.candidate.user.phone,
          location: application.candidate.location,
          education: application.candidate.education,
          experienceSummary: application.candidate.experienceSummary
        },
        matchScore: matchScore.score,
        matchExplanation: matchScore.explanation,
        candidateScore: candidateScore.score,
        candidateScoreBreakdown: candidateScore.breakdown,
        explanation: candidateScore.explanation,
        ruleVersion: candidateScore.ruleVersion
      };
    })
  );
};

export const getApplicationCandidateScore = async (
  applicationId: string,
  userId: string,
  role: Role
) => {
  const where: Prisma.ApplicationWhereUniqueInput = { id: applicationId };

  switch (role) {
    case Role.RECRUITER: {
      const recruiter = await requireApprovedRecruiter(userId);
      where.job = { companyId: recruiter.companyId };
      break;
    }
    case Role.ADMIN:
    case Role.SUPER_ADMIN:
      break;
    case Role.CANDIDATE:
      throw new AppError("Candidates cannot access Candidate Score.", 403);
    default:
      throw new AppError("You do not have permission to access this resource.", 403);
  }

  const application = await prisma.application.findUnique({
    where,
    select: {
      id: true,
      status: true,
      candidateId: true,
      jobId: true,
      job: {
        select: {
          id: true,
          title: true,
          companyId: true
        }
      },
      candidate: {
        select: {
          id: true,
          location: true,
          education: true,
          experienceSummary: true,
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              phone: true
            }
          }
        }
      }
    }
  });

  if (!application) {
    throw new AppError("Application not found.", 404);
  }

  const matchScore = await upsertAiMatchScore(
    application.candidateId,
    application.jobId,
    application.id,
    prisma,
    false
  );
  const candidateScore = await upsertCandidateScore(
    application.candidateId,
    application.jobId,
    application.id,
    userId,
    role,
    prisma,
    false
  );

  return {
    applicationId: application.id,
    applicationStatus: application.status,
    job: {
      id: application.job.id,
      title: application.job.title
    },
    candidate: {
      id: application.candidate.id,
      fullName: application.candidate.user.fullName,
      email: application.candidate.user.email,
      phone: application.candidate.user.phone,
      location: application.candidate.location,
      education: application.candidate.education,
      experienceSummary: application.candidate.experienceSummary
    },
    matchScore: matchScore.score,
    matchExplanation: matchScore.explanation,
    candidateScore: candidateScore.score,
    candidateScoreBreakdown: candidateScore.breakdown,
    explanation: candidateScore.explanation,
    ruleVersion: candidateScore.ruleVersion
  };
};
