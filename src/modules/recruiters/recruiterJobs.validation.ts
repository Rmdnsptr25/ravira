import { JobStatus } from "@prisma/client";
import { z } from "zod";

const optionalText = z.string().trim().min(1).optional();

export const jobIdParamSchema = z.object({
  jobId: z.string().uuid("Invalid job id.")
}).strict();

const jobSkillSchema = z
  .object({
    skillName: z.string().trim().min(1, "Skill name is required."),
    required: z.boolean().optional(),
    weight: z.number().int().min(1).optional()
  })
  .strict();

const recruiterJobBaseSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required."),
    description: z.string().trim().min(1, "Description is required."),
    location: optionalText,
    jobType: optionalText,
    workType: optionalText,
    employmentType: optionalText,
    salaryMin: z.number().int().nonnegative().optional(),
    salaryMax: z.number().int().nonnegative().optional(),
    status: z.nativeEnum(JobStatus).optional(),
    jobSkills: z.array(jobSkillSchema).optional()
  })
  .strict();

const salaryRangeIsValid = (value: { salaryMin?: number; salaryMax?: number }) =>
  value.salaryMin === undefined ||
  value.salaryMax === undefined ||
  value.salaryMax >= value.salaryMin;

export const createRecruiterJobSchema = recruiterJobBaseSchema
  .refine(
    salaryRangeIsValid,
    {
      message: "salaryMax must be greater than or equal to salaryMin."
    }
  );

export const updateRecruiterJobSchema = recruiterJobBaseSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one job field is required."
  })
  .refine(salaryRangeIsValid, {
    message: "salaryMax must be greater than or equal to salaryMin."
  });
