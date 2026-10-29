import { Role } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { candidateCvUploadMiddleware } from "../../middlewares/candidateCvUploadMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";
import {
  validateBody,
  validateParams,
  validateQuery
} from "../../middlewares/validateRequest";
import {
  deleteMyCv,
  getMyCvById,
  listMyCv,
  uploadMyCv
} from "./candidateCv.controller";
import {
  createMySkillGap,
  createMyTrainingProgress,
  getMySkillGap,
  getMyTrainingRecommendations,
  listMyTrainingProgress,
  updateMyTrainingProgress
} from "./candidateDevelopment.controller";
import {
  createSkillGapReportSchema,
  createTrainingProgressSchema,
  progressIdParamSchema,
  skillGapQuerySchema,
  trainingRecommendationQuerySchema,
  updateTrainingProgressSchema
} from "./candidateDevelopment.validation";
import {
  createMySkill,
  deleteMySkill,
  getMyProfile,
  listMySkills,
  updateMyProfile,
  updateMySkill
} from "./candidates.controller";
import {
  createCandidateSkillSchema,
  cvIdParamSchema,
  updateCandidateProfileSchema,
  updateCandidateSkillSchema,
  uuidParamSchema
} from "./candidates.validation";
import {
  deleteMySavedJob,
  listMySavedJobs,
  saveMyJob
} from "./candidateSavedJobs.controller";
import {
  savedJobParamSchema,
  saveJobSchema
} from "./candidateSavedJobs.validation";
import { listMyApplications } from "../applications/applications.controller";
import {
  getMyAppealById,
  listMyAppeals
} from "../appeals/appeals.controller";
import { appealIdParamSchema } from "../appeals/appeals.validation";
import { getMyJobRecommendations } from "../scoring/scoring.controller";

const router = Router();

router.use(authMiddleware, roleMiddleware(Role.CANDIDATE));

router.get("/me/recommendations/jobs", getMyJobRecommendations);
router.get("/me", getMyProfile);
router.patch("/me", validateBody(updateCandidateProfileSchema), updateMyProfile);

router.get("/me/skill-gap", validateQuery(skillGapQuerySchema), getMySkillGap);
router.post("/me/skill-gap", validateBody(createSkillGapReportSchema), createMySkillGap);
router.get(
  "/me/training-recommendations",
  validateQuery(trainingRecommendationQuerySchema),
  getMyTrainingRecommendations
);
router.get("/me/training-progress", listMyTrainingProgress);
router.post(
  "/me/training-progress",
  validateBody(createTrainingProgressSchema),
  createMyTrainingProgress
);
router.patch(
  "/me/training-progress/:progressId",
  validateParams(progressIdParamSchema),
  validateBody(updateTrainingProgressSchema),
  updateMyTrainingProgress
);

router.post("/me/cv", candidateCvUploadMiddleware, uploadMyCv);
router.get("/me/cv", listMyCv);
router.get("/me/cv/:cvId", validateParams(cvIdParamSchema), getMyCvById);
router.delete("/me/cv/:cvId", validateParams(cvIdParamSchema), deleteMyCv);

router.get("/me/skills", listMySkills);
router.post("/me/skills", validateBody(createCandidateSkillSchema), createMySkill);
router.patch(
  "/me/skills/:skillId",
  validateParams(uuidParamSchema),
  validateBody(updateCandidateSkillSchema),
  updateMySkill
);
router.delete("/me/skills/:skillId", validateParams(uuidParamSchema), deleteMySkill);

router.get("/me/saved-jobs", listMySavedJobs);
router.post("/me/saved-jobs", validateBody(saveJobSchema), saveMyJob);
router.delete(
  "/me/saved-jobs/:jobId",
  validateParams(savedJobParamSchema),
  deleteMySavedJob
);

router.get("/me/applications", listMyApplications);
router.get("/me/appeals", listMyAppeals);
router.get("/me/appeals/:appealId", validateParams(appealIdParamSchema), getMyAppealById);

export default router;
