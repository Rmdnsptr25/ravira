import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import * as appealService from "./appeals.service";

export const createMyAppeal = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const appeal = await appealService.createMyAppeal(req.user!.id, req.user!.role, req.body);
    sendSuccess(res, "Appeal created successfully.", appeal, 201);
  }
);

export const listMyAppeals = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const appeals = await appealService.listMyAppeals(req.user!.id);
    sendSuccess(res, "Candidate appeals retrieved successfully.", appeals);
  }
);

export const getMyAppealById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const appeal = await appealService.getMyAppealById(
      req.user!.id,
      req.params.appealId as string
    );
    sendSuccess(res, "Candidate appeal retrieved successfully.", appeal);
  }
);

export const listAppealsForAdmin = asyncHandler(async (_req, res) => {
  const appeals = await appealService.listAppealsForAdmin();
  sendSuccess(res, "Appeals retrieved successfully.", appeals);
});

export const getAppealByIdForAdmin = asyncHandler(async (req, res) => {
  const appeal = await appealService.getAppealByIdForAdmin(req.params.appealId as string);
  sendSuccess(res, "Appeal retrieved successfully.", appeal);
});

export const updateAppealDecision = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const appeal = await appealService.updateAppealDecision(
      req.params.appealId as string,
      req.user!.id,
      req.user!.role,
      req.body
    );
    sendSuccess(res, "Appeal decision updated successfully.", appeal);
  }
);
