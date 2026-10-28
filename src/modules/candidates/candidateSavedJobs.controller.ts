import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import * as savedJobsService from "./candidateSavedJobs.service";

export const listMySavedJobs = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const savedJobs = await savedJobsService.listSavedJobs(req.user!.id);
    sendSuccess(res, "Saved jobs retrieved successfully.", savedJobs);
  }
);

export const saveMyJob = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await savedJobsService.saveJob(req.user!.id, req.body.jobId);
    sendSuccess(res, "Job saved successfully.", result, 201);
  }
);

export const deleteMySavedJob = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await savedJobsService.unsaveJob(
      req.user!.id,
      req.params.jobId as string
    );
    sendSuccess(res, "Job removed from saved jobs successfully.", result);
  }
);
