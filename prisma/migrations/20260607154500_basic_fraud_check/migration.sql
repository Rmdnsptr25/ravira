-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'FraudRiskLevel') THEN
    CREATE TYPE "FraudRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
  END IF;
END $$;

-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'FraudReviewStatus') THEN
    CREATE TYPE "FraudReviewStatus" AS ENUM (
      'OPEN',
      'IN_REVIEW',
      'NEED_VERIFICATION',
      'VALID',
      'FALSE_POSITIVE',
      'MERGED',
      'BLOCKED',
      'RESOLVED'
    );
  END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "fraud_cases" (
  "id" UUID NOT NULL,
  "candidate_id" UUID NOT NULL,
  "risk_score" INTEGER NOT NULL,
  "risk_level" "FraudRiskLevel" NOT NULL,
  "review_status" "FraudReviewStatus" NOT NULL DEFAULT 'OPEN',
  "reviewer_id" UUID,
  "decision" "FraudReviewStatus",
  "reason" TEXT,
  "decided_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "fraud_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "fraud_signals" (
  "id" UUID NOT NULL,
  "candidate_id" UUID NOT NULL,
  "case_id" UUID,
  "signal_type" TEXT NOT NULL,
  "risk_level" "FraudRiskLevel" NOT NULL,
  "evidence_hash" TEXT,
  "evidence_masked" TEXT,
  "status" "FraudReviewStatus" NOT NULL DEFAULT 'OPEN',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "fraud_signals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "fraud_cases_candidate_id_idx" ON "fraud_cases"("candidate_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "fraud_cases_risk_level_idx" ON "fraud_cases"("risk_level");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "fraud_cases_review_status_idx" ON "fraud_cases"("review_status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "fraud_cases_reviewer_id_idx" ON "fraud_cases"("reviewer_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "fraud_signals_candidate_id_idx" ON "fraud_signals"("candidate_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "fraud_signals_case_id_idx" ON "fraud_signals"("case_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "fraud_signals_risk_level_idx" ON "fraud_signals"("risk_level");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "fraud_signals_status_idx" ON "fraud_signals"("status");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fraud_cases_candidate_id_fkey') THEN
    ALTER TABLE "fraud_cases"
      ADD CONSTRAINT "fraud_cases_candidate_id_fkey"
      FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fraud_cases_reviewer_id_fkey') THEN
    ALTER TABLE "fraud_cases"
      ADD CONSTRAINT "fraud_cases_reviewer_id_fkey"
      FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fraud_signals_candidate_id_fkey') THEN
    ALTER TABLE "fraud_signals"
      ADD CONSTRAINT "fraud_signals_candidate_id_fkey"
      FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fraud_signals_case_id_fkey') THEN
    ALTER TABLE "fraud_signals"
      ADD CONSTRAINT "fraud_signals_case_id_fkey"
      FOREIGN KEY ("case_id") REFERENCES "fraud_cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
