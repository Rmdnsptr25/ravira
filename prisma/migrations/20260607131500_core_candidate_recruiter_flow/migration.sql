-- Align company verification terminology with the API contract.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_enum
    WHERE enumlabel = 'VERIFIED'
      AND enumtypid = '"CompanyVerificationStatus"'::regtype
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_enum
    WHERE enumlabel = 'APPROVED'
      AND enumtypid = '"CompanyVerificationStatus"'::regtype
  ) THEN
    EXECUTE 'ALTER TYPE "CompanyVerificationStatus" RENAME VALUE ''VERIFIED'' TO ''APPROVED''';
  ELSIF NOT EXISTS (
    SELECT 1
    FROM pg_enum
    WHERE enumlabel = 'APPROVED'
      AND enumtypid = '"CompanyVerificationStatus"'::regtype
  ) THEN
    EXECUTE 'ALTER TYPE "CompanyVerificationStatus" ADD VALUE ''APPROVED''';
  END IF;
END $$;

ALTER TABLE "candidates"
  ADD COLUMN IF NOT EXISTS "education" TEXT,
  ADD COLUMN IF NOT EXISTS "experience_summary" TEXT,
  ADD COLUMN IF NOT EXISTS "salary_expectation" INTEGER,
  ADD COLUMN IF NOT EXISTS "mobility_preference" TEXT;

ALTER TABLE "candidate_skills"
  ADD COLUMN IF NOT EXISTS "level" TEXT,
  ADD COLUMN IF NOT EXISTS "confidence_score" DOUBLE PRECISION;

ALTER TABLE "jobs"
  ADD COLUMN IF NOT EXISTS "job_type" TEXT,
  ADD COLUMN IF NOT EXISTS "work_type" TEXT;
