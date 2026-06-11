import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { validateBody } from "../../middlewares/validateRequest";
import {
  login,
  me,
  registerCandidate,
  registerRecruiter
} from "./auth.controller";
import {
  loginSchema,
  registerCandidateSchema,
  registerRecruiterSchema
} from "./auth.validation";

const router = Router();

router.post("/register/candidate", validateBody(registerCandidateSchema), registerCandidate);
router.post("/register/recruiter", validateBody(registerRecruiterSchema), registerRecruiter);
router.post("/login", validateBody(loginSchema), login);
router.get("/me", authMiddleware, me);

export default router;
