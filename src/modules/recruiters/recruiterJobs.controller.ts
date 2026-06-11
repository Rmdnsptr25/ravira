import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import * as recruiterJobService from "./recruiterJobs.service";

export const createRecruiterJob = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const job = await recruiterJobService.createRecruiterJob(req.user!.id, req.user!.role, req.body);
    sendSuccess(res, "Job created successfully.", job, 201);
  }
);

export const listRecruiterJobs = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const jobs = await recruiterJobService.listRecruiterJobs(req.user!.id);
    sendSuccess(res, "Recruiter jobs retrieved successfully.", jobs);
  }
);

export const getRecruiterJob = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const job = await recruiterJobService.getRecruiterJob(req.user!.id, req.params.jobId as string);
    sendSuccess(res, "Recruiter job retrieved successfully.", job);
  }
);

export const updateRecruiterJob = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const job = await recruiterJobService.updateRecruiterJob(
      req.user!.id,
      req.user!.role,
      req.params.jobId as string,
      req.body
    );
    sendSuccess(res, "Job updated successfully.", job);
  }
);

export const deleteRecruiterJob = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const job = await recruiterJobService.deleteRecruiterJob(
      req.user!.id,
      req.user!.role,
      req.params.jobId as string
    );
    sendSuccess(res, "Job deleted successfully.", job);
  }
);

export const listApplicationsForRecruiterJob = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const applications = await recruiterJobService.listApplicationsForRecruiterJob(
      req.user!.id,
      req.params.jobId as string
    );
    sendSuccess(res, "Job applications retrieved successfully.", applications);
  }
);
