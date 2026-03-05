ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "current_credits" INTEGER NOT NULL DEFAULT 0;

UPDATE "users" u
SET "current_credits" = COALESCE(b."current_credits", u."current_credits")
FROM "billing_accounts" b
WHERE b."owner_user_id" = u."id";

ALTER TABLE "billing_accounts"
DROP COLUMN IF EXISTS "current_credits";
