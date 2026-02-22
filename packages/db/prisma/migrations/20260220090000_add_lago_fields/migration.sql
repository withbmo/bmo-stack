-- Add Lago identifiers to users
ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "lago_customer_id" TEXT;

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "lago_wallet_id" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "users_lago_customer_id_key" ON "users"("lago_customer_id");
CREATE UNIQUE INDEX IF NOT EXISTS "users_lago_wallet_id_key" ON "users"("lago_wallet_id");

-- Add Lago webhook idempotency table
CREATE TABLE IF NOT EXISTS "lago_webhook_events" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "user_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "lago_webhook_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "lago_webhook_events_user_id_idx" ON "lago_webhook_events"("user_id");

DO $$
BEGIN
  ALTER TABLE "lago_webhook_events"
  ADD CONSTRAINT "lago_webhook_events_user_id_fkey"
  FOREIGN KEY ("user_id")
  REFERENCES "users"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;
