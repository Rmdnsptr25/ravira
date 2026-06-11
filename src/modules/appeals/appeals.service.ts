import {
  AppealStatus,
  NotificationType,
  Prisma,
  Role
} from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { createAuditLog } from "../audit-logs/auditLog.service";
import { createNotification } from "../notifications/notifications.service";
import { z } from "zod";
import {
  appealDecisionSchema,
  createAppealSchema
} from "./appeals.validation";

type CreateAppealInput = z.infer<typeof createAppealSchema>;
type AppealDecisionInput = z.infer<typeof appealDecisionSchema>;

const appealSelect = {
  id: true,
  candidateId: true,
  relatedEntity: true,
  relatedEntityId: true,
  reason: true,
  evidenceUrl: true,
  status: true,
  reviewerId: true,
  resolvedAt: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.AppealSelect;

const adminAppealSelect = {
  ...appealSelect,
  candidate: {
    select: {
      id: true,
      user: {
        select: {
          id: true,
          email: true,
          fullName: true
        }
      }
    }
  },
  reviewer: {
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true
    }
  }
} satisfies Prisma.AppealSelect;

const finalAppealStatuses = new Set<AppealStatus>([
  AppealStatus.APPROVED,
  AppealStatus.REJECTED,
  AppealStatus.RESOLVED
]);

const getCandidateByUserId = async (userId: string) => {
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
    select: {
      id: true,
      userId: true
    }
  });

  if (!candidate) {
    throw new AppError("Candidate profile not found.", 404);
  }

  return candidate;
};

const assertRelatedEntityOwnership = async (
  candidateId: string,
  input: CreateAppealInput,
  client: Prisma.TransactionClient
) => {
  if (!input.relatedEntityId) {
    return;
  }

  if (input.relatedEntity === "skill") {
    const skill = await client.candidateSkill.findFirst({
      where: {
        id: input.relatedEntityId,
        candidateId
      },
      select: { id: true }
    });

    if (!skill) {
      throw new AppError("Related skill not found.", 404);
    }
  }

  if (input.relatedEntity === "application_status") {
    const application = await client.application.findFirst({
      where: {
        id: input.relatedEntityId,
        candidateId
      },
      select: { id: true }
    });

    if (!application) {
      throw new AppError("Related application not found.", 404);
    }
  }

  if (input.relatedEntity === "parsing_result") {
    const document = await client.candidateDocument.findFirst({
      where: {
        id: input.relatedEntityId,
        candidateId
      },
      select: { id: true }
    });

    if (!document) {
      throw new AppError("Related CV document not found.", 404);
    }
  }
};

export const createMyAppeal = async (
  userId: string,
  actorRole: Role,
  input: CreateAppealInput
) => {
  const candidate = await getCandidateByUserId(userId);

  return prisma.$transaction(async (tx) => {
    await assertRelatedEntityOwnership(candidate.id, input, tx);

    const appeal = await tx.appeal.create({
      data: {
        candidateId: candidate.id,
        relatedEntity: input.relatedEntity,
        relatedEntityId: input.relatedEntityId,
        reason: input.reason,
        evidenceUrl: input.evidenceUrl,
        status: AppealStatus.OPEN
      },
      select: appealSelect
    });

    await createAuditLog(
      {
        actorUserId: userId,
        actorRole,
        action: "APPEAL_CREATED",
        entityType: "Appeal",
        entityId: appeal.id,
        afterValue: appeal,
        reason: input.reason
      },
      tx
    );

    return appeal;
  });
};

export const listMyAppeals = async (userId: string) => {
  const candidate = await getCandidateByUserId(userId);

  return prisma.appeal.findMany({
    where: { candidateId: candidate.id },
    select: appealSelect,
    orderBy: { createdAt: "desc" }
  });
};

export const getMyAppealById = async (userId: string, appealId: string) => {
  const candidate = await getCandidateByUserId(userId);
  const appeal = await prisma.appeal.findFirst({
    where: {
      id: appealId,
      candidateId: candidate.id
    },
    select: appealSelect
  });

  if (!appeal) {
    throw new AppError("Appeal not found.", 404);
  }

  return appeal;
};

export const listAppealsForAdmin = async () => {
  return prisma.appeal.findMany({
    select: adminAppealSelect,
    orderBy: { createdAt: "desc" }
  });
};

export const getAppealByIdForAdmin = async (appealId: string) => {
  const appeal = await prisma.appeal.findUnique({
    where: { id: appealId },
    select: adminAppealSelect
  });

  if (!appeal) {
    throw new AppError("Appeal not found.", 404);
  }

  return appeal;
};

export const updateAppealDecision = async (
  appealId: string,
  reviewerId: string,
  reviewerRole: Role,
  input: AppealDecisionInput
) => {
  return prisma.$transaction(async (tx) => {
    const before = await tx.appeal.findUnique({
      where: { id: appealId },
      select: {
        ...adminAppealSelect,
        candidate: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                email: true,
                fullName: true
              }
            }
          }
        }
      }
    });

    if (!before) {
      throw new AppError("Appeal not found.", 404);
    }

    const after = await tx.appeal.update({
      where: { id: appealId },
      data: {
        status: input.status,
        reviewerId,
        resolvedAt: finalAppealStatuses.has(input.status) ? new Date() : null
      },
      select: adminAppealSelect
    });

    await createAuditLog(
      {
        actorUserId: reviewerId,
        actorRole: reviewerRole,
        action: "APPEAL_DECISION_UPDATED",
        entityType: "Appeal",
        entityId: appealId,
        beforeValue: before,
        afterValue: after,
        reason: input.reason
      },
      tx
    );

    await createNotification(
      {
        userId: before.candidate.user.id,
        type: NotificationType.APPEAL_STATUS_UPDATED,
        title: "Status appeal diperbarui",
        bodySafe: `Status appeal Anda berubah menjadi ${input.status}.`
      },
      tx
    );

    return after;
  });
};
