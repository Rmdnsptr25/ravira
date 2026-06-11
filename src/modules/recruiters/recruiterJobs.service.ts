import { CompanyVerificationStatus, JobStatus, Prisma, Role } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { createAuditLog } from "../audit-logs/auditLog.service";
import { z } from "zod";
import {
  createRecruiterJobSchema,
  updateRecruiterJobSchema
} from "./recruiterJobs.validation";

type CreateRecruiterJobInput = z.infer<typeof createRecruiterJobSchema>;
type UpdateRecruiterJobInput = z.infer<typeof updateRecruiterJobSchema>;

const jobSelect = {
  id: true,
  title: true,
  description: true,
  location: true,
  jobType: true,
  workType: true,
  employmentType: true,
  salaryMin: true,
  salaryMax: true,
  status: true,
  companyId: true,
  createdByRecruiterId: true,
  skills: {
    select: {
      id: true,
      skillName: true,
      required: true,
      weight: true
    },
    orderBy: { createdAt: "asc" }
  },
  createdAt: true,
  updatedAt: true
} satisfies Prisma.JobSelect;

const getRecruiterContext = async (userId: string) => {
  const recruiter = await prisma.recruiter.findUnique({
    where: { userId },
    select: {
      id: true,
      companyId: true,
      company: {
        select: {
          id: true,
          verificationStatus: true
        }
      }
    }
  });

  if (!recruiter) {
    throw new AppError("Recruiter profile not found.", 404);
  }

  return recruiter;
};

const assertCompanyApproved = (verificationStatus: CompanyVerificationStatus) => {
  if (verificationStatus !== CompanyVerificationStatus.APPROVED) {
    throw new AppError(
      `Company verificationStatus is ${verificationStatus}. Recruiters can create jobs only after company approval.`,
      403
    );
  }
};

const buildJobUpdateData = (input: UpdateRecruiterJobInput): Prisma.JobUpdateInput => {
  const data: Prisma.JobUpdateInput = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.location !== undefined) data.location = input.location;
  if (input.jobType !== undefined) data.jobType = input.jobType;
  if (input.workType !== undefined) data.workType = input.workType;
  if (input.employmentType !== undefined) data.employmentType = input.employmentType;
  if (input.salaryMin !== undefined) data.salaryMin = input.salaryMin;
  if (input.salaryMax !== undefined) data.salaryMax = input.salaryMax;
  if (input.status !== undefined) data.status = input.status;

  return data;
};

export const createRecruiterJob = async (
  userId: string,
  actorRole: Role,
  input: CreateRecruiterJobInput
) => {
  const recruiter = await getRecruiterContext(userId);
  assertCompanyApproved(recruiter.company.verificationStatus);

  return prisma.$transaction(async (tx) => {
    const job = await tx.job.create({
      data: {
        companyId: recruiter.companyId,
        createdByRecruiterId: recruiter.id,
        title: input.title,
        description: input.description,
        location: input.location,
        jobType: input.jobType,
        workType: input.workType,
        employmentType: input.employmentType,
        salaryMin: input.salaryMin,
        salaryMax: input.salaryMax,
        status: input.status ?? JobStatus.PUBLISHED,
        skills: {
          create:
            input.jobSkills?.map((skill) => ({
              skillName: skill.skillName,
              required: skill.required ?? true,
              weight: skill.weight ?? 1
            })) ?? []
        }
      },
      select: jobSelect
    });

    await createAuditLog(
      {
        actorUserId: userId,
        actorRole,
        action: "JOB_CREATED",
        entityType: "Job",
        entityId: job.id,
        afterValue: job
      },
      tx
    );

    return job;
  });
};

export const listRecruiterJobs = async (userId: string) => {
  const recruiter = await getRecruiterContext(userId);

  return prisma.job.findMany({
    where: { companyId: recruiter.companyId },
    select: jobSelect,
    orderBy: { createdAt: "desc" }
  });
};

export const getRecruiterJob = async (userId: string, jobId: string) => {
  const recruiter = await getRecruiterContext(userId);
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      companyId: recruiter.companyId
    },
    select: jobSelect
  });

  if (!job) {
    throw new AppError("Job not found.", 404);
  }

  return job;
};

export const updateRecruiterJob = async (
  userId: string,
  actorRole: Role,
  jobId: string,
  input: UpdateRecruiterJobInput
) => {
  const recruiter = await getRecruiterContext(userId);

  return prisma.$transaction(async (tx) => {
    const before = await tx.job.findFirst({
      where: { id: jobId, companyId: recruiter.companyId },
      select: jobSelect
    });

    if (!before) {
      throw new AppError("Job not found.", 404);
    }

    if (input.jobSkills !== undefined) {
      await tx.jobSkill.deleteMany({ where: { jobId } });
      await tx.jobSkill.createMany({
        data: input.jobSkills.map((skill) => ({
          jobId,
          skillName: skill.skillName,
          required: skill.required ?? true,
          weight: skill.weight ?? 1
        }))
      });
    }

    const after = await tx.job.update({
      where: { id: jobId },
      data: buildJobUpdateData(input),
      select: jobSelect
    });

    await createAuditLog(
      {
        actorUserId: userId,
        actorRole,
        action: "JOB_UPDATED",
        entityType: "Job",
        entityId: jobId,
        beforeValue: before,
        afterValue: after
      },
      tx
    );

    return after;
  });
};

export const deleteRecruiterJob = async (
  userId: string,
  actorRole: Role,
  jobId: string
) => {
  const recruiter = await getRecruiterContext(userId);

  return prisma.$transaction(async (tx) => {
    const before = await tx.job.findFirst({
      where: { id: jobId, companyId: recruiter.companyId },
      select: jobSelect
    });

    if (!before) {
      throw new AppError("Job not found.", 404);
    }

    const after = await tx.job.update({
      where: { id: jobId },
      data: { status: JobStatus.ARCHIVED },
      select: jobSelect
    });

    await createAuditLog(
      {
        actorUserId: userId,
        actorRole,
        action: "JOB_DELETED",
        entityType: "Job",
        entityId: jobId,
        beforeValue: before,
        afterValue: after
      },
      tx
    );

    return after;
  });
};

export const listApplicationsForRecruiterJob = async (userId: string, jobId: string) => {
  const recruiter = await getRecruiterContext(userId);
  const job = await prisma.job.findFirst({
    where: { id: jobId, companyId: recruiter.companyId },
    select: { id: true }
  });

  if (!job) {
    throw new AppError("Job not found.", 404);
  }

  return prisma.application.findMany({
    where: { jobId },
    select: {
      id: true,
      status: true,
      coverLetter: true,
      createdAt: true,
      updatedAt: true,
      candidate: {
        select: {
          id: true,
          location: true,
          education: true,
          experienceSummary: true,
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              phone: true
            }
          },
          skills: {
            select: {
              id: true,
              skillName: true,
              level: true,
              source: true,
              confidenceScore: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
