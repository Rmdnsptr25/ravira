import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import * as recruiterCompanyService from "./recruiterCompany.service";

export const getRecruiterCompanyProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const company = await recruiterCompanyService.getRecruiterCompany(req.user!.id);
    sendSuccess(res, "Company profile retrieved successfully.", company);
  }
);

export const updateRecruiterCompanyProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const updatedCompany = await recruiterCompanyService.updateRecruiterCompany(
      req.user!.id,
      req.body
    );
    sendSuccess(res, "Company profile updated successfully.", updatedCompany);
  }
);
