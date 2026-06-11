import { Prisma, ProfileVisibility, Role } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { runBasicFraudCheckForCandidate } from "../fraud/fraud.service";
import {
  createCandidateSkillSchema,
  updateCandidateProfileSchema,
  updateCandidateSkillSchema
} from "./candidates.validation";
import { z } from "zod";

type UpdateCandidateProfileInput = z.infer<typeof updateCandidateProfileSchema>;
type CreateCandidateSkillInput = z.infer<typeof createCandidateSkillSchema>;
type UpdateCandidateSkillInput = z.infer<typeof updateCandidateSkillSchema>;

const candidateProfileSelect = {
  id: true,
  location: true,
  education: true,
  experienceSummary: true,
  salaryExpectation: true,
  mobilityPreference: true,
  profileVisibility: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true
    }
  }
} satisfies Prisma.CandidateSelect;

type CandidateProfile = Prisma.CandidateGetPayload<{
  select: typeof candidateProfileSelect;
}>;

const formatCandidateProfile = (candidate: CandidateProfile) => ({
  id: candidate.id,
  userId: candidate.user.id,
  email: candidate.user.email,
  fullName: candidate.user.fullName,
  phone: candidate.user.phone,
  location: candidate.location,
  education: candidate.education,
  experienceSummary: candidate.experienceSummary,
  salaryExpectation: candidate.salaryExpectation,
  mobilityPreference: candidate.mobilityPreference,
  visibilityStatus: candidate.profileVisibility,
  createdAt: candidate.createdAt,
  updatedAt: candidate.updatedAt
});

const skillSelect = {
  id: true,
  skillName: true,
  level: true,
  source: true,
  confidenceScore: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.CandidateSkillSelect;

const getCandidateIdByUserId = async (userId: string) => {
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!candidate) {
    throw new AppError("Candidate profile not found.", 404);
  }

  return candidate.id;
};

export const getMyProfile = async (userId: string) => {
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
    select: candidateProfileSelect
  });

  if (!candidate) {
    throw new AppError("Candidate profile not found.", 404);
  }

  return formatCandidateProfile(candidate);
};

export const updateMyProfile = async (
  userId: string,
  input: UpdateCandidateProfileInput
) => {
  const userData: Prisma.UserUpdateInput = {};
  const candidateData: Prisma.CandidateUpdateInput = {};

  if (input.fullName !== undefined) userData.fullName = input.fullName;
  if (input.phone !== undefined) userData.phone = input.phone;
  if (input.location !== undefined) candidateData.location = input.location;
  if (input.education !== undefined) candidateData.education = input.education;
  if (input.experienceSummary !== undefined) {
    candidateData.experienceSummary = input.experienceSummary;
  }
  if (input.salaryExpectation !== undefined) {
    candidateData.salaryExpectation = input.salaryExpectation;
  }
  if (input.mobilityPreference !== undefined) {
    candidateData.mobilityPreference = input.mobilityPreference;
  }
  if (input.visibilityStatus !== undefined) {
    candidateData.profileVisibility = input.visibilityStatus as ProfileVisibility;
  }

  const candidate = await prisma.$transaction(async (tx) => {
    if (Object.keys(userData).length > 0) {
      await tx.user.update({
        where: { id: userId },
        data: userData
      });
    }

    if (Object.keys(candidateData).length > 0) {
      await tx.candidate.update({
        where: { userId },
        data: candidateData
      });
    }

    const updatedCandidate = await tx.candidate.findUnique({
      where: { userId },
      select: candidateProfileSelect
    });

    if (!updatedCandidate) {
      throw new AppError("Candidate profile not found.", 404);
    }

    return updatedCandidate;
  });

  const formattedProfile = formatCandidateProfile(candidate);
  const shouldRunFraudCheck =
    input.fullName !== undefined ||
    input.phone !== undefined ||
    input.location !== undefined;

  if (shouldRunFraudCheck) {
    await runBasicFraudCheckForCandidate({
      candidateId: formattedProfile.id,
      actorUserId: userId,
      actorRole: Role.CANDIDATE,
      trigger: "PROFILE_UPDATE"
    });
  }

  return formattedProfile;
};

export const listMySkills = async (userId: string) => {
  const candidateId = await getCandidateIdByUserId(userId);

  return prisma.candidateSkill.findMany({
    where: { candidateId },
    select: skillSelect,
    orderBy: { createdAt: "desc" }
  });
};

export const createMySkill = async (
  userId: string,
  input: CreateCandidateSkillInput
) => {
  const candidateId = await getCandidateIdByUserId(userId);

  return prisma.candidateSkill.create({
    data: {
      candidateId,
      skillName: input.skillName,
      level: input.level,
      source: input.source,
      confidenceScore: input.confidenceScore
    },
    select: skillSelect
  });
};

export const updateMySkill = async (
  userId: string,
  skillId: string,
  input: UpdateCandidateSkillInput
) => {
  const candidateId = await getCandidateIdByUserId(userId);
  const existingSkill = await prisma.candidateSkill.findFirst({
    where: { id: skillId, candidateId },
    select: { id: true }
  });

  if (!existingSkill) {
    throw new AppError("Candidate skill not found.", 404);
  }

  return prisma.candidateSkill.update({
    where: { id: skillId },
    data: input,
    select: skillSelect
  });
};

export const deleteMySkill = async (userId: string, skillId: string) => {
  const candidateId = await getCandidateIdByUserId(userId);
  const existingSkill = await prisma.candidateSkill.findFirst({
    where: { id: skillId, candidateId },
    select: { id: true }
  });

  if (!existingSkill) {
    throw new AppError("Candidate skill not found.", 404);
  }

  await prisma.candidateSkill.delete({
    where: { id: skillId }
  });

  return { id: skillId };
};
