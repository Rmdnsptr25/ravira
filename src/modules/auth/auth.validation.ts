import { z } from "zod";

const emailSchema = z.string().trim().email().transform((value) => value.toLowerCase());
const passwordSchema = z.string().min(8, "Password must be at least 8 characters.");
const optionalTextSchema = z.string().trim().min(1).optional();
const nameSchema = z.string().trim().min(1, "Name is required.");

export const registerCandidateSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    phone: optionalTextSchema,
    location: optionalTextSchema,
    consentAccepted: z.boolean().refine((value) => value === true, {
      message: "Candidate consent is required."
    })
  })
  .strict();

export const registerRecruiterSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    phone: optionalTextSchema,
    companyName: z.string().trim().min(1, "Company name is required."),
    industry: optionalTextSchema,
    location: optionalTextSchema,
    companyWebsite: z.string().trim().url().optional(),
    position: optionalTextSchema
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, "Password is required.")
  })
  .strict();
