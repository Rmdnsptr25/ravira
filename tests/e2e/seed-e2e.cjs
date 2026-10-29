const fs = require("node:fs");
const path = require("node:path");
const { loadAndAssertE2EEnvironment } = require("./e2e-safety-gate.cjs");
const envInfo = loadAndAssertE2EEnvironment();

const bcrypt = require("bcrypt");
const {
  PrismaClient,
  Role,
  CompanyVerificationStatus,
  JobStatus,
  AppealStatus,
  FraudRiskLevel,
  FraudReviewStatus,
  ProfileVisibility,
} = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: envInfo.databaseUrl,
    },
  },
});
const E2E_SYNTHETIC_PASSWORD = process.env.SEED_PASSWORD || ["TestUser", "123!"].join("");

const SEED_COURSES = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    title: "JavaScript Dasar untuk Web",
    provider: "Ravira Learning Partner",
    skillTargets: ["JavaScript"],
    duration: "8 jam",
    price: 0,
    difficulty: "BEGINNER",
    language: "id",
    url: "https://learning.ravira.local/courses/javascript-basic",
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    title: "TypeScript untuk Backend MVP",
    provider: "Ravira Learning Partner",
    skillTargets: ["TypeScript"],
    duration: "10 jam",
    price: 0,
    difficulty: "INTERMEDIATE",
    language: "id",
    url: "https://learning.ravira.local/courses/typescript-backend",
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    title: "Node.js API Development",
    provider: "Ravira Learning Partner",
    skillTargets: ["Node.js", "JavaScript"],
    duration: "14 jam",
    price: 200000,
    difficulty: "INTERMEDIATE",
    language: "id",
    url: "https://learning.ravira.local/courses/node-api",
  },
];

async function upsertUser(email, fullName, role, passwordHash) {
  return prisma.user.upsert({
    where: { email },
    update: { fullName, role, isActive: true, passwordHash },
    create: { email, fullName, role, isActive: true, passwordHash },
  });
}

async function upsertRecruiterWithCompany({
  email,
  fullName,
  companyId,
  companyName,
  location,
  industry,
  status,
  passwordHash,
}) {
  const user = await upsertUser(email, fullName, Role.RECRUITER, passwordHash);

  const company = await prisma.company.upsert({
    where: { id: companyId },
    update: {
      name: companyName,
      industry,
      location,
      website: null,
      description: null,
      verificationStatus: status,
      verifiedAt: status === CompanyVerificationStatus.APPROVED ? new Date() : null,
    },
    create: {
      id: companyId,
      name: companyName,
      industry,
      location,
      website: null,
      description: null,
      verificationStatus: status,
      verifiedAt: status === CompanyVerificationStatus.APPROVED ? new Date() : null,
    },
  });

  const recruiter = await prisma.recruiter.upsert({
    where: { userId: user.id },
    update: { companyId: company.id, position: "HR Manager" },
    create: { userId: user.id, companyId: company.id, position: "HR Manager" },
  });

  return { user, company, recruiter };
}

async function upsertJobWithSkills({
  id,
  companyId,
  recruiterId,
  title,
  description,
  location,
  workType,
  skills,
}) {
  const existingByTitle = id
    ? await prisma.job.findUnique({ where: { id } })
    : await prisma.job.findFirst({ where: { companyId, title } });

  const jobData = {
    companyId,
    createdByRecruiterId: recruiterId,
    title,
    description,
    location,
    jobType: "FULL_TIME",
    workType: workType || "REMOTE",
    employmentType: "FULL_TIME",
    salaryMin: 8000000,
    salaryMax: 16000000,
    status: JobStatus.PUBLISHED,
  };

  const job = existingByTitle
    ? await prisma.job.update({ where: { id: existingByTitle.id }, data: jobData })
    : await prisma.job.create({ data: id ? { id, ...jobData } : jobData });

  await prisma.jobSkill.deleteMany({ where: { jobId: job.id } });
  await prisma.jobSkill.createMany({
    data: skills.map((skillName, idx) => ({
      jobId: job.id,
      skillName,
      required: true,
      weight: idx + 1,
    })),
  });

  return job;
}

