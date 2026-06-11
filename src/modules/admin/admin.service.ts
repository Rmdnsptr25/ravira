import { CompanyVerificationStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { createAuditLog } from "../audit-logs/auditLog.service";

const companySelect = {
  id: true,
  name: true,
  industry: true,
  location: true,
  website: true,
  verificationStatus: true,
  verifiedAt: true,
  createdAt: true,
  updatedAt: true,
  recruiters: {
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
};

export const listPendingCompanies = async () => {
  return prisma.company.findMany({
    where: { verificationStatus: CompanyVerificationStatus.PENDING },
    select: companySelect,
    orderBy: { createdAt: "asc" }
  });
};

export const approveCompany = async (
  companyId: string,
  actorUserId: string,
  actorRole: "ADMIN" | "SUPER_ADMIN"
) => {
  return prisma.$transaction(async (tx) => {
    const before = await tx.company.findUnique({
      where: { id: companyId },
      select: companySelect
    });

    if (!before) {
      throw new AppError("Company not found.", 404);
    }

    const after = await tx.company.update({
      where: { id: companyId },
      data: {
        verificationStatus: CompanyVerificationStatus.APPROVED,
        verifiedAt: new Date()
      },
      select: companySelect
    });

    await createAuditLog(
      {
        actorUserId,
        actorRole,
        action: "COMPANY_APPROVED",
        entityType: "Company",
        entityId: companyId,
        beforeValue: before,
        afterValue: after
      },
      tx
    );

    return after;
  });
};

export const rejectCompany = async (
  companyId: string,
  reason: string,
  actorUserId: string,
  actorRole: "ADMIN" | "SUPER_ADMIN"
) => {
  return prisma.$transaction(async (tx) => {
    const before = await tx.company.findUnique({
      where: { id: companyId },
      select: companySelect
    });

    if (!before) {
      throw new AppError("Company not found.", 404);
    }

    const after = await tx.company.update({
      where: { id: companyId },
      data: {
        verificationStatus: CompanyVerificationStatus.REJECTED,
        verifiedAt: null
      },
      select: companySelect
    });

    await createAuditLog(
      {
        actorUserId,
        actorRole,
        action: "COMPANY_REJECTED",
        entityType: "Company",
        entityId: companyId,
        beforeValue: before,
        afterValue: after,
        reason
      },
      tx
    );

    return after;
  });
};
