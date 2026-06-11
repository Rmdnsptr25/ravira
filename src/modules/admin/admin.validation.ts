import { z } from "zod";

export const companyIdParamSchema = z.object({
  companyId: z.string().uuid("Invalid company id.")
}).strict();

export const rejectCompanySchema = z
  .object({
    reason: z.string().trim().min(1, "Reason is required.")
  })
  .strict();
