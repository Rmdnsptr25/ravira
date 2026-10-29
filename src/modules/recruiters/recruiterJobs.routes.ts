import { Role } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";
import {
  validateBody,
  validateParams
} from "../../middlewares/validateRequest";
import {
  createRecruiterJob,
  deleteRecruiterJob,
  getRecruiterJob,
  listApplicationsForRecruiterJob,
  listRecruiterJobs,
  updateRecruiterJob
} from "./recruiterJobs.controller";
import {
  createRecruiterJobSchema,
  jobIdParamSchema,
  updateRecruiterJobSchema
} from "./recruiterJobs.validation";
import {
  getRecruiterCompanyProfile,
  updateRecruiterCompanyProfile
} from "./recruiterCompany.controller";
import { updateRecruiterCompanySchema } from "./recruiterCompany.validation";
import { getRecruiterJobCandidateScores } from "../scoring/scoring.controller";

const router = Router();

router.use(authMiddleware, roleMiddleware(Role.RECRUITER));

router.get("/company", getRecruiterCompanyProfile);
router.patch(
  "/company",
  validateBody(updateRecruiterCompanySchema),
  updateRecruiterCompanyProfile
);

router.post("/jobs", validateBody(createRecruiterJobSchema), createRecruiterJob);
router.get("/jobs", listRecruiterJobs);
router.get(
  "/jobs/:jobId/candidate-scores",
  validateParams(jobIdParamSchema),
  getRecruiterJobCandidateScores
);
router.get("/jobs/:jobId", validateParams(jobIdParamSchema), getRecruiterJob);
router.patch(
  "/jobs/:jobId",
  validateParams(jobIdParamSchema),
  validateBody(updateRecruiterJobSchema),
  updateRecruiterJob
);
router.delete("/jobs/:jobId", validateParams(jobIdParamSchema), deleteRecruiterJob);
router.get(
  "/jobs/:jobId/applications",
  validateParams(jobIdParamSchema),
  listApplicationsForRecruiterJob
);

export default router;
