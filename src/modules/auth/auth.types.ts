import { z } from "zod";
import {
  loginSchema,
  registerCandidateSchema,
  registerRecruiterSchema
} from "./auth.validation";

export type RegisterCandidateInput = z.infer<typeof registerCandidateSchema>;
export type RegisterRecruiterInput = z.infer<typeof registerRecruiterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
