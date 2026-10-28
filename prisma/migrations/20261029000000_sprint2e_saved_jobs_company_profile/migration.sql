-- AlterTable
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "size" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "saved_jobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "candidate_id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "saved_jobs_candidate_id_idx" ON "saved_jobs"("candidate_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "saved_jobs_job_id_idx" ON "saved_jobs"("job_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "saved_jobs_candidate_id_job_id_key" ON "saved_jobs"("candidate_id", "job_id");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'saved_jobs_candidate_id_fkey'
  ) THEN
    ALTER TABLE "saved_jobs"
      ADD CONSTRAINT "saved_jobs_candidate_id_fkey"
      FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'saved_jobs_job_id_fkey'
  ) THEN
    ALTER TABLE "saved_jobs"
      ADD CONSTRAINT "saved_jobs_job_id_fkey"
      FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
