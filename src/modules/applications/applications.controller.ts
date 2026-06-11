import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import * as applicationService from "./applications.service";

export const applyToJob = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const application = await applicationService.applyToJob(
    req.user!.id,
    req.user!.role,
    req.params.jobId as string,
    req.body
  );

  sendSuccess(res, "Application submitted successfully.", application, 201);
});

export const listMyApplications = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const applications = await applicationService.listMyApplications(req.user!.id);
    sendSuccess(res, "Candidate applications retrieved successfully.", applications);
  }
);

export const getApplicationById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const application = await applicationService.getApplicationById(
      req.params.applicationId as string,
      req.user!.id,
      req.user!.role
    );
    sendSuccess(res, "Application retrieved successfully.", application);
  }
);

export const updateApplicationStage = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const application = await applicationService.updateApplicationStage(
      req.params.applicationId as string,
      req.user!.id,
      req.user!.role,
      req.body
    );
    sendSuccess(res, "Application stage updated successfully.", application);
  }
);

export const getApplicationStatusHistory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const statusHistory = await applicationService.getApplicationStatusHistory(
      req.params.applicationId as string,
      req.user!.id,
      req.user!.role
    );
    sendSuccess(res, "Application status history retrieved successfully.", statusHistory);
  }
);
