const bcrypt = require("bcrypt");
const {
  PrismaClient,
  Role,
  CompanyVerificationStatus,
  JobStatus,
  FraudRiskLevel,
  FraudReviewStatus
} = require("@prisma/client");
require("dotenv").config({ quiet: true });

const prisma = new PrismaClient();

const seedPassword = process.env.SEED_PASSWORD ?? "Password123!";

const users = {
  admin: {
    email: "seed-admin@ravira.local",
    fullName: "Seed Admin",
    role: Role.ADMIN
  },
  candidate: {
    email: "seed-candidate@ravira.local",
    fullName: "Seed Candidate",
    role: Role.CANDIDATE
  },
  recruiter: {
    email: "seed-recruiter@ravira.local",
    fullName: "Seed Recruiter",
    role: Role.RECRUITER
  }
};

const upsertUser = async ({ email, fullName, role }) => {
  const passwordHash = await bcrypt.hash(seedPassword, 10);

  return prisma.user.upsert({
    where: { email },
    update: {
      fullName,
      role,
      isActive: true,
      passwordHash
    },
    create: {
      email,
      fullName,
      role,
      isActive: true,
      passwordHash
    }
  });
};

const upsertPublishedJob = async ({ companyId, recruiterId, title, description, location, skills }) => {
  const existingJob = await prisma.job.findFirst({
    where: {
      companyId,
      title
    }
  });

  const jobData = {
    companyId,
    createdByRecruiterId: recruiterId,
    title,
    description,
    location,
    jobType: "FULL_TIME",
    workType: "REMOTE",
    employmentType: "FULL_TIME",
    salaryMin: 8000000,
    salaryMax: 16000000,
    status: JobStatus.PUBLISHED
  };

  const job = existingJob
    ? await prisma.job.update({
        where: { id: existingJob.id },
        data: jobData
      })
    : await prisma.job.create({ data: jobData });

  await prisma.jobSkill.deleteMany({ where: { jobId: job.id } });
  await prisma.jobSkill.createMany({
    data: skills.map((skillName, index) => ({
      jobId: job.id,
      skillName,
      required: true,
      weight: index + 1
    }))
  });

  return job;
};

const courses = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    title: "JavaScript Dasar untuk Web",
    provider: "Ravira Learning Partner",
    skillTargets: ["JavaScript"],
    duration: "8 jam",
    price: 0,
    difficulty: "BEGINNER",
    language: "id",
    url: "https://learning.ravira.local/courses/javascript-basic"
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
    url: "https://learning.ravira.local/courses/typescript-backend"
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    title: "React Component Fundamentals",
    provider: "Ravira Learning Partner",
    skillTargets: ["React", "JavaScript"],
    duration: "12 jam",
    price: 150000,
    difficulty: "BEGINNER",
    language: "id",
    url: "https://learning.ravira.local/courses/react-fundamentals"
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
    url: "https://learning.ravira.local/courses/node-api"
  },
  {
    id: "10000000-0000-4000-8000-000000000005",
    title: "Express REST API Basic",
    provider: "Ravira Learning Partner",
    skillTargets: ["Express", "Node.js"],
    duration: "6 jam",
    price: 100000,
    difficulty: "BEGINNER",
    language: "id",
    url: "https://learning.ravira.local/courses/express-rest"
  },
  {
    id: "10000000-0000-4000-8000-000000000006",
    title: "SQL Query Essentials",
    provider: "Ravira Learning Partner",
    skillTargets: ["SQL"],
    duration: "7 jam",
    price: 0,
    difficulty: "BEGINNER",
    language: "id",
    url: "https://learning.ravira.local/courses/sql-essentials"
  },
  {
    id: "10000000-0000-4000-8000-000000000007",
    title: "PostgreSQL for Product Engineers",
    provider: "Ravira Learning Partner",
    skillTargets: ["PostgreSQL", "SQL"],
    duration: "11 jam",
    price: 180000,
    difficulty: "INTERMEDIATE",
    language: "id",
    url: "https://learning.ravira.local/courses/postgresql-product"
  },
  {
    id: "10000000-0000-4000-8000-000000000008",
    title: "UI/UX dan Figma Workflow",
    provider: "Ravira Design Academy",
    skillTargets: ["UI/UX", "Figma"],
    duration: "9 jam",
    price: 120000,
    difficulty: "BEGINNER",
    language: "id",
    url: "https://learning.ravira.local/courses/uiux-figma"
  },
  {
    id: "10000000-0000-4000-8000-000000000009",
    title: "Data Analysis dengan SQL",
    provider: "Ravira Data Academy",
    skillTargets: ["Data Analysis", "SQL"],
    duration: "13 jam",
    price: 220000,
    difficulty: "INTERMEDIATE",
    language: "id",
    url: "https://learning.ravira.local/courses/data-analysis-sql"
  },
  {
    id: "10000000-0000-4000-8000-000000000010",
    title: "Machine Learning Introduction",
    provider: "Ravira Data Academy",
    skillTargets: ["Machine Learning", "Python"],
    duration: "16 jam",
    price: 250000,
    difficulty: "BEGINNER",
    language: "id",
    url: "https://learning.ravira.local/courses/ml-intro"
  }
];

const upsertCourse = async (course) => {
  return prisma.course.upsert({
    where: { id: course.id },
    update: {
      title: course.title,
      provider: course.provider,
      skillTargets: course.skillTargets,
      duration: course.duration,
      price: course.price,
      difficulty: course.difficulty,
      language: course.language,
      url: course.url
    },
    create: course
  });
};

