import { JobStatus, Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { z } from "zod";
import { jobSearchQuerySchema } from "./jobs.validation";

type JobSearchQuery = z.infer<typeof jobSearchQuerySchema>;

const publicJobSelect = {
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
  company: {
    select: {
      id: true,
      name: true,
      industry: true,
      location: true
    }
  },
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

const buildPublishedJobWhere = (query: JobSearchQuery = {}): Prisma.JobWhereInput => {
  const andFilters: Prisma.JobWhereInput[] = [];

  if (query.keyword) {
    andFilters.push({
      OR: [
        { title: { contains: query.keyword, mode: "insensitive" } },
        { description: { contains: query.keyword, mode: "insensitive" } },
        { company: { name: { contains: query.keyword, mode: "insensitive" } } }
      ]
    });
  }

  if (query.location) {
    andFilters.push({ location: { contains: query.location, mode: "insensitive" } });
  }

  if (query.jobType) {
    andFilters.push({ jobType: { contains: query.jobType, mode: "insensitive" } });
  }

  if (query.workType) {
    andFilters.push({ workType: { contains: query.workType, mode: "insensitive" } });
  }

  if (query.skill) {
    andFilters.push({
      skills: {
        some: {
          skillName: { contains: query.skill, mode: "insensitive" }
        }
      }
    });
  }

  return {
    status: JobStatus.PUBLISHED,
    AND: andFilters
  };
};

export const listPublishedJobs = async (query: JobSearchQuery = {}) => {
  return prisma.job.findMany({
    where: buildPublishedJobWhere(query),
    select: publicJobSelect,
    orderBy: { createdAt: "desc" }
  });
};

export const getPublishedJobById = async (jobId: string) => {
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      status: JobStatus.PUBLISHED
    },
    select: publicJobSelect
  });

  if (!job) {
    throw new AppError("Published job not found.", 404);
  }

  return job;
};
