import { Role } from "@prisma/client";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./appError";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: Role;
}

export const signAccessToken = (payload: AccessTokenPayload) => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.sub !== "string" ||
      typeof decoded.email !== "string" ||
      typeof decoded.role !== "string"
    ) {
      throw new AppError("Invalid authentication token.", 401);
    }

    return {
      sub: decoded.sub,
      email: decoded.email,
      role: decoded.role as Role
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Invalid or expired authentication token.", 401);
  }
};
