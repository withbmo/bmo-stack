-- Move billing runtime to Lago-managed flows and add credit top-up request tracking.

CREATE TABLE IF NOT EXISTS "credit_topup_requests" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "lago_invoice_id" TEXT NOT NULL,
  "amount_usd" INTEGER NOT NULL,
  "credits" INTEGER NOT NULL,
  "status" TEXT NOT NULL,
  "granted_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "credit_topup_requests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "credit_topup_requests_lago_invoice_id_key"
  ON "credit_topup_requests"("lago_invoice_id");

CREATE INDEX IF NOT EXISTS "credit_topup_requests_user_id_status_idx"
  ON "credit_topup_requests"("user_id", "status");

ALTER TABLE "credit_topup_requests"
  ADD CONSTRAINT "credit_topup_requests_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Cleanup old direct integration IDs no longer used by runtime.
DROP INDEX IF EXISTS "users_stripe_customer_id_key";
DROP INDEX IF EXISTS "users_lago_customer_id_key";
DROP INDEX IF EXISTS "users_lago_wallet_id_key";

ALTER TABLE "users" DROP COLUMN IF EXISTS "stripe_customer_id";
ALTER TABLE "users" DROP COLUMN IF EXISTS "lago_customer_id";
ALTER TABLE "users" DROP COLUMN IF EXISTS "lago_wallet_id";
