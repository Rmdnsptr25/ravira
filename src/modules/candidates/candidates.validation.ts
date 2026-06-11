import { ProfileVisibility } from "@prisma/client";
import { z } from "zod";

export const uuidParamSchema = z.object({
  skillId: z.string().uuid("Invalid skill id.")
}).strict();

export const cvIdParamSchema = z.object({
  cvId: z.string().uuid("Invalid CV id.")
}).strict();

export const updateCandidateProfileSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required.").optional(),
    phone: z.string().trim().min(1).optional(),
    location: z.string().trim().min(1).optional(),
    education: z.string().trim().min(1).optional(),
    experienceSummary: z.string().trim().min(1).optional(),
    salaryExpectation: z.number().int().nonnegative().optional(),
    mobilityPreference: z.string().trim().min(1).optional(),
    visibilityStatus: z.nativeEnum(ProfileVisibility).optional()
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one profile field is required."
  });

export const createCandidateSkillSchema = z
  .object({
    skillName: z.string().trim().min(1, "Skill name is required."),
    level: z.string().trim().min(1).optional(),
    source: z.string().trim().min(1).optional(),
    confidenceScore: z.number().min(0).max(100).optional()
  })
  .strict();

export const updateCandidateSkillSchema = createCandidateSkillSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one skill field is required."
  });
