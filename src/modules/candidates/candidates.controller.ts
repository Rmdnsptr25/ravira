import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import * as candidateService from "./candidates.service";

export const getMyProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const profile = await candidateService.getMyProfile(req.user!.id);
  sendSuccess(res, "Candidate profile retrieved successfully.", profile);
});

export const updateMyProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const profile = await candidateService.updateMyProfile(req.user!.id, req.body);
  sendSuccess(res, "Candidate profile updated successfully.", profile);
});

export const listMySkills = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const skills = await candidateService.listMySkills(req.user!.id);
  sendSuccess(res, "Candidate skills retrieved successfully.", skills);
});

export const createMySkill = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const skill = await candidateService.createMySkill(req.user!.id, req.body);
  sendSuccess(res, "Candidate skill created successfully.", skill, 201);
});

export const updateMySkill = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const skill = await candidateService.updateMySkill(
    req.user!.id,
    req.params.skillId as string,
    req.body
  );
  sendSuccess(res, "Candidate skill updated successfully.", skill);
});

export const deleteMySkill = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const deletedSkill = await candidateService.deleteMySkill(
    req.user!.id,
    req.params.skillId as string
  );
  sendSuccess(res, "Candidate skill deleted successfully.", deletedSkill);
});
