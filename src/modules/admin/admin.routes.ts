import { Role } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";
import {
  validateBody,
  validateParams,
  validateQuery
} from "../../middlewares/validateRequest";
import {
  approveCompany,
  listPendingCompanies,
  rejectCompany
} from "./admin.controller";
import {
  getAppealByIdForAdmin,
  listAppealsForAdmin,
  updateAppealDecision
} from "../appeals/appeals.controller";
import {
  appealDecisionSchema,
  appealIdParamSchema
} from "../appeals/appeals.validation";
import {
  getFraudCaseByIdForAdmin,
  listFraudCasesForAdmin,
  updateFraudCaseDecision
} from "../fraud/fraud.controller";
import {
  fraudCaseDecisionSchema,
  fraudCaseIdParamSchema,
  fraudCaseQuerySchema
} from "../fraud/fraud.validation";
import {
  companyIdParamSchema,
  rejectCompanySchema
} from "./admin.validation";

const router = Router();

router.use(authMiddleware, roleMiddleware(Role.ADMIN, Role.SUPER_ADMIN));

router.get("/fraud-cases", validateQuery(fraudCaseQuerySchema), listFraudCasesForAdmin);
router.get(
  "/fraud-cases/:caseId",
  validateParams(fraudCaseIdParamSchema),
  getFraudCaseByIdForAdmin
);
router.post(
  "/fraud-cases/:caseId/decision",
  validateParams(fraudCaseIdParamSchema),
  validateBody(fraudCaseDecisionSchema),
  updateFraudCaseDecision
);

router.get("/appeals", listAppealsForAdmin);
router.get("/appeals/:appealId", validateParams(appealIdParamSchema), getAppealByIdForAdmin);
router.post(
  "/appeals/:appealId/decision",
  validateParams(appealIdParamSchema),
  validateBody(appealDecisionSchema),
  updateAppealDecision
);

router.get("/companies/pending", listPendingCompanies);
router.post("/companies/:companyId/approve", validateParams(companyIdParamSchema), approveCompany);
router.post(
  "/companies/:companyId/reject",
  validateParams(companyIdParamSchema),
  validateBody(rejectCompanySchema),
  rejectCompany
);

export default router;
