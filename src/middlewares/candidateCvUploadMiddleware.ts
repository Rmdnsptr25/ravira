import { randomUUID } from "crypto";
import fs from "fs";
import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { AppError } from "../utils/appError";

export const CV_UPLOAD_DIR = path.join(process.cwd(), "uploads", "cv");
const MAX_CV_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const allowedExtensions = new Set([".pdf", ".docx"]);
const allowedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

const ensureUploadDir = () => {
  fs.mkdirSync(CV_UPLOAD_DIR, { recursive: true });
};

ensureUploadDir();

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    ensureUploadDir();
    callback(null, CV_UPLOAD_DIR);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  }
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const isAllowedExtension = allowedExtensions.has(extension);
  const isAllowedMimeType = allowedMimeTypes.has(file.mimetype);

  if (!isAllowedExtension || !isAllowedMimeType) {
    return callback(new AppError("Only PDF or DOCX CV files are allowed.", 400));
  }

  return callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_CV_FILE_SIZE_BYTES,
    files: 1
  }
}).single("cv");

export const candidateCvUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return next(new AppError("CV file size must not exceed 5MB.", 400));
      }

      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return next(new AppError("Upload field must be named cv.", 400));
      }

      return next(new AppError(error.message, 400));
    }

    if (error) {
      return next(error);
    }

    if (!req.file) {
      return next(new AppError("CV file is required.", 400));
    }

    return next();
  });
};
