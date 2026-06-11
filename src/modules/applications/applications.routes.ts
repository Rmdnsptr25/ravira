import { Role } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";
import {
  validateBody,
  validateParams
} from "../../middlewares/validateRequest";
import {
  getApplicationById,
  getApplicationStatusHistory,
  updateApplicationStage
} from "./applications.controller";
import {
  applicationIdParamSchema,
  updateApplicationStageSchema
} from "./applications.validation";
import { getApplicationCandidateScore } from "../scoring/scoring.controller";

const router = Router();

router.use(authMiddleware);

router.get(
  "/:applicationId/score",
  validateParams(applicationIdParamSchema),
  getApplicationCandidateScore
);
router.get("/:applicationId", validateParams(applicationIdParamSchema), getApplicationById);
router.get(
  "/:applicationId/status-history",
  validateParams(applicationIdParamSchema),
  getApplicationStatusHistory
);
router.post(
  "/:applicationId/stage",
  roleMiddleware(Role.RECRUITER),
  validateParams(applicationIdParamSchema),
  validateBody(updateApplicationStageSchema),
  updateApplicationStage
);

export default router;
