-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TrainingStatus') THEN
    CREATE TYPE "TrainingStatus" AS ENUM (
      'NOT_STARTED',
      'IN_PROGRESS',
      'COMPLETED'
    );
  END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "skill_gap_reports" (
  "id" UUID NOT NULL,
  "candidate_id" UUID NOT NULL,
  "job_id" UUID,
  "target_role" TEXT,
  "owned_skills" JSONB NOT NULL,
  "missing_skills" JSONB NOT NULL,
  "matched_skills" JSONB NOT NULL,
  "priority_skills" JSONB NOT NULL,
  "summary" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "skill_gap_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "courses" (
  "id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "skill_targets" JSONB NOT NULL,
  "duration" TEXT NOT NULL,
  "price" INTEGER,
  "difficulty" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "training_progress" (
  "id" UUID NOT NULL,
  "candidate_id" UUID NOT NULL,
  "course_id" UUID NOT NULL,
  "status" "TrainingStatus" NOT NULL DEFAULT 'NOT_STARTED',
  "progress_pct" INTEGER NOT NULL DEFAULT 0,
  "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "training_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "skill_gap_reports_candidate_id_idx" ON "skill_gap_reports"("candidate_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "skill_gap_reports_job_id_idx" ON "skill_gap_reports"("job_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "training_progress_candidate_id_course_id_key" ON "training_progress"("candidate_id", "course_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "training_progress_candidate_id_idx" ON "training_progress"("candidate_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "training_progress_course_id_idx" ON "training_progress"("course_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "training_progress_status_idx" ON "training_progress"("status");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'skill_gap_reports_candidate_id_fkey'
  ) THEN
    ALTER TABLE "skill_gap_reports"
      ADD CONSTRAINT "skill_gap_reports_candidate_id_fkey"
      FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'skill_gap_reports_job_id_fkey'
  ) THEN
    ALTER TABLE "skill_gap_reports"
      ADD CONSTRAINT "skill_gap_reports_job_id_fkey"
      FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'training_progress_candidate_id_fkey'
  ) THEN
    ALTER TABLE "training_progress"
      ADD CONSTRAINT "training_progress_candidate_id_fkey"
      FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'training_progress_course_id_fkey'
  ) THEN
    ALTER TABLE "training_progress"
      ADD CONSTRAINT "training_progress_course_id_fkey"
      FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
