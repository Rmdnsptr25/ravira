import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../utils/appError";

export const validateBody =
  (schema: z.ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      const message = parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
        .join("; ");

      return next(new AppError(message, 400));
    }

    req.body = parsed.data;
    return next();
  };

export const validateParams =
  (schema: z.ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);

    if (!parsed.success) {
      const message = parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "params"}: ${issue.message}`)
        .join("; ");

      return next(new AppError(message, 400));
    }

    req.params = parsed.data as Record<string, string>;
    return next();
  };

export const validateQuery =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);

    if (!parsed.success) {
      const message = parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "query"}: ${issue.message}`)
        .join("; ");

      return next(new AppError(message, 400));
    }

    res.locals.validatedQuery = parsed.data;
    return next();
  };
