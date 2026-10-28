import { CompanyVerificationStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";

export const getRecruiterContext = async (userId: string) => {
  const recruiter = await prisma.recruiter.findUnique({
    where: { userId },
    select: {
      id: true,
      companyId: true,
      company: {
        select: {
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

export const requireApprovedRecruiter = async (userId: string) => {
  const recruiter = await getRecruiterContext(userId);

  if (recruiter.company.verificationStatus !== CompanyVerificationStatus.APPROVED) {
    throw new AppError("Company approval is required to access this resource.", 403);
  }

  return recruiter;
};
