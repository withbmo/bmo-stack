-- P0 schema alignment:
-- - Add invoices.invoice_pdf (mapped to Invoice.pdfUrl)
-- - Replace deploy_jobs.status string with DeployJobStatus enum
-- - Change deploy_jobs.current_step from int -> text (nullable)
-- - Make otps.idempotency_key nullable (matches legacy + service behavior)

-- Add pdf URL field for invoices
ALTER TABLE "invoices" ADD COLUMN "invoice_pdf" TEXT;

-- Make OTP idempotency key optional
ALTER TABLE "otps" ALTER COLUMN "idempotency_key" DROP NOT NULL;

-- Deploy job status enum + normalization
CREATE TYPE "DeployJobStatus" AS ENUM ('queued', 'running', 'succeeded', 'failed', 'canceled');

ALTER TABLE "deploy_jobs" ALTER COLUMN "status" DROP DEFAULT;

-- Normalize historic spellings/values before casting
UPDATE "deploy_jobs" SET "status" = 'queued' WHERE "status" = 'pending';
UPDATE "deploy_jobs" SET "status" = 'succeeded' WHERE "status" = 'success';
UPDATE "deploy_jobs" SET "status" = 'canceled' WHERE "status" = 'cancelled';

UPDATE "deploy_jobs"
SET "status" = 'queued'
WHERE "status" NOT IN ('queued', 'running', 'succeeded', 'failed', 'canceled');

ALTER TABLE "deploy_jobs"
  ALTER COLUMN "status" TYPE "DeployJobStatus"
  USING ("status"::text::"DeployJobStatus");

ALTER TABLE "deploy_jobs" ALTER COLUMN "status" SET DEFAULT 'queued';

-- current_step: int -> text, nullable
ALTER TABLE "deploy_jobs" ALTER COLUMN "current_step" DROP DEFAULT;
ALTER TABLE "deploy_jobs" ALTER COLUMN "current_step" DROP NOT NULL;
ALTER TABLE "deploy_jobs"
  ALTER COLUMN "current_step" TYPE TEXT
  USING ("current_step"::text);

