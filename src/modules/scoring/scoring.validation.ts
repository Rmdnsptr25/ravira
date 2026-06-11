import { z } from "zod";

export const jobIdParamSchema = z
  .object({
    jobId: z.string().uuid("Invalid job id.")
  })
  .strict();

export const applicationIdParamSchema = z
  .object({
    applicationId: z.string().uuid("Invalid application id.")
  })
  .strict();
