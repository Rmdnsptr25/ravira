-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NotificationType') THEN
    CREATE TYPE "NotificationType" AS ENUM (
      'APPLICATION_SUBMITTED',
      'APPLICATION_STATUS_UPDATED',
      'APPEAL_STATUS_UPDATED',
      'SYSTEM'
    );
  END IF;
END $$;

-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NotificationStatus') THEN
    CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ');
  END IF;
END $$;

-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AppealStatus') THEN
    CREATE TYPE "AppealStatus" AS ENUM (
      'OPEN',
      'IN_REVIEW',
      'NEED_INFO',
      'APPROVED',
      'REJECTED',
      'RESOLVED'
    );
  END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "notifications" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "body_safe" TEXT NOT NULL,
  "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
  "read_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "appeals" (
  "id" UUID NOT NULL,
  "candidate_id" UUID NOT NULL,
  "related_entity" TEXT NOT NULL,
  "related_entity_id" TEXT,
  "reason" TEXT NOT NULL,
  "evidence_url" TEXT,
  "status" "AppealStatus" NOT NULL DEFAULT 'OPEN',
  "reviewer_id" UUID,
  "resolved_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "appeals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notifications_user_id_status_idx" ON "notifications"("user_id", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "appeals_candidate_id_idx" ON "appeals"("candidate_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "appeals_reviewer_id_idx" ON "appeals"("reviewer_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "appeals_status_idx" ON "appeals"("status");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'notifications_user_id_fkey'
  ) THEN
    ALTER TABLE "notifications"
      ADD CONSTRAINT "notifications_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'appeals_candidate_id_fkey'
  ) THEN
    ALTER TABLE "appeals"
      ADD CONSTRAINT "appeals_candidate_id_fkey"
      FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'appeals_reviewer_id_fkey'
  ) THEN
    ALTER TABLE "appeals"
      ADD CONSTRAINT "appeals_reviewer_id_fkey"
      FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
