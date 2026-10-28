import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { getRecruiterContext } from "./recruiterAccess.service";

interface UpdateCompanyData {
  name?: string;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  description?: string;
}

export const getRecruiterCompany = async (userId: string) => {
  const recruiter = await getRecruiterContext(userId);

  const company = await prisma.company.findUnique({
    where: { id: recruiter.companyId },
    select: {
      id: true,
      name: true,
      industry: true,
      size: true,
      location: true,
      website: true,
      description: true,
      verificationStatus: true,
      verifiedAt: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!company) {
    throw new AppError("Company profile not found.", 404);
  }

  return company;
};

export const updateRecruiterCompany = async (
  userId: string,
  data: UpdateCompanyData
) => {
  const recruiter = await getRecruiterContext(userId);

  const existingCompany = await prisma.company.findUnique({
    where: { id: recruiter.companyId }
  });

  if (!existingCompany) {
    throw new AppError("Company profile not found.", 404);
  }

  // Explicitly prevent mutating verificationStatus or verifiedA
  const updatePayload: {
    name?: string;
    industry?: string;
    size?: string;
    location?: string;
    website?: string;
    description?: string;
  } = {};

  if (data.name !== undefined) updatePayload.name = data.name;
  if (data.industry !== undefined) updatePayload.industry = data.industry;
  if (data.size !== undefined) updatePayload.size = data.size;
  if (data.location !== undefined) updatePayload.location = data.location;
  if (data.website !== undefined) updatePayload.website = data.website;
  if (data.description !== undefined) updatePayload.description = data.description;

  const updatedCompany = await prisma.company.update({
    where: { id: recruiter.companyId },
    data: updatePayload,
    select: {
      id: true,
      name: true,
      industry: true,
      size: true,
      location: true,
      website: true,
      description: true,
      verificationStatus: true,
      verifiedAt: true,
      createdAt: true,
      updatedAt: true
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: userId,
      actorRole: "RECRUITER",
      action: "UPDATE_COMPANY_PROFILE",
      entity: "Company",
      entityId: recruiter.companyId,
      before: {
        name: existingCompany.name,
        industry: existingCompany.industry,
        size: existingCompany.size,
        location: existingCompany.location,
        website: existingCompany.website,
        description: existingCompany.description
      },
      after: {
        name: updatedCompany.name,
        industry: updatedCompany.industry,
        size: updatedCompany.size,
        location: updatedCompany.location,
        website: updatedCompany.website,
        description: updatedCompany.description
      }
    }
  });

  return updatedCompany;
};
