import { z } from "zod";

const optionalName = z.string().trim().min(1, "Company name cannot be empty.").optional();

const optionalNullableText = z
  .union([z.string().trim(), z.null()])
  .transform((val) => (val === "" ? null : val))
  .optional();

const optionalNullableWebsite = z
  .union([
    z.string().trim().url("Website must be a valid URL."),
    z.literal("").transform(() => null),
    z.null(),
  ])
  .optional();

export const updateRecruiterCompanySchema = z
  .object({
    name: optionalName,
    industry: optionalNullableText,
    size: optionalNullableText,
    location: optionalNullableText,
    website: optionalNullableWebsite,
    description: optionalNullableText,
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "At least one company profile field is required.",
    }
  );
