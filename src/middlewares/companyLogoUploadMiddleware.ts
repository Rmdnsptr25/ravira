import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../utils/appError";

const MAX_LOGO_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const allowedExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const allowedMimeTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

let cachedUploadMiddleware: RequestHandler | null = null;

const getLogoUpload = async (): Promise<RequestHandler> => {
  if (cachedUploadMiddleware) {
    return cachedUploadMiddleware;
  }

  const [{ default: multer }, path] = await Promise.all([
    import("multer"),
    import("path")
  ]);

  cachedUploadMiddleware = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      if (!allowedExtensions.has(extension) || !allowedMimeTypes.has(file.mimetype)) {
        return callback(new AppError("Only PNG, JPG, JPEG, or WEBP logo images are allowed.", 400));
      }
      return callback(null, true);
    },
    limits: {
      fileSize: MAX_LOGO_FILE_SIZE_BYTES,
      files: 1
    }
  }).single("logo");

  return cachedUploadMiddleware;
};

export const companyLogoUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  void getLogoUpload()
    .then((upload) => {
      upload(req, res, (error: unknown) => {
        if (error && typeof error === "object" && "code" in error) {
          const code = (error as { code?: string }).code;
          if (code === "LIMIT_FILE_SIZE") {
            return next(new AppError("Company logo file size must not exceed 2MB.", 400));
          }
          if (code === "LIMIT_UNEXPECTED_FILE") {
            return next(new AppError("Upload field must be named logo.", 400));
          }
        }

        if (error) {
          return next(error);
        }

        if (!req.file) {
          return next(new AppError("Company logo file is required.", 400));
        }

        return next();
      });
    })
    .catch(next);
};
