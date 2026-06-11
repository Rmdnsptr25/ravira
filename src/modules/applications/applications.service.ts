import {
  ApplicationStatus,
  FraudRiskLevel,
  JobStatus,
  NotificationType,
  Prisma,
  Role
} from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { createAuditLog } from "../audit-logs/auditLog.service";
import { z } from "zod";
import {
  applyToJobSchema,
  updateApplicationStageSchema
} from "./applications.validation";
import {
  upsertAiMatchScore,
  upsertCandidateScore
} from "../scoring/scoring.service";
import { createNotification } from "../notifications/notifications.service";
import { runBasicFraudCheckForCandidate } from "../fraud/fraud.service";

type ApplyToJobInput = z.infer<typeof applyToJobSchema>;
type UpdateApplicationStageInput = z.infer<typeof updateApplicationStageSchema>;

const applicationSelect = {
  id: true,
  status: true,
  coverLetter: true,
  createdAt: true,
  updatedAt: true,
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
  },
  job: {
    select: {
      id: true,
      title: true,
      location: true,
      jobType: true,
      workType: true,
      status: true,
      companyId: true,
      company: {
        select: {
          id: true,
          name: true,
          industry: true
        }
      }
    }
  }
} satisfies Prisma.ApplicationSelect;

const statusHistorySelect = {
  id: true,
  fromStatus: true,
  toStatus: true,
  reason: true,
  changedBy: {
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true
    }
  },
  createdAt: true
} satisfies Prisma.ApplicationStatusHistorySelect;

const getCandidateIdByUserId = async (userId: string) => {
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!candidate) {
    throw new AppError("Candidate profile not found.", 404);
  }

  return candidate.id;
};

const getRecruiterCompanyIdByUserId = async (userId: string) => {
  const recruiter = await prisma.recruiter.findUnique({
    where: { userId },
    select: {
      id: true,
      companyId: true
    }
  });

  if (!recruiter) {
    throw new AppError("Recruiter profile not found.", 404);
  }

  return recruiter.companyId;
};

const assertCanAccessApplication = async (
  applicationId: string,
  userId: string,
  role: Role
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      candidateId: true,
      job: {
        select: {
          companyId: true
        }
      }
    }
  });

  if (!application) {
    throw new AppError("Application not found.", 404);
  }

  if (role === Role.CANDIDATE) {
    const candidateId = await getCandidateIdByUserId(userId);
    if (application.candidateId !== candidateId) {
      throw new AppError("Application not found.", 404);
    }
  }

  if (role === Role.RECRUITER) {
    const companyId = await getRecruiterCompanyIdByUserId(userId);
    if (application.job.companyId !== companyId) {
      throw new AppError("Application not found.", 404);
    }
  }

  if (![Role.CANDIDATE, Role.RECRUITER, Role.ADMIN, Role.SUPER_ADMIN].includes(role)) {
    throw new AppError("You do not have permission to access this resource.", 403);
  }

  return application;
};

