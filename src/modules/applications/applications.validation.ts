import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

export const applicationIdParamSchema = z.object({
  applicationId: z.string().uuid("Invalid application id.")
}).strict();

export const applyToJobSchema = z
  .object({
    coverLetter: z.string().trim().min(1).optional()
  })
  .strict();

export const updateApplicationStageSchema = z
  .object({
    newStatus: z.nativeEnum(ApplicationStatus),
    reason: z.string().trim().min(1, "Reason is required.")
  })
  .strict();
