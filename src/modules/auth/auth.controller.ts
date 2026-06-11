import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import * as authService from "./auth.service";

export const registerCandidate = asyncHandler(async (req, res) => {
  const result = await authService.registerCandidate(req.body);

  sendSuccess(res, "Candidate registered successfully.", result, 201);
});

export const registerRecruiter = asyncHandler(async (req, res) => {
  const result = await authService.registerRecruiter(req.body);

  sendSuccess(res, "Recruiter registered successfully. Company verification is pending.", result, 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  sendSuccess(res, "Login successful.", result);
});

export const me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.id);

  sendSuccess(res, "Authenticated user retrieved successfully.", user);
});