async function seedE2EFixtures() {
  loadAndAssertE2EEnvironment();
  const passwordHash = await bcrypt.hash(E2E_SYNTHETIC_PASSWORD, 8);

  // Clean up ephemeral E2E registered candidates (e2e-cand-*@ravira.local) from prior runs
  const ephemeralUsers = await prisma.user.findMany({
    where: {
      email: { startsWith: "e2e-cand-", endsWith: "@ravira.local" },
    },
    select: { id: true },
  });
  if (ephemeralUsers.length > 0) {
    const ephUserIds = ephemeralUsers.map((u) => u.id);
    await prisma.consent.deleteMany({ where: { userId: { in: ephUserIds } } });
    await prisma.auditLog.deleteMany({ where: { actorId: { in: ephUserIds } } });
    await prisma.candidate.deleteMany({ where: { userId: { in: ephUserIds } } });
    await prisma.user.deleteMany({ where: { id: { in: ephUserIds } } });
  }

  // 1. Admin & Base Candidate
  const admin = await upsertUser("seed-admin@ravira.local", "Seed Admin", Role.ADMIN, passwordHash);
  const candidateUser = await upsertUser(
    "seed-candidate@ravira.local",
    "Seed Candidate",
    Role.CANDIDATE,
    passwordHash
  );

  const candidate = await prisma.candidate.upsert({
    where: { userId: candidateUser.id },
    update: {
      headline: "Backend Engineer Candidate",
      location: "Bandung",
      education: "S1 Teknik Informatika",
      experienceSummary: "Memiliki pengalaman membangun REST API dengan Node.js dan PostgreSQL.",
      salaryExpectation: 9000000,
      mobilityPreference: "HYBRID",
      profileVisibility: ProfileVisibility.PUBLIC,
    },
    create: {
      userId: candidateUser.id,
      headline: "Backend Engineer Candidate",
      location: "Bandung",
      education: "S1 Teknik Informatika",
      experienceSummary: "Memiliki pengalaman membangun REST API dengan Node.js dan PostgreSQL.",
      salaryExpectation: 9000000,
      mobilityPreference: "HYBRID",
      profileVisibility: ProfileVisibility.PUBLIC,
    },
  });

  // Reset ephemeral E2E skills, saved jobs & CV documents on seed candidate
  const existingDocs = await prisma.candidateDocument.findMany({
    where: { candidateId: candidate.id },
    select: { storagePath: true },
  });
  for (const doc of existingDocs) {
    if (doc.storagePath) {
      const absPath = path.resolve(envInfo.rootDir, doc.storagePath);
      const uploadsRoot = path.resolve(envInfo.rootDir, "uploads", "cv");
      if (absPath.startsWith(`${uploadsRoot}${path.sep}`) && fs.existsSync(absPath)) {
        try {
          fs.unlinkSync(absPath);
        } catch {
          // ignore if already removed
        }
      }
    }
  }
  await prisma.candidateDocument.deleteMany({ where: { candidateId: candidate.id } });
  await prisma.savedJob.deleteMany({ where: { candidateId: candidate.id } });
  await prisma.candidateSkill.deleteMany({
    where: { candidateId: candidate.id, skillName: { startsWith: "NodeJS-" } },
  });

  await prisma.candidateSkill.upsert({
    where: {
      candidateId_skillName: { candidateId: candidate.id, skillName: "TypeScript" },
    },
    update: { level: "INTERMEDIATE", source: "seed", confidenceScore: 90 },
    create: {
      candidateId: candidate.id,
      skillName: "TypeScript",
      level: "INTERMEDIATE",
      source: "seed",
      confidenceScore: 90,
    },
  });

  // 2. Approved Recruiter & Seed Jobs
  const approvedRecruiter = await upsertRecruiterWithCompany({
    email: "seed-recruiter@ravira.local",
    fullName: "Seed Recruiter",
    companyId: "00000000-0000-4000-8000-000000000001",
    companyName: "Seed Ravira Company",
    location: "Jakarta",
    industry: "Technology",
    status: CompanyVerificationStatus.APPROVED,
    passwordHash,
  });

  // Remove ephemeral job created by E2E-REC-04
  await prisma.job.deleteMany({ where: { title: "QA E2E Engineer Surabaya" } });

  const backendJob = await upsertJobWithSkills({
    companyId: approvedRecruiter.company.id,
    recruiterId: approvedRecruiter.recruiter.id,
    title: "Seed Backend Engineer",
    description: "Build backend APIs for Ravira.",
    location: "Jakarta",
    workType: "REMOTE",
    skills: ["TypeScript", "Node.js", "Prisma"],
  });

  // Reset seed candidate's application on backendJob so E2E-CAND-09 executes a fresh POST /apply
  const existingApps = await prisma.application.findMany({
    where: { candidateId: candidate.id, jobId: backendJob.id },
    select: { id: true },
  });
  if (existingApps.length > 0) {
    const appIds = existingApps.map((a) => a.id);
    await prisma.applicationStatusHistory.deleteMany({ where: { applicationId: { in: appIds } } });
    await prisma.matchScore.deleteMany({ where: { applicationId: { in: appIds } } });
    await prisma.candidateScore.deleteMany({ where: { applicationId: { in: appIds } } });
    await prisma.application.deleteMany({ where: { id: { in: appIds } } });
  }

  const fullStackJob = await upsertJobWithSkills({
    companyId: approvedRecruiter.company.id,
    recruiterId: approvedRecruiter.recruiter.id,
    title: "Seed Full Stack Engineer",
    description: "Build product features across backend and frontend integration.",
    location: "Bandung",
    workType: "REMOTE",
    skills: ["TypeScript", "Express.js", "PostgreSQL"],
  });

  // 3. Pending, Rejected & Other Approved Companies for Recruiter/Admin E2E tests
  const pending1 = await upsertRecruiterWithCompany({
    email: "pending-recruiter@ravira.local",
    fullName: "Recruiter Pending",
    companyId: "00000000-0000-4000-8000-000000000002",
    companyName: "PT Ravira Pending Nusantara",
    location: "Surabaya",
    industry: "Fintech",
    status: CompanyVerificationStatus.PENDING,
    passwordHash,
  });

  const pendingApproveTarget = await upsertRecruiterWithCompany({
    email: "pending-approve@ravira.local",
    fullName: "Recruiter Pending Approve",
    companyId: "00000000-0000-4000-8000-000000000005",
    companyName: "PT Ravira Siap Verifikasi",
    location: "Yogyakarta",
    industry: "Cloud Computing",
    status: CompanyVerificationStatus.PENDING,
    passwordHash,
  });

  const pendingRejectTarget = await upsertRecruiterWithCompany({
    email: "pending-reject@ravira.local",
    fullName: "Recruiter Pending Reject",
    companyId: "00000000-0000-4000-8000-000000000006",
    companyName: "PT Ravira Dokumen Kurang",
    location: "Semarang",
    industry: "Logistik",
    status: CompanyVerificationStatus.PENDING,
    passwordHash,
  });

  const rejected1 = await upsertRecruiterWithCompany({
    email: "rejected-recruiter@ravira.local",
    fullName: "Recruiter Rejected",
    companyId: "00000000-0000-4000-8000-000000000003",
    companyName: "PT Ravira Rejected Digital",
    location: "Malang",
    industry: "Media",
    status: CompanyVerificationStatus.REJECTED,
    passwordHash,
  });

  const otherApproved = await upsertRecruiterWithCompany({
    email: "other-recruiter@ravira.local",
    fullName: "Recruiter Mitra Kedua",
    companyId: "00000000-0000-4000-8000-000000000004",
    companyName: "PT Ravira Mitra Kedua",
    location: "Yogyakarta",
    industry: "EdTech",
    status: CompanyVerificationStatus.APPROVED,
    passwordHash,
  });

  const otherJob = await upsertJobWithSkills({
    id: "30000000-0000-4000-8000-000000000001",
    companyId: otherApproved.company.id,
    recruiterId: otherApproved.recruiter.id,
    title: "Other Company Data Engineer",
    description: "Build data pipelines in Yogyakarta.",
    location: "Yogyakarta",
    workType: "HYBRID",
    skills: ["SQL", "Python"],
  });

  // 4. Courses (sequential to respect connection pool limits)
  for (const course of SEED_COURSES) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {
        title: course.title,
        provider: course.provider,
        skillTargets: course.skillTargets,
        duration: course.duration,
        price: course.price,
        difficulty: course.difficulty,
        language: course.language,
        url: course.url,
      },
      create: course,
    });
  }

  // 5. FraudCase & Signal (OPEN)
  const existingFraudCase = await prisma.fraudCase.findFirst({
    where: { candidateId: candidate.id },
    select: { id: true },
  });

  const fraudCase = existingFraudCase
    ? await prisma.fraudCase.update({
        where: { id: existingFraudCase.id },
        data: {
          riskScore: 30,
          riskLevel: FraudRiskLevel.LOW,
          reviewStatus: FraudReviewStatus.OPEN,
          decision: null,
          reason: null,
          reviewerId: null,
          decidedAt: null,
        },
      })
    : await prisma.fraudCase.create({
        data: {
          candidateId: candidate.id,
          riskScore: 30,
          riskLevel: FraudRiskLevel.LOW,
          reviewStatus: FraudReviewStatus.OPEN,
        },
      });

  await prisma.fraudCase.updateMany({
    where: { candidateId: candidate.id },
    data: {
      reviewStatus: FraudReviewStatus.OPEN,
      decision: null,
      reason: null,
      reviewerId: null,
      decidedAt: null,
    },
  });

  const existingSignal = await prisma.fraudSignal.findFirst({
    where: {
      candidateId: candidate.id,
      caseId: fraudCase.id,
      signalType: "SIMILAR_NAME_LOCATION",
    },
    select: { id: true },
  });

  if (existingSignal) {
    await prisma.fraudSignal.update({
      where: { id: existingSignal.id },
      data: {
        riskLevel: FraudRiskLevel.LOW,
        evidenceHash: "seed-low-risk-profile-similarity",
        evidenceMasked: "profile_similarity=seed_low_risk_example",
        status: FraudReviewStatus.OPEN,
      },
    });
  } else {
    await prisma.fraudSignal.create({
      data: {
        candidateId: candidate.id,
        caseId: fraudCase.id,
        signalType: "SIMILAR_NAME_LOCATION",
        riskLevel: FraudRiskLevel.LOW,
        evidenceHash: "seed-low-risk-profile-similarity",
        evidenceMasked: "profile_similarity=seed_low_risk_example",
        status: FraudReviewStatus.OPEN,
      },
    });
  }

  // 6. Appeal (OPEN)
  const appeal = await prisma.appeal.upsert({
    where: { id: "40000000-0000-4000-8000-000000000001" },
    update: {
      candidateId: candidate.id,
      relatedEntity: "FraudCase",
      relatedEntityId: fraudCase.id,
      reason: "Nama dan domisili saya kebetulan mirip dengan pengguna lain, berikut bukti identitas resmi.",
      evidenceUrl: "https://evidence.ravira.local/doc-001.pdf",
      status: AppealStatus.OPEN,
      reviewerId: null,
      resolvedAt: null,
    },
    create: {
      id: "40000000-0000-4000-8000-000000000001",
      candidateId: candidate.id,
      relatedEntity: "FraudCase",
      relatedEntityId: fraudCase.id,
      reason: "Nama dan domisili saya kebetulan mirip dengan pengguna lain, berikut bukti identitas resmi.",
      evidenceUrl: "https://evidence.ravira.local/doc-001.pdf",
      status: AppealStatus.OPEN,
    },
  });

  return {
    adminEmail: admin.email,
    candidateEmail: candidateUser.email,
    recruiterEmail: approvedRecruiter.user.email,
    backendJobId: backendJob.id,
    fullStackJobId: fullStackJob.id,
    otherJobId: otherJob.id,
    pendingCompanyId: pending1.company.id,
    pendingApproveCompanyId: pendingApproveTarget.company.id,
    pendingRejectCompanyId: pendingRejectTarget.company.id,
    rejectedCompanyId: rejected1.company.id,
    fraudCaseId: fraudCase.id,
    appealId: appeal.id,
  };
}

if (require.main === module) {
  seedE2EFixtures()
    .then((summary) => {
      console.log(JSON.stringify({ success: true, ...summary }, null, 2));
    })
    .catch((err) => {
      console.error("[E2E Seed Error]:", err.message);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}

module.exports = { seedE2EFixtures, E2E_SYNTHETIC_PASSWORD };
