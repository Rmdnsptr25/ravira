-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CvParsingStatus') THEN
    CREATE TYPE "CvParsingStatus" AS ENUM (
      'PENDING',
      'SUCCESS',
      'FAILED',
      'NEED_REVIEW'
    );
  END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "candidate_documents" (
  "id" UUID NOT NULL,
  "candidate_id" UUID NOT NULL,
  "file_name" TEXT NOT NULL,
  "file_type" TEXT NOT NULL,
  "file_size" INTEGER NOT NULL,
  "storage_path" TEXT NOT NULL,
  "parsing_status" "CvParsingStatus" NOT NULL DEFAULT 'PENDING',
  "parsed_text" TEXT,
  "extracted_skills" JSONB,
  "extracted_education" JSONB,
  "extracted_experience" JSONB,
  "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "parsed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "candidate_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "candidate_documents_candidate_id_idx" ON "candidate_documents"("candidate_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "candidate_documents_parsing_status_idx" ON "candidate_documents"("parsing_status");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'candidate_documents_candidate_id_fkey'
  ) THEN
    ALTER TABLE "candidate_documents"
      ADD CONSTRAINT "candidate_documents_candidate_id_fkey"
      FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
