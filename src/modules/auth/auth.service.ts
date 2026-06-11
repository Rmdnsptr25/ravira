import {
  CompanyVerificationStatus,
  ConsentStatus,
  ConsentType,
  Prisma,
  Role
} from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { comparePassword, hashPassword } from "../../utils/password";
import { signAccessToken } from "../../utils/jwt";
import { runBasicFraudCheckForCandidate } from "../fraud/fraud.service";
import {
  LoginInput,
  RegisterCandidateInput,
  RegisterRecruiterInput
} from "./auth.types";

const authUserSelect = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  role: true,
  isActive: true,
  candidate: {
    select: {
      id: true,
      headline: true,
      location: true,
      profileVisibility: true,
      createdAt: true,
      updatedAt: true
    }
  },
  recruiter: {
    select: {
      id: true,
      position: true,
      company: {
        select: {
          id: true,
          name: true,
          industry: true,
          location: true,
          website: true,
          verificationStatus: true
        }
      },
      createdAt: true,
      updatedAt: true
    }
  },
  createdAt: true,
  updatedAt: true
} satisfies Prisma.UserSelect;

const authUserWithPasswordSelect = {
  ...authUserSelect,
  passwordHash: true
} satisfies Prisma.UserSelect;

type AuthUser = Prisma.UserGetPayload<{ select: typeof authUserSelect }>;
type AuthUserWithPassword = Prisma.UserGetPayload<{
  select: typeof authUserWithPasswordSelect;
}>;

const createToken = (user: Pick<AuthUser, "id" | "email" | "role">) => {
  return signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role
  });
};

const withoutPassword = (user: AuthUserWithPassword): AuthUser => {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
};

const assertEmailAvailable = async (email: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });

  if (existingUser) {
    throw new AppError("Email is already registered.", 409);
  }
};

export const registerCandidate = async (input: RegisterCandidateInput) => {
  await assertEmailAvailable(input.email);
  const passwordHash = await hashPassword(input.password);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email: input.email,
        passwordHash,
        fullName: input.name,
        phone: input.phone,
        role: Role.CANDIDATE
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    const candidate = await tx.candidate.create({
      data: {
        userId: createdUser.id,
        location: input.location
      },
      select: {
        id: true
      }
    });

    await tx.consent.create({
      data: {
        userId: createdUser.id,
        type: ConsentType.PROFILE_PROCESSING,
        status: ConsentStatus.GRANTED,
        source: "registration"
      }
    });

    await tx.auditLog.create({
      data: {
        actorId: createdUser.id,
        actorRole: createdUser.role,
        action: "AUTH_REGISTER_CANDIDATE",
        entity: "User",
        entityId: createdUser.id,
        after: {
          role: createdUser.role,
          candidateId: candidate.id,
          consentType: ConsentType.PROFILE_PROCESSING
        }
      }
    });

    await runBasicFraudCheckForCandidate(
      {
        candidateId: candidate.id,
        actorUserId: createdUser.id,
        actorRole: createdUser.role,
        trigger: "REGISTER_CANDIDATE"
      },
      tx
    );

    const registeredUser = await tx.user.findUnique({
      where: { id: createdUser.id },
      select: authUserSelect
    });

    if (!registeredUser) {
      throw new AppError("Candidate registration failed.", 500);
    }

    return registeredUser;
  }, {
    maxWait: 10000,
    timeout: 15000
  });

  return {
    token: createToken(user),
    user
  };
};

export const registerRecruiter = async (input: RegisterRecruiterInput) => {
  await assertEmailAvailable(input.email);
  const passwordHash = await hashPassword(input.password);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email: input.email,
        passwordHash,
        fullName: input.name,
        phone: input.phone,
        role: Role.RECRUITER
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    const company = await tx.company.create({
      data: {
        name: input.companyName,
        industry: input.industry,
        location: input.location,
        website: input.companyWebsite,
        verificationStatus: CompanyVerificationStatus.PENDING
      },
      select: {
        id: true,
        verificationStatus: true
      }
    });

    const recruiter = await tx.recruiter.create({
      data: {
        userId: createdUser.id,
        companyId: company.id,
        position: input.position
      },
      select: {
        id: true
      }
    });

    await tx.auditLog.create({
      data: {
        actorId: createdUser.id,
        actorRole: createdUser.role,
        action: "AUTH_REGISTER_RECRUITER",
        entity: "User",
        entityId: createdUser.id,
        after: {
          role: createdUser.role,
          recruiterId: recruiter.id,
          companyId: company.id,
          verificationStatus: company.verificationStatus
        }
      }
    });

    const registeredUser = await tx.user.findUnique({
      where: { id: createdUser.id },
      select: authUserSelect
    });

    if (!registeredUser) {
      throw new AppError("Recruiter registration failed.", 500);
    }

    return registeredUser;
  });

  return {
    token: createToken(user),
    user
  };
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: authUserWithPasswordSelect
  });

  if (!user || !user.isActive) {
    throw new AppError("Invalid email or password.", 401);
  }

  const passwordMatches = await comparePassword(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password.", 401);
  }

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorRole: user.role,
      action: "AUTH_LOGIN",
      entity: "User",
      entityId: user.id
    }
  });

  const publicUser = withoutPassword(user);

  return {
    token: createToken(publicUser),
    user: publicUser
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: authUserSelect
  });

  if (!user || !user.isActive) {
    throw new AppError("User not found.", 404);
  }

  return user;
};
