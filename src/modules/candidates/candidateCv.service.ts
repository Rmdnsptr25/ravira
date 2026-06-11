import {
  CvParsingStatus,
  NotificationType,
  Prisma,
  PrismaClient,
  Role
} from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import prisma from "../../config/prisma";
import { CV_UPLOAD_DIR } from "../../middlewares/candidateCvUploadMiddleware";
import { AppError } from "../../utils/appError";
import { createAuditLog } from "../audit-logs/auditLog.service";
import { createNotification } from "../notifications/notifications.service";
import { BasicCvParseResult, parseCvFile } from "./candidateCvParser.service";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

const candidateDocumentSelect = {
  id: true,
  candidateId: true,
  fileName: true,
  fileType: true,
  fileSize: true,
  parsingStatus: true,
  parsedText: true,
  extractedSkills: true,
  extractedEducation: true,
  extractedExperience: true,
  uploadedAt: true,
  parsedAt: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.CandidateDocumentSelect;

const candidateDocumentWithStorageSelect = {
  ...candidateDocumentSelect,
  storagePath: true
} satisfies Prisma.CandidateDocumentSelect;

type CandidateDocumentWithStorage = Prisma.CandidateDocumentGetPayload<{
  select: typeof candidateDocumentWithStorageSelect;
}>;

const getCandidateByUserId = async (userId: string, client: PrismaExecutor = prisma) => {
  const candidate = await client.candidate.findUnique({
    where: { userId },
    select: {
      id: true,
      userId: true
    }
  });

  if (!candidate) {
    throw new AppError("Candidate profile not found.", 404);
  }

  return candidate;
};

const sanitizeOriginalFileName = (fileName: string) => {
  const safeName = path
    .basename(fileName)
    .replace(/[^a-zA-Z0-9._ -]/g, "_")
    .trim();

  return safeName.length > 0 ? safeName.slice(0, 180) : "cv";
};

const toStoragePath = (absolutePath: string) => {
  return path.relative(process.cwd(), absolutePath).replace(/\\/g, "/");
};

const resolveStoragePath = (storagePath: string) => {
  const uploadRoot = path.resolve(CV_UPLOAD_DIR);
  const absolutePath = path.resolve(process.cwd(), storagePath);

  if (absolutePath !== uploadRoot && !absolutePath.startsWith(`${uploadRoot}${path.sep}`)) {
    throw new AppError("Stored CV path is invalid.", 500);
  }

  return absolutePath;
};

const deleteLocalFileByPath = async (absolutePath: string) => {
  try {
    await fs.unlink(absolutePath);
  } catch {
    // Local storage cleanup is best-effort; database ownership remains authoritative.
  }
};

const deleteLocalFileByStoragePath = async (storagePath: string) => {
  await deleteLocalFileByPath(resolveStoragePath(storagePath));
};

const countExtractedSkills = (value: Prisma.JsonValue | null) => {
  return Array.isArray(value) ? value.length : 0;
};

const safeAuditDocument = (document: CandidateDocumentWithStorage) => {
  return {
    id: document.id,
    candidateId: document.candidateId,
    fileName: document.fileName,
    fileType: document.fileType,
    fileSize: document.fileSize,
    parsingStatus: document.parsingStatus,
    extractedSkillsCount: countExtractedSkills(document.extractedSkills),
    uploadedAt: document.uploadedAt,
    parsedAt: document.parsedAt,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt
  };
};

const formatCandidateDocument = (document: CandidateDocumentWithStorage) => {
  const { storagePath: _storagePath, ...publicDocument } = document;
  return publicDocument;
};

const buildParseUpdateData = (parseResult: BasicCvParseResult) => {
  const updateData: Prisma.CandidateDocumentUpdateInput = {
    parsingStatus: parseResult.parsingStatus,
    parsedAt: new Date()
  };

  if (parseResult.parsedText !== undefined) {
    updateData.parsedText = parseResult.parsedText;
  }

  if (parseResult.extractedSkills !== undefined) {
    updateData.extractedSkills = parseResult.extractedSkills as unknown as Prisma.InputJsonValue;
  }

  if (parseResult.extractedEducation !== undefined) {
    updateData.extractedEducation = parseResult.extractedEducation as Prisma.InputJsonValue;
  }

  if (parseResult.extractedExperience !== undefined) {
    updateData.extractedExperience = parseResult.extractedExperience as Prisma.InputJsonValue;
  }

  return updateData;
};

const createParsingNotification = async (
  userId: string,
  parsingStatus: CvParsingStatus,
  client: PrismaExecutor
) => {
  const isSuccess = parsingStatus === CvParsingStatus.SUCCESS;

  await createNotification(
    {
      userId,
      type: NotificationType.SYSTEM,
      title: isSuccess ? "CV berhasil diproses" : "CV perlu ditinjau",
      bodySafe: isSuccess
        ? "CV Anda berhasil diproses. Silakan tinjau skill yang berhasil ditemukan."
        : "CV Anda belum dapat diproses sepenuhnya. Silakan lengkapi profil dan skill secara manual."
    },
    client
  );
};

const applyParseResult = async (
  documentId: string,
  userId: string,
  actorRole: Role,
  parseResult: BasicCvParseResult
) => {
  return prisma.$transaction(async (tx) => {
    const updatedDocument = await tx.candidateDocument.update({
      where: { id: documentId },
      data: buildParseUpdateData(parseResult),
      select: candidateDocumentWithStorageSelect
    });

    if (parseResult.extractedSkills && parseResult.extractedSkills.length > 0) {
      await tx.candidateSkill.createMany({
        data: parseResult.extractedSkills.map((skill) => ({
          candidateId: updatedDocument.candidateId,
          skillName: skill.skillName,
          source: skill.source,
          confidenceScore: skill.confidenceScore
        })),
        skipDuplicates: true
      });
    }

    const auditAction =
      parseResult.parsingStatus === CvParsingStatus.SUCCESS
        ? "CV_PARSED"
        : "CV_PARSE_FAILED";

    await createAuditLog(
      {
        actorUserId: userId,
        actorRole,
        action: auditAction,
        entityType: "CandidateDocument",
        entityId: updatedDocument.id,
        afterValue: safeAuditDocument(updatedDocument),
        reason: parseResult.parsingStatus
      },
      tx
    );

    await createParsingNotification(userId, parseResult.parsingStatus, tx);

    return formatCandidateDocument(updatedDocument);
  });
};

const markParsingFailed = async (
  documentId: string,
  userId: string,
  actorRole: Role
) => {
  return prisma.$transaction(async (tx) => {
    const updatedDocument = await tx.candidateDocument.update({
      where: { id: documentId },
      data: {
        parsingStatus: CvParsingStatus.FAILED,
        parsedAt: new Date()
      },
      select: candidateDocumentWithStorageSelect
    });

    await createAuditLog(
      {
        actorUserId: userId,
        actorRole,
        action: "CV_PARSE_FAILED",
        entityType: "CandidateDocument",
        entityId: updatedDocument.id,
        afterValue: safeAuditDocument(updatedDocument),
        reason: CvParsingStatus.FAILED
      },
      tx
    );

    await createParsingNotification(userId, CvParsingStatus.FAILED, tx);

    return formatCandidateDocument(updatedDocument);
  });
};

export const uploadMyCv = async (
  userId: string,
  actorRole: Role,
  file: Express.Multer.File
) => {
  const storagePath = toStoragePath(file.path);
  let createdDocumentId: string | null = null;

  try {
    const createdDocument = await prisma.$transaction(async (tx) => {
      const candidate = await getCandidateByUserId(userId, tx);
      const document = await tx.candidateDocument.create({
        data: {
          candidateId: candidate.id,
          fileName: sanitizeOriginalFileName(file.originalname),
          fileType: file.mimetype,
          fileSize: file.size,
          storagePath,
          parsingStatus: CvParsingStatus.PENDING
        },
        select: candidateDocumentWithStorageSelect
      });

      await createAuditLog(
        {
          actorUserId: userId,
          actorRole,
          action: "CV_UPLOADED",
          entityType: "CandidateDocument",
          entityId: document.id,
          afterValue: safeAuditDocument(document),
          reason: "Candidate uploaded CV."
        },
        tx
      );

      return document;
    });

    createdDocumentId = createdDocument.id;

    try {
      const parseResult = await parseCvFile(file.path, file.mimetype);
      return applyParseResult(createdDocument.id, userId, actorRole, parseResult);
    } catch {
      return markParsingFailed(createdDocument.id, userId, actorRole);
    }
  } catch (error) {
    if (!createdDocumentId) {
      await deleteLocalFileByPath(file.path);
    }

    throw error;
  }
};

export const listMyCv = async (userId: string) => {
  const candidate = await getCandidateByUserId(userId);

  const documents = await prisma.candidateDocument.findMany({
    where: { candidateId: candidate.id },
    select: candidateDocumentWithStorageSelect,
    orderBy: { uploadedAt: "desc" }
  });

  return documents.map(formatCandidateDocument);
};

export const getMyCvById = async (userId: string, cvId: string) => {
  const candidate = await getCandidateByUserId(userId);
  const document = await prisma.candidateDocument.findFirst({
    where: {
      id: cvId,
      candidateId: candidate.id
    },
    select: candidateDocumentWithStorageSelect
  });

  if (!document) {
    throw new AppError("CV document not found.", 404);
  }

  return formatCandidateDocument(document);
};

export const deleteMyCv = async (
  userId: string,
  actorRole: Role,
  cvId: string
) => {
  const deletedDocument = await prisma.$transaction(async (tx) => {
    const candidate = await getCandidateByUserId(userId, tx);
    const document = await tx.candidateDocument.findFirst({
      where: {
        id: cvId,
        candidateId: candidate.id
      },
      select: candidateDocumentWithStorageSelect
    });

    if (!document) {
      throw new AppError("CV document not found.", 404);
    }

    await tx.candidateDocument.delete({
      where: { id: document.id }
    });

    await createAuditLog(
      {
        actorUserId: userId,
        actorRole,
        action: "CV_DELETED",
        entityType: "CandidateDocument",
        entityId: document.id,
        beforeValue: safeAuditDocument(document),
        reason: "Candidate deleted CV."
      },
      tx
    );

    return document;
  });

  await deleteLocalFileByStoragePath(deletedDocument.storagePath);

  return { id: deletedDocument.id };
};
