import { AppealStatus } from "@prisma/client";
import { z } from "zod";

export const appealIdParamSchema = z
  .object({
    appealId: z.string().uuid("Invalid appeal id.")
  })
  .strict();

export const createAppealSchema = z
  .object({
    relatedEntity: z.enum([
      "profile",
      "skill",
      "application_status",
      "verification",
      "parsing_result"
    ]),
    relatedEntityId: z.string().trim().min(1).optional(),
    reason: z.string().trim().min(1, "Reason is required."),
    evidenceUrl: z.string().trim().url().optional()
  })
  .strict();

export const appealDecisionSchema = z
  .object({
    status: z.enum([
      AppealStatus.IN_REVIEW,
      AppealStatus.NEED_INFO,
      AppealStatus.APPROVED,
      AppealStatus.REJECTED,
      AppealStatus.RESOLVED
    ]),
    reason: z.string().trim().min(1, "Reason is required.")
  })
  .strict();
