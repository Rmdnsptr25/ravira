import { TrainingStatus } from "@prisma/client";
import { z } from "zod";

export const skillGapQuerySchema = z
  .object({
    jobId: z.string().uuid("Invalid job id.").optional(),
    targetRole: z.string().trim().min(1).optional()
  })
  .strict();

export const createSkillGapReportSchema = z
  .object({
    jobId: z.string().uuid("Invalid job id.").optional(),
    targetRole: z.string().trim().min(1).optional()
  })
  .strict();

export const trainingRecommendationQuerySchema = skillGapQuerySchema;

export const createTrainingProgressSchema = z
  .object({
    courseId: z.string().uuid("Invalid course id."),
    status: z.nativeEnum(TrainingStatus).optional(),
    progressPct: z.number().int().min(0).max(100).optional()
  })
  .strict();

export const updateTrainingProgressSchema = z
  .object({
    status: z.nativeEnum(TrainingStatus).optional(),
    progressPct: z.number().int().min(0).max(100).optional()
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one training progress field is required."
  });

export const progressIdParamSchema = z
  .object({
    progressId: z.string().uuid("Invalid training progress id.")
  })
  .strict();
