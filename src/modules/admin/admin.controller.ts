import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import * as adminService from "./admin.service";

export const listPendingCompanies = asyncHandler(async (_req, res) => {
  const companies = await adminService.listPendingCompanies();
  sendSuccess(res, "Pending companies retrieved successfully.", companies);
});

export const approveCompany = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const company = await adminService.approveCompany(
    req.params.companyId as string,
    req.user!.id,
    req.user!.role as "ADMIN" | "SUPER_ADMIN"
  );

  sendSuccess(res, "Company approved successfully.", company);
});

export const rejectCompany = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const company = await adminService.rejectCompany(
    req.params.companyId as string,
    req.body.reason,
    req.user!.id,
    req.user!.role as "ADMIN" | "SUPER_ADMIN"
  );

  sendSuccess(res, "Company rejected successfully.", company);
});
