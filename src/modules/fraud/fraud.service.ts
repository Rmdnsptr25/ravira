import {
  FraudReviewStatus,
  FraudRiskLevel,
  NotificationType,
  Prisma,
  PrismaClient,
  Role
} from "@prisma/client";
import crypto from "crypto";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { createAuditLog } from "../audit-logs/auditLog.service";
import { createNotification } from "../notifications/notifications.service";
import { z } from "zod";
import {
  fraudCaseDecisionSchema,
  fraudCaseQuerySchema
} from "./fraud.validation";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;
type FraudCaseQuery = z.infer<typeof fraudCaseQuerySchema>;
type FraudCaseDecisionInput = z.infer<typeof fraudCaseDecisionSchema>;

interface RunFraudCheckInput {
  candidateId: string;
  actorUserId?: string | null;
  actorRole?: Role | null;
  trigger: "REGISTER_CANDIDATE" | "PROFILE_UPDATE" | "APPLICATION_APPLY";
  notifyCandidateOnHigh?: boolean;
}

interface DetectedSignal {
  signalType: "DUPLICATE_EMAIL" | "DUPLICATE_PHONE" | "SIMILAR_NAME_LOCATION";
  riskLevel: FraudRiskLevel;
  evidenceHash: string;
  evidenceMasked: string;
}

const activeReviewStatuses: FraudReviewStatus[] = [
  FraudReviewStatus.OPEN,
  FraudReviewStatus.IN_REVIEW,
  FraudReviewStatus.NEED_VERIFICATION
];

const riskScoreByLevel: Record<FraudRiskLevel, number> = {
  [FraudRiskLevel.LOW]: 30,
  [FraudRiskLevel.MEDIUM]: 60,
  [FraudRiskLevel.HIGH]: 90
};

const riskRank: Record<FraudRiskLevel, number> = {
  [FraudRiskLevel.LOW]: 1,
  [FraudRiskLevel.MEDIUM]: 2,
  [FraudRiskLevel.HIGH]: 3
};

const candidateForFraudSelect = {
  id: true,
  location: true,
  user: {
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      isActive: true
    }
  }
} satisfies Prisma.CandidateSelect;

