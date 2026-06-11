import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import * as candidateCvService from "./candidateCv.service";

export const uploadMyCv = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const document = await candidateCvService.uploadMyCv(
    req.user!.id,
    req.user!.role,
    req.file!
  );

  sendSuccess(res, "CV uploaded and queued for parsing successfully.", document, 201);
});

export const listMyCv = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const documents = await candidateCvService.listMyCv(req.user!.id);

  sendSuccess(res, "CV documents retrieved successfully.", documents);
});

export const getMyCvById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const document = await candidateCvService.getMyCvById(
    req.user!.id,
    req.params.cvId as string
  );

  sendSuccess(res, "CV document retrieved successfully.", document);
});

export const deleteMyCv = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const deletedDocument = await candidateCvService.deleteMyCv(
    req.user!.id,
    req.user!.role,
    req.params.cvId as string
  );

  sendSuccess(res, "CV document deleted successfully.", deletedDocument);
});