export const applyToJob = async (
  userId: string,
  actorRole: Role,
  jobId: string,
  input: ApplyToJobInput
) => {
  const candidateId = await getCandidateIdByUserId(userId);

  return prisma.$transaction(async (tx) => {
    const job = await tx.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        status: true,
        title: true
      }
    });

    if (!job || job.status !== JobStatus.PUBLISHED) {
      throw new AppError("Candidates can apply only to published jobs.", 403);
    }

    const duplicateApplication = await tx.application.findUnique({
      where: {
        candidateId_jobId: {
          candidateId,
          jobId
        }
      },
      select: { id: true }
    });

    if (duplicateApplication) {
      throw new AppError("Candidate has already applied to this job.", 409);
    }

    let application = await tx.application.create({
      data: {
        candidateId,
        jobId,
        coverLetter: input.coverLetter,
        status: ApplicationStatus.APPLIED
      },
      select: applicationSelect
    });

    await tx.applicationStatusHistory.create({
      data: {
        applicationId: application.id,
        fromStatus: null,
        toStatus: ApplicationStatus.APPLIED,
        changedById: userId,
        reason: "Candidate applied to job."
      }
    });

    await createAuditLog(
      {
        actorUserId: userId,
        actorRole,
        action: "APPLICATION_CREATED",
        entityType: "Application",
        entityId: application.id,
        afterValue: application,
        reason: "Candidate applied to job."
      },
      tx
    );

    await createNotification(
      {
        userId,
        type: NotificationType.APPLICATION_SUBMITTED,
        title: "Lamaran berhasil dikirim",
        bodySafe: `Lamaran Anda untuk posisi ${job.title} berhasil dikirim.`
      },
      tx
    );

    const fraudCheck = await runBasicFraudCheckForCandidate(
      {
        candidateId,
        actorUserId: userId,
        actorRole,
        trigger: "APPLICATION_APPLY",
        notifyCandidateOnHigh: false
      },
      tx
    );

    if (fraudCheck.highestRiskLevel === FraudRiskLevel.HIGH) {
      const beforeVerificationStatus = application;

      application = await tx.application.update({
        where: { id: application.id },
        data: { status: ApplicationStatus.NEED_VERIFICATION },
        select: applicationSelect
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId: application.id,
          fromStatus: ApplicationStatus.APPLIED,
          toStatus: ApplicationStatus.NEED_VERIFICATION,
          changedById: userId,
          reason: "Basic integrity check requires additional verification."
        }
      });

      await createAuditLog(
        {
          actorUserId: userId,
          actorRole,
          action: "CANDIDATE_NEED_VERIFICATION_SET",
          entityType: "Application",
          entityId: application.id,
          beforeValue: beforeVerificationStatus,
          afterValue: application,
          reason: "Basic integrity check requires additional verification."
        },
        tx
      );

      await createNotification(
        {
          userId,
          type: NotificationType.SYSTEM,
          title: "Verifikasi tambahan diperlukan",
          bodySafe:
            "Akun atau lamaran Anda memerlukan verifikasi tambahan. Silakan cek status dan ikuti instruksi yang tersedia."
        },
        tx
      );
    }

    await upsertAiMatchScore(candidateId, jobId, application.id, tx);
    await upsertCandidateScore(candidateId, jobId, application.id, userId, actorRole, tx);

    return application;
  }, {
    maxWait: 10000,
    timeout: 15000
  });
};

export const listMyApplications = async (userId: string) => {
  const candidateId = await getCandidateIdByUserId(userId);

  return prisma.application.findMany({
    where: { candidateId },
    select: applicationSelect,
    orderBy: { createdAt: "desc" }
  });
};

export const getApplicationById = async (
  applicationId: string,
  userId: string,
  role: Role
) => {
  await assertCanAccessApplication(applicationId, userId, role);

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: applicationSelect
  });

  if (!application) {
    throw new AppError("Application not found.", 404);
  }

  return application;
};

export const updateApplicationStage = async (
  applicationId: string,
  userId: string,
  actorRole: Role,
  input: UpdateApplicationStageInput
) => {
  const companyId = await getRecruiterCompanyIdByUserId(userId);

  return prisma.$transaction(async (tx) => {
    const before = await tx.application.findUnique({
      where: { id: applicationId },
      select: applicationSelect
    });

    if (!before || before.job.companyId !== companyId) {
      throw new AppError("Application not found.", 404);
    }

    const after = await tx.application.update({
      where: { id: applicationId },
      data: { status: input.newStatus },
      select: applicationSelect
    });

    await tx.applicationStatusHistory.create({
      data: {
        applicationId,
        fromStatus: before.status,
        toStatus: input.newStatus,
        changedById: userId,
        reason: input.reason
      }
    });

    await createAuditLog(
      {
        actorUserId: userId,
        actorRole,
        action: "APPLICATION_STAGE_UPDATED",
        entityType: "Application",
        entityId: applicationId,
        beforeValue: before,
        afterValue: after,
        reason: input.reason
      },
      tx
    );

    await createNotification(
      {
        userId: after.candidate.user.id,
        type: NotificationType.APPLICATION_STATUS_UPDATED,
        title: "Status lamaran diperbarui",
        bodySafe: `Status lamaran Anda untuk posisi ${after.job.title} berubah menjadi ${input.newStatus}.`
      },
      tx
    );

    return after;
  });
};

export const getApplicationStatusHistory = async (
  applicationId: string,
  userId: string,
  role: Role
) => {
  await assertCanAccessApplication(applicationId, userId, role);

  return prisma.applicationStatusHistory.findMany({
    where: { applicationId },
    select: statusHistorySelect,
    orderBy: { createdAt: "asc" }
  });
};
