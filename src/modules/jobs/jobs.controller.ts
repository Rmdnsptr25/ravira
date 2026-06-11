import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import * as jobService from "./jobs.service";

export const listPublishedJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.listPublishedJobs(res.locals.validatedQuery ?? req.query);
  sendSuccess(res, "Published jobs retrieved successfully.", jobs);
});

export const searchPublishedJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.listPublishedJobs(res.locals.validatedQuery ?? req.query);
  sendSuccess(res, "Published jobs search completed successfully.", jobs);
});

export const getPublishedJobById = asyncHandler(async (req, res) => {
  const job = await jobService.getPublishedJobById(req.params.jobId as string);
  sendSuccess(res, "Published job retrieved successfully.", job);
});
