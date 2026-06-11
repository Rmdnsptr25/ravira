import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import * as fraudService from "./fraud.service";

export const listFraudCasesForAdmin = asyncHandler(async (_req, res) => {
  const cases = await fraudService.listFraudCasesForAdmin(res.locals.validatedQuery);
  sendSuccess(res, "Fraud cases retrieved successfully.", cases);
});

export const getFraudCaseByIdForAdmin = asyncHandler(async (req, res) => {
  const fraudCase = await fraudService.getFraudCaseByIdForAdmin(
    req.params.caseId as string
  );
  sendSuccess(res, "Fraud case retrieved successfully.", fraudCase);
});

export const updateFraudCaseDecision = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const fraudCase = await fraudService.updateFraudCaseDecision(
      req.params.caseId as string,
      req.user!.id,
      req.user!.role,
      req.body
    );

    sendSuccess(res, "Fraud case decision updated successfully.", fraudCase);
  }
);