const fraudSignalPublicSelect = {
  id: true,
  candidateId: true,
  caseId: true,
  signalType: true,
  riskLevel: true,
  evidenceMasked: true,
  status: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.FraudSignalSelect;

const fraudCaseSelect = {
  id: true,
  candidateId: true,
  riskScore: true,
  riskLevel: true,
  reviewStatus: true,
  reviewerId: true,
  decision: true,
  reason: true,
  decidedAt: true,
  candidate: {
    select: {
      id: true,
      location: true,
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          isActive: true
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
  },
  signals: {
    select: fraudSignalPublicSelect,
    orderBy: { createdAt: "desc" }
  },
  createdAt: true,
  updatedAt: true
} satisfies Prisma.FraudCaseSelect;

type CandidateForFraud = Prisma.CandidateGetPayload<{
  select: typeof candidateForFraudSelect;
}>;

type FraudCaseForResponse = Prisma.FraudCaseGetPayload<{
  select: typeof fraudCaseSelect;
}>;

const normalizeText = (value?: string | null) =>
  value?.trim().toLowerCase().replace(/\s+/g, " ") ?? "";

const normalizePhone = (value?: string | null) => {
  const digits = value?.replace(/\D/g, "") ?? "";

  if (digits.startsWith("62") && digits.length > 9) {
    return `0${digits.slice(2)}`;
  }

  if (digits.startsWith("8") && digits.length > 8) {
    return `0${digits}`;
  }

  return digits;
};

const canonicalEmail = (value?: string | null) => {
  const email = normalizeText(value);
  const [rawLocal, domain] = email.split("@");

  if (!rawLocal || !domain) {
    return email;
  }

  const localWithoutAlias = rawLocal.split("+")[0];
  const canonicalLocal =
    domain === "gmail.com" || domain === "googlemail.com"
      ? localWithoutAlias.replace(/\./g, "")
      : localWithoutAlias;

  return `${canonicalLocal}@${domain}`;
};

export const maskEmail = (value?: string | null) => {
  const email = normalizeText(value);
  const [local, domain] = email.split("@");

  if (!local || !domain) {
    return "***";
  }

  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
};

export const maskPhone = (value?: string | null) => {
  const phone = normalizePhone(value);

  if (!phone) {
    return null;
  }

  if (phone.length <= 6) {
    return `${phone.slice(0, 2)}***`;
  }

  return `${phone.slice(0, 2)}******${phone.slice(-4)}`;
};

const hashEvidence = (signalType: string, normalizedValue: string) =>
  crypto
    .createHash("sha256")
    .update(`${signalType}:${normalizedValue}`)
    .digest("hex");

const maxRiskLevel = (levels: FraudRiskLevel[]) => {
  return levels.reduce<FraudRiskLevel>(
    (highest, current) =>
      riskRank[current] > riskRank[highest] ? current : highest,
    FraudRiskLevel.LOW
  );
};

const levenshteinDistance = (left: string, right: string) => {
  const rows = Array.from({ length: left.length + 1 }, (_, index) => [index]);

  for (let column = 1; column <= right.length; column += 1) {
    rows[0][column] = column;
  }

  for (let row = 1; row <= left.length; row += 1) {
    for (let column = 1; column <= right.length; column += 1) {
      const cost = left[row - 1] === right[column - 1] ? 0 : 1;
      rows[row][column] = Math.min(
        rows[row - 1][column] + 1,
        rows[row][column - 1] + 1,
        rows[row - 1][column - 1] + cost
      );
    }
  }

  return rows[left.length][right.length];
};

const tokenOverlap = (left: string, right: string) => {
  const leftTokens = new Set(left.split(" ").filter(Boolean));
  const rightTokens = new Set(right.split(" ").filter(Boolean));

  if (leftTokens.size === 0 || rightTokens.size === 0) {
    return 0;
  }

  const overlap = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  return overlap / Math.max(leftTokens.size, rightTokens.size);
};

const isSimilarName = (leftName: string, rightName: string) => {
  const left = normalizeText(leftName);
  const right = normalizeText(rightName);

  if (!left || !right) {
    return false;
  }

  if (left === right) {
    return true;
  }

  if (tokenOverlap(left, right) >= 0.75) {
    return true;
  }

  const maxLength = Math.max(left.length, right.length);
  return maxLength >= 6 && levenshteinDistance(left, right) / maxLength <= 0.2;
};

const getCandidate = async (candidateId: string, client: PrismaExecutor) => {
  const candidate = await client.candidate.findUnique({
    where: { id: candidateId },
    select: candidateForFraudSelect
  });

  if (!candidate) {
    throw new AppError("Candidate profile not found.", 404);
  }

  return candidate;
};

const detectSignals = async (
  candidate: CandidateForFraud,
  client: PrismaExecutor
) => {
  const existingCandidates = await client.candidate.findMany({
    where: { id: { not: candidate.id } },
    select: candidateForFraudSelect
  });

  const signals: DetectedSignal[] = [];
  const candidateEmail = canonicalEmail(candidate.user.email);
  const duplicateEmailCandidates = existingCandidates.filter(
    (existingCandidate) =>
      candidateEmail.length > 0 &&
      canonicalEmail(existingCandidate.user.email) === candidateEmail
  );

  if (duplicateEmailCandidates.length > 0) {
    signals.push({
      signalType: "DUPLICATE_EMAIL",
      riskLevel: FraudRiskLevel.HIGH,
      evidenceHash: hashEvidence("DUPLICATE_EMAIL", candidateEmail),
      evidenceMasked: `email=${maskEmail(candidate.user.email)}; matches=${duplicateEmailCandidates
        .map((item) => item.id)
        .slice(0, 5)
        .join(",")}`
    });
  }

  const candidatePhone = normalizePhone(candidate.user.phone);
  const duplicatePhoneCandidates = existingCandidates.filter(
    (existingCandidate) =>
      candidatePhone.length > 0 &&
      normalizePhone(existingCandidate.user.phone) === candidatePhone
  );

  if (duplicatePhoneCandidates.length > 0) {
    signals.push({
      signalType: "DUPLICATE_PHONE",
      riskLevel: FraudRiskLevel.HIGH,
      evidenceHash: hashEvidence("DUPLICATE_PHONE", candidatePhone),
      evidenceMasked: `phone=${maskPhone(candidate.user.phone)}; matches=${duplicatePhoneCandidates
        .map((item) => item.id)
        .slice(0, 5)
        .join(",")}`
    });
  }

  const candidateLocation = normalizeText(candidate.location);
  const similarProfileCandidates = existingCandidates.filter(
    (existingCandidate) =>
      candidateLocation.length > 0 &&
      normalizeText(existingCandidate.location) === candidateLocation &&
      isSimilarName(candidate.user.fullName, existingCandidate.user.fullName)
  );

  if (similarProfileCandidates.length > 0) {
    signals.push({
      signalType: "SIMILAR_NAME_LOCATION",
      riskLevel: FraudRiskLevel.LOW,
      evidenceHash: hashEvidence(
        "SIMILAR_NAME_LOCATION",
        `${normalizeText(candidate.user.fullName)}:${candidateLocation}`
      ),
      evidenceMasked: `profile_similarity=same_location; matches=${similarProfileCandidates
        .map((item) => item.id)
        .slice(0, 5)
        .join(",")}`
    });
  }

  return signals;
};

const formatSignalForResponse = (
  signal: Prisma.FraudSignalGetPayload<{ select: typeof fraudSignalPublicSelect }>
) => ({
  id: signal.id,
  candidateId: signal.candidateId,
  caseId: signal.caseId,
  signalType: signal.signalType,
  riskLevel: signal.riskLevel,
  evidenceMasked: signal.evidenceMasked,
  status: signal.status,
  createdAt: signal.createdAt,
  updatedAt: signal.updatedAt
});

const formatFraudCase = (fraudCase: FraudCaseForResponse) => ({
  id: fraudCase.id,
  candidateId: fraudCase.candidateId,
  riskScore: fraudCase.riskScore,
  riskLevel: fraudCase.riskLevel,
  reviewStatus: fraudCase.reviewStatus,
  reviewerId: fraudCase.reviewerId,
  decision: fraudCase.decision,
  reason: fraudCase.reason,
  decidedAt: fraudCase.decidedAt,
  candidate: {
    id: fraudCase.candidate.id,
    userId: fraudCase.candidate.user.id,
    fullName: fraudCase.candidate.user.fullName,
    emailMasked: maskEmail(fraudCase.candidate.user.email),
    phoneMasked: maskPhone(fraudCase.candidate.user.phone),
    location: fraudCase.candidate.location,
    isActive: fraudCase.candidate.user.isActive
  },
  reviewer: fraudCase.reviewer
    ? {
        id: fraudCase.reviewer.id,
        fullName: fraudCase.reviewer.fullName,
        emailMasked: maskEmail(fraudCase.reviewer.email),
        role: fraudCase.reviewer.role
      }
    : null,
  signals: fraudCase.signals.map(formatSignalForResponse),
  createdAt: fraudCase.createdAt,
  updatedAt: fraudCase.updatedAt
});

const ensureFraudCase = async (
  candidateId: string,
  highestRiskLevel: FraudRiskLevel,
  actorUserId: string | null | undefined,
  actorRole: Role | null | undefined,
  client: PrismaExecutor
) => {
  const reviewStatus =
    highestRiskLevel === FraudRiskLevel.HIGH
      ? FraudReviewStatus.NEED_VERIFICATION
      : FraudReviewStatus.OPEN;
  const activeCase = await client.fraudCase.findFirst({
    where: {
      candidateId,
      reviewStatus: { in: activeReviewStatuses }
    },
    select: {
      id: true,
      riskLevel: true,
      riskScore: true,
      reviewStatus: true
    },
    orderBy: { updatedAt: "desc" }
  });

  if (activeCase) {
    const nextRiskLevel =
      riskRank[highestRiskLevel] > riskRank[activeCase.riskLevel]
        ? highestRiskLevel
        : activeCase.riskLevel;

    await client.fraudCase.update({
      where: { id: activeCase.id },
      data: {
        riskLevel: nextRiskLevel,
        riskScore: Math.max(activeCase.riskScore, riskScoreByLevel[highestRiskLevel]),
        reviewStatus:
          activeCase.reviewStatus === FraudReviewStatus.OPEN &&
          highestRiskLevel === FraudRiskLevel.HIGH
            ? FraudReviewStatus.NEED_VERIFICATION
            : activeCase.reviewStatus
      }
    });

    return activeCase.id;
  }

  const fraudCase = await client.fraudCase.create({
    data: {
      candidateId,
      riskScore: riskScoreByLevel[highestRiskLevel],
      riskLevel: highestRiskLevel,
      reviewStatus
    },
    select: fraudCaseSelect
  });

  await createAuditLog(
    {
      actorUserId,
      actorRole,
      action: "FRAUD_CASE_CREATED",
      entityType: "FraudCase",
      entityId: fraudCase.id,
      afterValue: formatFraudCase(fraudCase),
      reason: "Basic candidate integrity check created fraud case."
    },
    client
  );

  return fraudCase.id;
};

const persistSignals = async (
  candidateId: string,
  caseId: string,
  signals: DetectedSignal[],
  actorUserId: string | null | undefined,
  actorRole: Role | null | undefined,
  client: PrismaExecutor
) => {
  const persistedSignals: Array<
    Prisma.FraudSignalGetPayload<{ select: typeof fraudSignalPublicSelect }>
  > = [];

  for (const signal of signals) {
    const existingSignal = await client.fraudSignal.findFirst({
      where: {
        candidateId,
        signalType: signal.signalType,
        evidenceHash: signal.evidenceHash,
        status: { in: activeReviewStatuses }
      },
      select: fraudSignalPublicSelect
    });

    if (existingSignal) {
      if (!existingSignal.caseId) {
        const updatedSignal = await client.fraudSignal.update({
          where: { id: existingSignal.id },
          data: { caseId },
          select: fraudSignalPublicSelect
        });
        persistedSignals.push(updatedSignal);
      } else {
        persistedSignals.push(existingSignal);
      }
      continue;
    }

    const createdSignal = await client.fraudSignal.create({
      data: {
        candidateId,
        caseId,
        signalType: signal.signalType,
        riskLevel: signal.riskLevel,
        evidenceHash: signal.evidenceHash,
        evidenceMasked: signal.evidenceMasked,
        status: FraudReviewStatus.OPEN
      },
      select: fraudSignalPublicSelect
    });

    await createAuditLog(
      {
        actorUserId,
        actorRole,
        action: "FRAUD_SIGNAL_DETECTED",
        entityType: "FraudSignal",
        entityId: createdSignal.id,
        afterValue: formatSignalForResponse(createdSignal),
        reason: "Basic candidate integrity check detected fraud signal."
      },
      client
    );

    persistedSignals.push(createdSignal);
  }

  return persistedSignals;
};

export const runBasicFraudCheckForCandidate = async (
  input: RunFraudCheckInput,
  client: PrismaExecutor = prisma
) => {
  const candidate = await getCandidate(input.candidateId, client);
  const detectedSignals = await detectSignals(candidate, client);

  if (detectedSignals.length === 0) {
    return {
      detected: false,
      highestRiskLevel: null,
      fraudCase: null,
      signals: []
    };
  }

  const highestRiskLevel = maxRiskLevel(detectedSignals.map((signal) => signal.riskLevel));
  const caseId = await ensureFraudCase(
    input.candidateId,
    highestRiskLevel,
    input.actorUserId,
    input.actorRole,
    client
  );
  const persistedSignals = await persistSignals(
    input.candidateId,
    caseId,
    detectedSignals,
    input.actorUserId,
    input.actorRole,
    client
  );

  if (highestRiskLevel === FraudRiskLevel.HIGH && input.notifyCandidateOnHigh !== false) {
    await createNotification(
      {
        userId: candidate.user.id,
        type: NotificationType.SYSTEM,
        title: "Verifikasi tambahan diperlukan",
        bodySafe:
          "Akun atau lamaran Anda memerlukan verifikasi tambahan. Silakan cek status dan ikuti instruksi yang tersedia."
      },
      client
    );
  }

  const fraudCase = await client.fraudCase.findUnique({
    where: { id: caseId },
    select: fraudCaseSelect
  });

  return {
    detected: true,
    highestRiskLevel,
    fraudCase: fraudCase ? formatFraudCase(fraudCase) : null,
    signals: persistedSignals.map(formatSignalForResponse)
  };
};

export const listFraudCasesForAdmin = async (filters: FraudCaseQuery = {}) => {
  const cases = await prisma.fraudCase.findMany({
    where: {
      riskLevel: filters.riskLevel,
      reviewStatus: filters.reviewStatus,
      candidateId: filters.candidateId
    },
    select: fraudCaseSelect,
    orderBy: { createdAt: "desc" }
  });

  return cases.map(formatFraudCase);
};

export const getFraudCaseByIdForAdmin = async (caseId: string) => {
  const fraudCase = await prisma.fraudCase.findUnique({
    where: { id: caseId },
    select: fraudCaseSelect
  });

  if (!fraudCase) {
    throw new AppError("Fraud case not found.", 404);
  }

  return formatFraudCase(fraudCase);
};

export const updateFraudCaseDecision = async (
  caseId: string,
  reviewerId: string,
  reviewerRole: Role,
  input: FraudCaseDecisionInput
) => {
  return prisma.$transaction(async (tx) => {
    const before = await tx.fraudCase.findUnique({
      where: { id: caseId },
      select: fraudCaseSelect
    });

    if (!before) {
      throw new AppError("Fraud case not found.", 404);
    }

    await tx.fraudCase.update({
      where: { id: caseId },
      data: {
        reviewStatus: input.decision,
        decision: input.decision,
        reason: input.reason,
        reviewerId,
        decidedAt: new Date()
      }
    });

    await tx.fraudSignal.updateMany({
      where: { caseId },
      data: { status: input.decision }
    });

    if (input.decision === FraudReviewStatus.BLOCKED) {
      await tx.user.update({
        where: { id: before.candidate.user.id },
        data: { isActive: false }
      });
    }

    const after = await tx.fraudCase.findUnique({
      where: { id: caseId },
      select: fraudCaseSelect
    });

    if (!after) {
      throw new AppError("Fraud case not found.", 404);
    }

    await createAuditLog(
      {
        actorUserId: reviewerId,
        actorRole: reviewerRole,
        action: "FRAUD_CASE_DECISION_UPDATED",
        entityType: "FraudCase",
        entityId: caseId,
        beforeValue: formatFraudCase(before),
        afterValue: formatFraudCase(after),
        reason: input.reason
      },
      tx
    );

    if (input.decision === FraudReviewStatus.NEED_VERIFICATION) {
      await createNotification(
        {
          userId: before.candidate.user.id,
          type: NotificationType.SYSTEM,
          title: "Verifikasi tambahan diperlukan",
          bodySafe:
            "Akun atau lamaran Anda memerlukan verifikasi tambahan. Silakan cek status dan ikuti instruksi yang tersedia."
        },
        tx
      );
    }

    return formatFraudCase(after);
  });
};
