import { Prisma, PrismaClient, Role } from "@prisma/client";
import prisma from "../../config/prisma";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

interface CreateAuditLogInput {
  actorUserId?: string | null;
  actorRole?: Role | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  beforeValue?: unknown;
  afterValue?: unknown;
  reason?: string | null;
}

const toJsonValue = (value: unknown): Prisma.InputJsonValue | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
};

export const createAuditLog = async (
  input: CreateAuditLogInput,
  client: PrismaExecutor = prisma
) => {
  return client.auditLog.create({
    data: {
      actorId: input.actorUserId ?? undefined,
      actorRole: input.actorRole ?? undefined,
      action: input.action,
      entity: input.entityType,
      entityId: input.entityId ?? undefined,
      before: toJsonValue(input.beforeValue),
      after: toJsonValue(input.afterValue),
      reason: input.reason ?? undefined
    }
  });
};
