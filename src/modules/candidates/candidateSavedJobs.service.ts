import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";

const getCandidateByUserId = async (userId: string) => {
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!candidate) {
    throw new AppError("Candidate profile not found.", 404);
  }

  return candidate;
};

export const listSavedJobs = async (userId: string) => {
  const candidate = await getCandidateByUserId(userId);

  const savedJobs = await prisma.savedJob.findMany({
    where: { candidateId: candidate.id },
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        include: {
          company: {
            select: {
              id: true,
              name: true,
              location: true,
              industry: true,
              verificationStatus: true
            }
          },
          skills: {
            select: {
              id: true,
              skillName: true,
              required: true,
              weight: true
            }
          }
        }
      }
    }
  });

  return savedJobs.map((item) => ({
    id: item.id,
    jobId: item.jobId,
    savedAt: item.createdAt,
    job: {
      id: item.job.id,
      title: item.job.title,
      description: item.job.description,
      location: item.job.location,
      jobType: item.job.jobType,
      workType: item.job.workType,
      employmentType: item.job.employmentType,
      salaryMin: item.job.salaryMin,
      salaryMax: item.job.salaryMax,
      status: item.job.status,
      createdAt: item.job.createdAt,
      company: item.job.company,
      skills: item.job.skills
    }
  }));
};

export const saveJob = async (userId: string, jobId: string) => {
  const candidate = await getCandidateByUserId(userId);

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, title: true, status: true }
  });

  if (!job) {
    throw new AppError("Job not found.", 404);
  }

  const savedJob = await prisma.savedJob.upsert({
    where: {
      candidateId_jobId: {
        candidateId: candidate.id,
        jobId
      }
    },
    create: {
      candidateId: candidate.id,
      jobId
    },
    update: {},
    include: {
      job: {
        include: {
          company: {
            select: {
              id: true,
              name: true,
              location: true,
              industry: true,
              verificationStatus: true
            }
          }
        }
      }
    }
  });

  return {
    id: savedJob.id,
    jobId: savedJob.jobId,
    savedAt: savedJob.createdAt,
    job: {
      id: savedJob.job.id,
      title: savedJob.job.title,
      company: savedJob.job.company
    }
  };
};

export const unsaveJob = async (userId: string, jobId: string) => {
  const candidate = await getCandidateByUserId(userId);

  const result = await prisma.savedJob.deleteMany({
    where: {
      candidateId: candidate.id,
      jobId
    }
  });

  return {
    jobId,
    removed: result.count > 0
  };
};
