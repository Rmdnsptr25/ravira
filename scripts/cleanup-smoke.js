const { PrismaClient } = require("@prisma/client");
const fs = require("fs/promises");
const path = require("path");
require("dotenv").config({ quiet: true });

const prisma = new PrismaClient();

const resolveSmokeCvPath = (storagePath) => {
  const uploadRoot = path.resolve(process.cwd(), "uploads", "cv");
  const absolutePath = path.resolve(process.cwd(), storagePath);

  if (absolutePath !== uploadRoot && !absolutePath.startsWith(`${uploadRoot}${path.sep}`)) {
    return null;
  }

  return absolutePath;
};

const removeLocalSmokeCvFiles = async (documents) => {
  await Promise.all(
    documents.map(async (document) => {
      const absolutePath = resolveSmokeCvPath(document.storagePath);

      if (!absolutePath) {
        return;
      }

      try {
        await fs.unlink(absolutePath);
      } catch {
        // Smoke cleanup should remain idempotent when local upload files are already gone.
      }
    })
  );
};

const main = async () => {
  const smokeUsers = await prisma.user.findMany({
    where: {
      email: {
        startsWith: "smoke-"
      }
    },
    select: { id: true }
  });

  const smokeUserIds = smokeUsers.map((user) => user.id);

  const smokeCompanies = await prisma.company.findMany({
    where: {
      OR: [
        { name: { startsWith: "Smoke Company" } },
        {
          recruiters: {
            some: {
              userId: { in: smokeUserIds }
            }
          }
        }
      ]
    },
    select: { id: true }
  });

  const smokeCompanyIds = smokeCompanies.map((company) => company.id);

  const smokeJobs = await prisma.job.findMany({
    where: {
      OR: [
        { title: { startsWith: "Smoke " } },
        { title: { contains: " Smoke " } },
        { companyId: { in: smokeCompanyIds } }
      ]
    },
    select: { id: true }
  });

  const smokeJobIds = smokeJobs.map((job) => job.id);

  const smokeCandidates = await prisma.candidate.findMany({
    where: { userId: { in: smokeUserIds } },
    select: { id: true }
  });

  const smokeCandidateIds = smokeCandidates.map((candidate) => candidate.id);

  const smokeCandidateDocuments = await prisma.candidateDocument.findMany({
    where: { candidateId: { in: smokeCandidateIds } },
    select: {
      id: true,
      storagePath: true
    }
  });

  const smokeCandidateDocumentIds = smokeCandidateDocuments.map((document) => document.id);

  const smokeSkillGapReports = await prisma.skillGapReport.findMany({
    where: {
      OR: [
        { candidateId: { in: smokeCandidateIds } },
        { jobId: { in: smokeJobIds } }
      ]
    },
    select: { id: true }
  });

  const smokeSkillGapReportIds = smokeSkillGapReports.map((report) => report.id);

  const smokeTrainingProgress = await prisma.trainingProgress.findMany({
    where: { candidateId: { in: smokeCandidateIds } },
    select: { id: true }
  });

  const smokeTrainingProgressIds = smokeTrainingProgress.map((progress) => progress.id);

  const smokeApplications = await prisma.application.findMany({
    where: {
      OR: [
        { candidateId: { in: smokeCandidateIds } },
        { jobId: { in: smokeJobIds } }
      ]
    },
    select: { id: true }
  });

  const smokeApplicationIds = smokeApplications.map((application) => application.id);

  const smokeAppeals = await prisma.appeal.findMany({
    where: {
      OR: [
        { candidateId: { in: smokeCandidateIds } },
        { reviewerId: { in: smokeUserIds } }
      ]
    },
    select: { id: true }
  });

  const smokeAppealIds = smokeAppeals.map((appeal) => appeal.id);

  const smokeFraudCases = await prisma.fraudCase.findMany({
    where: {
      OR: [
        { candidateId: { in: smokeCandidateIds } },
        { reviewerId: { in: smokeUserIds } }
      ]
    },
    select: { id: true }
  });

  const smokeFraudCaseIds = smokeFraudCases.map((fraudCase) => fraudCase.id);

  const smokeFraudSignals = await prisma.fraudSignal.findMany({
    where: {
      OR: [
        { candidateId: { in: smokeCandidateIds } },
        { caseId: { in: smokeFraudCaseIds } }
      ]
    },
    select: { id: true }
  });

  const smokeFraudSignalIds = smokeFraudSignals.map((signal) => signal.id);

  await prisma.$transaction([
    prisma.auditLog.deleteMany({
      where: {
        OR: [
          { actorId: { in: smokeUserIds } },
          {
            entityId: {
              in: [
                ...smokeApplicationIds,
                ...smokeJobIds,
                ...smokeCompanyIds,
                ...smokeAppealIds,
                ...smokeFraudCaseIds,
                ...smokeFraudSignalIds,
                ...smokeCandidateDocumentIds,
                ...smokeSkillGapReportIds,
                ...smokeTrainingProgressIds
              ]
            }
          }
        ]
      }
    }),
    prisma.notification.deleteMany({
      where: { userId: { in: smokeUserIds } }
    }),
    prisma.appeal.deleteMany({
      where: { id: { in: smokeAppealIds } }
    }),
    prisma.fraudSignal.deleteMany({
      where: { id: { in: smokeFraudSignalIds } }
    }),
    prisma.fraudCase.deleteMany({
      where: { id: { in: smokeFraudCaseIds } }
    }),
    prisma.applicationStatusHistory.deleteMany({
      where: {
        OR: [
          { applicationId: { in: smokeApplicationIds } },
          { changedById: { in: smokeUserIds } }
        ]
      }
    }),
    prisma.matchScore.deleteMany({
      where: {
        OR: [
          { applicationId: { in: smokeApplicationIds } },
          { candidateId: { in: smokeCandidateIds } },
          { jobId: { in: smokeJobIds } }
        ]
      }
    }),
    prisma.candidateScore.deleteMany({
      where: {
        OR: [
          { applicationId: { in: smokeApplicationIds } },
          { candidateId: { in: smokeCandidateIds } },
          { jobId: { in: smokeJobIds } }
        ]
      }
    }),
    prisma.candidateDocument.deleteMany({
      where: { id: { in: smokeCandidateDocumentIds } }
    }),
    prisma.trainingProgress.deleteMany({
      where: { id: { in: smokeTrainingProgressIds } }
    }),
    prisma.skillGapReport.deleteMany({
      where: { id: { in: smokeSkillGapReportIds } }
    }),
    prisma.application.deleteMany({
      where: { id: { in: smokeApplicationIds } }
    }),
    prisma.jobSkill.deleteMany({
      where: { jobId: { in: smokeJobIds } }
    }),
    prisma.job.deleteMany({
      where: { id: { in: smokeJobIds } }
    }),
    prisma.candidateSkill.deleteMany({
      where: { candidateId: { in: smokeCandidateIds } }
    }),
    prisma.consent.deleteMany({
      where: { userId: { in: smokeUserIds } }
    }),
    prisma.recruiter.deleteMany({
      where: {
        OR: [
          { userId: { in: smokeUserIds } },
          { companyId: { in: smokeCompanyIds } }
        ]
      }
    }),
    prisma.candidate.deleteMany({
      where: { id: { in: smokeCandidateIds } }
    }),
    prisma.company.deleteMany({
      where: { id: { in: smokeCompanyIds } }
    }),
    prisma.user.deleteMany({
      where: { id: { in: smokeUserIds } }
    })
  ]);

  await removeLocalSmokeCvFiles(smokeCandidateDocuments);

  console.log(
    JSON.stringify(
      {
        success: true,
        message: "Smoke data cleanup completed.",
        data: {
          users: smokeUserIds.length,
          companies: smokeCompanyIds.length,
          jobs: smokeJobIds.length,
          applications: smokeApplicationIds.length,
          candidateDocuments: smokeCandidateDocumentIds.length,
          skillGapReports: smokeSkillGapReportIds.length,
          trainingProgress: smokeTrainingProgressIds.length,
          appeals: smokeAppealIds.length,
          fraudCases: smokeFraudCaseIds.length,
          fraudSignals: smokeFraudSignalIds.length
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
