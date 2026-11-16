import dotenv from "dotenv";

dotenv.config({ quiet: true });

const nodeEnv = process.env.NODE_ENV ?? "development";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://postgres:postgres@localhost:5432/ravira?schema=public";
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required. Set JWT_SECRET in the environment before starting Ravira backend.");
}

export const env = {
  NODE_ENV: nodeEnv,
  PORT: Number(process.env.PORT ?? 4000),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "*",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "",
  GEMINI_MODEL: process.env.GEMINI_MODEL ?? "gemini-3.8-flash",
  SUPABASE_URL: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY ?? "",
  SUPABASE_IMAGE_BUCKET: process.env.SUPABASE_IMAGE_BUCKET ?? "image",
  SUPABASE_DOC_BUCKET: process.env.SUPABASE_DOC_BUCKET ?? "cv"
};
