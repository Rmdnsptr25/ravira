import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";
import {
  validateBody,
  validateParams,
  validateQuery
} from "../../middlewares/validateRequest";
import {
  getPublishedJobById,
  listPublishedJobs,
  searchPublishedJobs
} from "./jobs.controller";
import {
  jobIdParamSchema,
  jobSearchQuerySchema
} from "./jobs.validation";
import { applyToJob } from "../applications/applications.controller";
import { applyToJobSchema } from "../applications/applications.validation";
import { Role } from "@prisma/client";
import { getMyJobMatchScore } from "../scoring/scoring.controller";

const router = Router();

router.get("/", validateQuery(jobSearchQuerySchema), listPublishedJobs);
router.get("/search", validateQuery(jobSearchQuerySchema), searchPublishedJobs);
router.get(
  "/:jobId/match-score",
  authMiddleware,
  roleMiddleware(Role.CANDIDATE),
  validateParams(jobIdParamSchema),
  getMyJobMatchScore
);
router.post(
  "/:jobId/apply",
  authMiddleware,
  roleMiddleware(Role.CANDIDATE),
  validateParams(jobIdParamSchema),
  validateBody(applyToJobSchema),
  applyToJob
);
router.get("/:jobId", validateParams(jobIdParamSchema), getPublishedJobById);

export default router;
