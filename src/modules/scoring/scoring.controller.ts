import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import * as scoringService from "./scoring.service";

export const getMyJobRecommendations = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const recommendations = await scoringService.getCandidateJobRecommendations(req.user!.id);
    sendSuccess(res, "Candidate job recommendations retrieved successfully.", recommendations);
  }
);

export const getMyJobMatchScore = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const matchScore = await scoringService.getMyJobMatchScore(
      req.user!.id,
      req.params.jobId as string
    );
    sendSuccess(res, "Job match score retrieved successfully.", matchScore);
  }
);

export const getRecruiterJobCandidateScores = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const scores = await scoringService.getRecruiterJobCandidateScores(
      req.user!.id,
      req.params.jobId as string
    );
    sendSuccess(res, "Candidate scores retrieved successfully.", scores);
  }
);

export const getApplicationCandidateScore = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const score = await scoringService.getApplicationCandidateScore(
      req.params.applicationId as string,
      req.user!.id,
      req.user!.role
    );
    sendSuccess(res, "Application candidate score retrieved successfully.", score);
  }
);
