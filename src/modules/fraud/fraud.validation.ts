import {
  FraudReviewStatus,
  FraudRiskLevel
} from "@prisma/client";
import { z } from "zod";

export const fraudCaseIdParamSchema = z
  .object({
    caseId: z.string().uuid("Invalid fraud case id.")
  })
  .strict();

export const fraudCaseQuerySchema = z
  .object({
    riskLevel: z.nativeEnum(FraudRiskLevel).optional(),
    reviewStatus: z.nativeEnum(FraudReviewStatus).optional(),
    candidateId: z.string().uuid("Invalid candidate id.").optional()
  })
  .strict();

export const fraudCaseDecisionSchema = z
  .object({
    decision: z.enum([
      FraudReviewStatus.VALID,
      FraudReviewStatus.FALSE_POSITIVE,
      FraudReviewStatus.NEED_VERIFICATION,
      FraudReviewStatus.MERGED,
      FraudReviewStatus.BLOCKED,
      FraudReviewStatus.RESOLVED
    ]),
    reason: z.string().trim().min(1, "Reason is required.")
  })
  .strict();
