ALTER TABLE "billing_accounts"
ADD COLUMN IF NOT EXISTS "current_credits" INTEGER NOT NULL DEFAULT 0;

DROP TABLE IF EXISTS "billing_credit_grants";
