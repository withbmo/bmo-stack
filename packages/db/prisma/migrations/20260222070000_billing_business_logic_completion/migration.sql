-- Billing business logic completion: subscription access state, top-up idempotency,
-- and credit ledger audit trail.

ALTER TABLE "subscriptions"
  ADD COLUMN IF NOT EXISTS "billing_interval" TEXT NOT NULL DEFAULT 'month',
  ADD COLUMN IF NOT EXISTS "feature_access_state" TEXT NOT NULL DEFAULT 'enabled';

ALTER TABLE "credit_topup_requests"
  ADD COLUMN IF NOT EXISTS "processed_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "failure_code" TEXT,
  ADD COLUMN IF NOT EXISTS "idempotency_key" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "credit_topup_requests_idempotency_key_key"
  ON "credit_topup_requests" ("idempotency_key");

CREATE TABLE IF NOT EXISTS "credit_ledger_entries" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "delta_credits" INTEGER NOT NULL,
  "balance_after" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "reference_id" TEXT,
  "reason_code" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "credit_ledger_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "credit_ledger_entries_user_id_created_at_idx"
  ON "credit_ledger_entries" ("user_id", "created_at");

CREATE INDEX IF NOT EXISTS "credit_ledger_entries_type_reference_id_idx"
  ON "credit_ledger_entries" ("type", "reference_id");

ALTER TABLE "credit_ledger_entries"
  ADD CONSTRAINT "credit_ledger_entries_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