const main = async () => {
  const admin = await upsertUser(users.admin);
  const candidateUser = await upsertUser(users.candidate);
  const recruiterUser = await upsertUser(users.recruiter);

  const candidate = await prisma.candidate.upsert({
    where: { userId: candidateUser.id },
    update: {
      location: "Jakarta",
      education: "S1",
      experienceSummary: "Seed candidate profile",
      salaryExpectation: 10000000,
      mobilityPreference: "REMOTE",
      profileVisibility: "PUBLIC"
    },
    create: {
      userId: candidateUser.id,
      location: "Jakarta",
      education: "S1",
      experienceSummary: "Seed candidate profile",
      salaryExpectation: 10000000,
      mobilityPreference: "REMOTE",
      profileVisibility: "PUBLIC"
    }
  });

  await prisma.candidateSkill.upsert({
    where: {
      candidateId_skillName: {
        candidateId: candidate.id,
        skillName: "TypeScript"
      }
    },
    update: {
      level: "INTERMEDIATE",
      source: "seed",
      confidenceScore: 90
    },
    create: {
      candidateId: candidate.id,
      skillName: "TypeScript",
      level: "INTERMEDIATE",
      source: "seed",
      confidenceScore: 90
    }
  });

  const existingFraudCase = await prisma.fraudCase.findFirst({
    where: {
      candidateId: candidate.id,
      riskLevel: FraudRiskLevel.LOW
    },
    select: { id: true }
  });

  const seedFraudCase = existingFraudCase
    ? await prisma.fraudCase.update({
        where: { id: existingFraudCase.id },
        data: {
          riskScore: 30,
          riskLevel: FraudRiskLevel.LOW,
          reviewStatus: FraudReviewStatus.OPEN,
          decision: null,
          reason: null,
          reviewerId: null,
          decidedAt: null
        }
      })
    : await prisma.fraudCase.create({
        data: {
          candidateId: candidate.id,
          riskScore: 30,
          riskLevel: FraudRiskLevel.LOW,
          reviewStatus: FraudReviewStatus.OPEN
        }
      });

  const existingFraudSignal = await prisma.fraudSignal.findFirst({
    where: {
      candidateId: candidate.id,
      caseId: seedFraudCase.id,
      signalType: "SIMILAR_NAME_LOCATION"
    },
    select: { id: true }
  });

  if (existingFraudSignal) {
    await prisma.fraudSignal.update({
      where: { id: existingFraudSignal.id },
      data: {
        riskLevel: FraudRiskLevel.LOW,
        evidenceHash: "seed-low-risk-profile-similarity",
        evidenceMasked: "profile_similarity=seed_low_risk_example",
        status: FraudReviewStatus.OPEN
      }
    });
  } else {
    await prisma.fraudSignal.create({
      data: {
        candidateId: candidate.id,
        caseId: seedFraudCase.id,
        signalType: "SIMILAR_NAME_LOCATION",
        riskLevel: FraudRiskLevel.LOW,
        evidenceHash: "seed-low-risk-profile-similarity",
        evidenceMasked: "profile_similarity=seed_low_risk_example",
        status: FraudReviewStatus.OPEN
      }
    });
  }

  const company = await prisma.company.upsert({
    where: { id: "00000000-0000-4000-8000-000000000001" },
    update: {
      name: "Seed Ravira Company",
      industry: "Technology",
      location: "Jakarta",
      verificationStatus: CompanyVerificationStatus.APPROVED,
      verifiedAt: new Date()
    },
    create: {
      id: "00000000-0000-4000-8000-000000000001",
      name: "Seed Ravira Company",
      industry: "Technology",
      location: "Jakarta",
      verificationStatus: CompanyVerificationStatus.APPROVED,
      verifiedAt: new Date()
    }
  });

  const recruiter = await prisma.recruiter.upsert({
    where: { userId: recruiterUser.id },
    update: {
      companyId: company.id,
      position: "Talent Partner"
    },
    create: {
      userId: recruiterUser.id,
      companyId: company.id,
      position: "Talent Partner"
    }
  });

  const jobs = await Promise.all([
    upsertPublishedJob({
      companyId: company.id,
      recruiterId: recruiter.id,
      title: "Seed Backend Engineer",
      description: "Build backend APIs for Ravira.",
      location: "Jakarta",
      skills: ["TypeScript", "Node.js", "Prisma"]
    }),
    upsertPublishedJob({
      companyId: company.id,
      recruiterId: recruiter.id,
      title: "Seed Full Stack Engineer",
      description: "Build product features across backend and frontend integration.",
      location: "Bandung",
      skills: ["TypeScript", "Express.js", "PostgreSQL"]
    })
  ]);

  const seededCourses = await Promise.all(courses.map(upsertCourse));

  console.log(
    JSON.stringify(
      {
        success: true,
        message: "Seed completed.",
        data: {
          adminEmail: admin.email,
          candidateEmail: candidateUser.email,
          recruiterEmail: recruiterUser.email,
          seedPassword,
          companyId: company.id,
          fraudCaseId: seedFraudCase.id,
          jobIds: jobs.map((job) => job.id),
          courseIds: seededCourses.map((course) => course.id)
        }
      },
      null,
      2
    )
  );
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
