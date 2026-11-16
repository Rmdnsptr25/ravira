const assert = require("node:assert/strict");
const { test } = require("node:test");

const { env } = require("../../dist/config/env");
const { setGeminiHttpPostForTests } = require("../../dist/modules/ai/gemini.service");
const {
  evaluateJobMatchWithGemini,
  evaluateJobRecommendationsWithGemini
} = require("../../dist/modules/ai/jobMatchingAi.service");
const { extractSkillsWithGemini } = require("../../dist/modules/candidates/candidateCvParser.service");

const sampleCandidate = {
  location: "Jakarta",
  education: "S1 Teknik Informatika",
  experienceSummary: "3 tahun membangun backend TypeScript, Node.js, dan PostgreSQL.",
  salaryExpectation: 12000000,
  mobilityPreference: "FLEXIBLE",
  skills: [
    { skillName: "TypeScript", level: "ADVANCED" },
    { skillName: "Node.js", level: "ADVANCED" }
  ]
};

const sampleJob = {
  id: "job-1111-2222-3333-444444444444",
  title: "Backend Engineer",
  description: "Membangun API dengan Node.js, TypeScript, dan PostgreSQL.",
  location: "Jakarta",
  jobType: "FULL_TIME",
  workType: "HYBRID",
  employmentType: "PERMANENT",
  company: { name: "Ravira Tech", industry: "Technology" },
  skills: [
    { skillName: "TypeScript", required: true, weight: 2 },
    { skillName: "PostgreSQL", required: true, weight: 1 }
  ]
};

const sampleBaseline = {
  score: 75,
  explanation: ["Skill cocok: TypeScript."],
  breakdown: { skillMatch: 50, locationMatch: 25 },
  ruleVersion: "mvp-rule-v1"
};

const mockGeminiTextResponse = (payload) => async () => ({
  statusCode: 200,
  body: JSON.stringify({
    candidates: [
      {
        content: {
          parts: [{ text: JSON.stringify(payload) }]
        }
      }
    ]
  })
});

test("Gemini AI helpers return null when GEMINI_API_KEY is empty", async () => {
  const originalKey = env.GEMINI_API_KEY;
  env.GEMINI_API_KEY = "";

  try {
    const match = await evaluateJobMatchWithGemini(sampleCandidate, sampleJob, sampleBaseline);
    const batch = await evaluateJobRecommendationsWithGemini(sampleCandidate, [
      { job: sampleJob, baseline: sampleBaseline }
    ]);
    const skills = await extractSkillsWithGemini("Berpengalaman menggunakan TypeScript dan React.");

    assert.equal(match, null);
    assert.equal(batch.size, 0);
    assert.equal(skills, null);
  } finally {
    env.GEMINI_API_KEY = originalKey;
  }
});

test("evaluateJobMatchWithGemini parses valid Gemini JSON into hybrid score", async () => {
  const originalKey = env.GEMINI_API_KEY;
  env.GEMINI_API_KEY = "test-gemini-key";
  setGeminiHttpPostForTests(
    mockGeminiTextResponse({
      score: 88.4,
      explanation: [
        "Kandidat menguasai TypeScript dan Node.js sesuai kebutuhan utama.",
        "Lokasi Jakarta selaras dengan posisi hybrid."
      ]
    })
  );

  try {
    const result = await evaluateJobMatchWithGemini(sampleCandidate, sampleJob, sampleBaseline);
    assert.ok(result);
    assert.equal(result.score, 88);
    assert.equal(result.ruleVersion, "gemini-hybrid-v1");
    assert.equal(result.explanation.length, 2);
    assert.equal(result.breakdown.aiProvider, "gemini");
    assert.equal(result.breakdown.baselineRuleScore, 75);
  } finally {
    env.GEMINI_API_KEY = originalKey;
    setGeminiHttpPostForTests(null);
  }
});

test("evaluateJobRecommendationsWithGemini maps valid batch results and ignores unknown jobIds", async () => {
  const originalKey = env.GEMINI_API_KEY;
  env.GEMINI_API_KEY = "test-gemini-key";
  setGeminiHttpPostForTests(
    mockGeminiTextResponse({
      matches: [
        {
          jobId: sampleJob.id,
          score: 91,
          explanation: ["Pengalaman Node.js dan TypeScript sangat relevan."]
        },
        {
          jobId: "unknown-job-id",
          score: 50,
          explanation: ["Tidak ada di input."]
        }
      ]
    })
  );

  try {
    const map = await evaluateJobRecommendationsWithGemini(sampleCandidate, [
      { job: sampleJob, baseline: sampleBaseline }
    ]);
    assert.equal(map.size, 1);
    const entry = map.get(sampleJob.id);
    assert.ok(entry);
    assert.equal(entry.score, 91);
    assert.equal(entry.ruleVersion, "gemini-hybrid-v1");
  } finally {
    env.GEMINI_API_KEY = originalKey;
    setGeminiHttpPostForTests(null);
  }
});

test("extractSkillsWithGemini deduplicates skills and falls back cleanly on HTTP error", async () => {
  const originalKey = env.GEMINI_API_KEY;
  env.GEMINI_API_KEY = "test-gemini-key";
  setGeminiHttpPostForTests(
    mockGeminiTextResponse({
      skills: [
        { skillName: "TypeScript", confidenceScore: 95 },
        { skillName: "typescript", confidenceScore: 80 },
        { skillName: "PostgreSQL", confidenceScore: 89 }
      ]
    })
  );

  try {
    const extracted = await extractSkillsWithGemini(
      "Pengalaman 3 tahun dengan TypeScript, Node.js, dan PostgreSQL."
    );
    assert.ok(extracted);
    assert.equal(extracted.length, 2);
    assert.deepEqual(extracted[0], {
      skillName: "TypeScript",
      confidenceScore: 95,
      source: "CV_PARSER"
    });

    setGeminiHttpPostForTests(async () => ({ statusCode: 500, body: "error" }));
    const fallbackResult = await extractSkillsWithGemini(
      "Pengalaman 3 tahun dengan TypeScript dan PostgreSQL."
    );
    assert.equal(fallbackResult, null);
  } finally {
    env.GEMINI_API_KEY = originalKey;
    setGeminiHttpPostForTests(null);
  }
});
