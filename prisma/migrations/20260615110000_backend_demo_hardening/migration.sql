ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'SHORTLISTED';
ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'OFFERED';
ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'WITHDRAWN';

ALTER TYPE "CvParsingStatus" ADD VALUE IF NOT EXISTS 'PROCESSING';
ALTER TYPE "CvParsingStatus" ADD VALUE IF NOT EXISTS 'COMPLETED';

DO $$ BEGIN
  CREATE TYPE "JobModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "CvReviewStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'EDITED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "CvScanStatus" AS ENUM ('PENDING', 'CLEAN', 'FAILED', 'SKIPPED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "provinces" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "provinces_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "provinces_code_key" ON "provinces"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "provinces_name_key" ON "provinces"("name");

CREATE TABLE IF NOT EXISTS "cities" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "province_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "cities_province_id_name_key" ON "cities"("province_id", "name");
CREATE INDEX IF NOT EXISTS "cities_province_id_idx" ON "cities"("province_id");

DO $$ BEGIN
  ALTER TABLE "cities"
    ADD CONSTRAINT "cities_province_id_fkey"
    FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "candidates" ADD COLUMN IF NOT EXISTS "province_id" UUID;
ALTER TABLE "candidates" ADD COLUMN IF NOT EXISTS "city_id" UUID;
CREATE INDEX IF NOT EXISTS "candidates_province_id_idx" ON "candidates"("province_id");
CREATE INDEX IF NOT EXISTS "candidates_city_id_idx" ON "candidates"("city_id");

DO $$ BEGIN
  ALTER TABLE "candidates"
    ADD CONSTRAINT "candidates_province_id_fkey"
    FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "candidates"
    ADD CONSTRAINT "candidates_city_id_fkey"
    FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "candidate_documents" ADD COLUMN IF NOT EXISTS "storage_provider" TEXT NOT NULL DEFAULT 'local';
ALTER TABLE "candidate_documents" ADD COLUMN IF NOT EXISTS "storage_key" TEXT;
ALTER TABLE "candidate_documents" ADD COLUMN IF NOT EXISTS "checksum" TEXT;
ALTER TABLE "candidate_documents" ADD COLUMN IF NOT EXISTS "scan_status" "CvScanStatus" NOT NULL DEFAULT 'SKIPPED';
ALTER TABLE "candidate_documents" ADD COLUMN IF NOT EXISTS "parsed_text_masked" TEXT;
ALTER TABLE "candidate_documents" ADD COLUMN IF NOT EXISTS "review_status" "CvReviewStatus" NOT NULL DEFAULT 'PENDING_REVIEW';
ALTER TABLE "candidate_documents" ADD COLUMN IF NOT EXISTS "reviewed_skills" JSONB;
ALTER TABLE "candidate_documents" ADD COLUMN IF NOT EXISTS "reviewed_at" TIMESTAMP(3);
ALTER TABLE "candidate_documents" ADD COLUMN IF NOT EXISTS "retention_until" TIMESTAMP(3);

ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "province_id" UUID;
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "city_id" UUID;
CREATE INDEX IF NOT EXISTS "companies_province_id_idx" ON "companies"("province_id");
CREATE INDEX IF NOT EXISTS "companies_city_id_idx" ON "companies"("city_id");

DO $$ BEGIN
  ALTER TABLE "companies"
    ADD CONSTRAINT "companies_province_id_fkey"
    FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "companies"
    ADD CONSTRAINT "companies_city_id_fkey"
    FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "province_id" UUID;
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "city_id" UUID;
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "moderation_status" "JobModerationStatus" NOT NULL DEFAULT 'APPROVED';
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "moderated_by_id" UUID;
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "moderated_at" TIMESTAMP(3);
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "moderation_reason" TEXT;
CREATE INDEX IF NOT EXISTS "jobs_status_moderation_status_idx" ON "jobs"("status", "moderation_status");
CREATE INDEX IF NOT EXISTS "jobs_province_id_idx" ON "jobs"("province_id");
CREATE INDEX IF NOT EXISTS "jobs_city_id_idx" ON "jobs"("city_id");

DO $$ BEGIN
  ALTER TABLE "jobs"
    ADD CONSTRAINT "jobs_province_id_fkey"
    FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "jobs"
    ADD CONSTRAINT "jobs_city_id_fkey"
    FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "manual_review_required" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "current_stage_locked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "reviewed_by_id" UUID;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "reviewed_at" TIMESTAMP(3);
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "decision_reason" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "withdrawn_at" TIMESTAMP(3);
CREATE INDEX IF NOT EXISTS "applications_job_id_status_idx" ON "applications"("job_id", "status");
CREATE INDEX IF NOT EXISTS "applications_candidate_id_status_idx" ON "applications"("candidate_id", "status");

ALTER TABLE "match_scores" ADD COLUMN IF NOT EXISTS "model_version" TEXT NOT NULL DEFAULT 'rule-based-mvp';
ALTER TABLE "match_scores" ADD COLUMN IF NOT EXISTS "input_snapshot" JSONB;

ALTER TABLE "candidate_scores" ADD COLUMN IF NOT EXISTS "model_version" TEXT NOT NULL DEFAULT 'rule-based-mvp';
ALTER TABLE "candidate_scores" ADD COLUMN IF NOT EXISTS "input_snapshot" JSONB;

ALTER TABLE "consents" ADD COLUMN IF NOT EXISTS "scope" TEXT;
ALTER TABLE "consents" ADD COLUMN IF NOT EXISTS "purpose" TEXT;
ALTER TABLE "consents" ADD COLUMN IF NOT EXISTS "recipient_type" TEXT;
ALTER TABLE "consents" ADD COLUMN IF NOT EXISTS "recipient_id" TEXT;
ALTER TABLE "consents" ADD COLUMN IF NOT EXISTS "legal_basis" TEXT;
ALTER TABLE "consents" ADD COLUMN IF NOT EXISTS "version" TEXT NOT NULL DEFAULT 'v1';
ALTER TABLE "consents" ADD COLUMN IF NOT EXISTS "expires_at" TIMESTAMP(3);

ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "request_id" TEXT;
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "correlation_id" TEXT;
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "severity" TEXT NOT NULL DEFAULT 'INFO';
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "data_scope" TEXT;
CREATE INDEX IF NOT EXISTS "audit_logs_created_at_idx" ON "audit_logs"("created_at");
CREATE INDEX IF NOT EXISTS "audit_logs_correlation_id_idx" ON "audit_logs"("correlation_id");

CREATE TABLE IF NOT EXISTS "scoring_rule_versions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "version" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "config" JSONB NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "scoring_rule_versions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "scoring_rule_versions_version_key" ON "scoring_rule_versions"("version");
CREATE INDEX IF NOT EXISTS "scoring_rule_versions_is_active_idx" ON "scoring_rule_versions"("is_active");
