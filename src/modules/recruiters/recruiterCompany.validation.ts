import { z } from "zod";

const optionalText = z.string().trim().min(1).optional();

export const updateRecruiterCompanySchema = z
  .object({
    name: optionalText,
    industry: optionalText,
    size: optionalText,
    location: optionalText,
    website: optionalText,
    description: optionalTex
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one company profile field is required."
  });
