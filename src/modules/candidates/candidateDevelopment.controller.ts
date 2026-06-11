import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import * as candidateDevelopmentService from "./candidateDevelopment.service";

export const getMySkillGap = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const report = await candidateDevelopmentService.generateMySkillGapReport(
      req.user!.id,
      req.user!.role,
      res.locals.validatedQuery ?? {}
    );

    sendSuccess(res, "Skill gap report generated successfully.", report);
  }
);

export const createMySkillGap = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const report = await candidateDevelopmentService.generateMySkillGapReport(
      req.user!.id,
      req.user!.role,
      req.body
    );

    sendSuccess(res, "Skill gap report generated successfully.", report, 201);
  }
);

export const getMyTrainingRecommendations = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const recommendations = await candidateDevelopmentService.getMyTrainingRecommendations(
      req.user!.id,
      res.locals.validatedQuery ?? {}
    );

    sendSuccess(res, "Training recommendations retrieved successfully.", recommendations);
  }
);

export const listMyTrainingProgress = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const progress = await candidateDevelopmentService.listMyTrainingProgress(req.user!.id);

    sendSuccess(res, "Training progress retrieved successfully.", progress);
  }
);

export const createMyTrainingProgress = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const progress = await candidateDevelopmentService.createMyTrainingProgress(
      req.user!.id,
      req.user!.role,
      req.body
    );

    sendSuccess(res, "Training progress created successfully.", progress, 201);
  }
);

export const updateMyTrainingProgress = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const progress = await candidateDevelopmentService.updateMyTrainingProgress(
      req.user!.id,
      req.user!.role,
      req.params.progressId as string,
      req.body
    );

    sendSuccess(res, "Training progress updated successfully.", progress);
  }
);
