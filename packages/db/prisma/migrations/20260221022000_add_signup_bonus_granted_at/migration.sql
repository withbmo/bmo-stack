-- Add one-time signup bonus grant marker
ALTER TABLE "users"
ADD COLUMN "signup_bonus_granted_at" TIMESTAMP(3);

-- Backfill existing users so only newly created users after this migration
-- are eligible for the one-time signup credits grant.
UPDATE "users"
SET "signup_bonus_granted_at" = NOW()
WHERE "signup_bonus_granted_at" IS NULL;
