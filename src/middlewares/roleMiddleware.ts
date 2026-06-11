import { Role } from "@prisma/client";
import { NextFunction, Response } from "express";
import { AppError } from "../utils/appError";
import { AuthenticatedRequest } from "./authMiddleware";

export const roleMiddleware =
  (...allowedRoles: Role[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Authentication is required.", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to access this resource.", 403));
    }

    return next();
  };
