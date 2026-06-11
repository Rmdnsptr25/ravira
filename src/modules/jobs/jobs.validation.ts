import { z } from "zod";

export const jobIdParamSchema = z.object({
  jobId: z.string().uuid("Invalid job id.")
}).strict();

const optionalQueryText = z
  .union([z.string().trim().min(1), z.array(z.string()).transform((value) => value[0])])
  .optional();

export const jobSearchQuerySchema = z
  .object({
    keyword: optionalQueryText,
    location: optionalQueryText,
    jobType: optionalQueryText,
    workType: optionalQueryText,
    skill: optionalQueryText
  })
  .strict();
