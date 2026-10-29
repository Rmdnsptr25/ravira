import { z } from "zod";

export const saveJobSchema = z
  .object({
    jobId: z.string().uuid("Invalid job id.")
  })
  .strict();

export const savedJobParamSchema = z
  .object({
    jobId: z.string().uuid("Invalid job id.")
  })
  .strict();
