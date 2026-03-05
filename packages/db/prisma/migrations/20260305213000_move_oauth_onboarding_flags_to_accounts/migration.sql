ALTER TABLE "accounts"
ADD COLUMN IF NOT EXISTS "oauth_onboarding_required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "oauth_onboarding_completed_at" TIMESTAMP(3);

UPDATE "accounts" a
SET
  "oauth_onboarding_required" = u."oauth_onboarding_required",
  "oauth_onboarding_completed_at" = u."oauth_onboarding_completed_at"
FROM "users" u
WHERE a."user_id" = u."id"
  AND a."provider_id" <> 'email-password';

ALTER TABLE "users"
DROP COLUMN IF EXISTS "oauth_onboarding_required",
DROP COLUMN IF EXISTS "oauth_onboarding_completed_at";
