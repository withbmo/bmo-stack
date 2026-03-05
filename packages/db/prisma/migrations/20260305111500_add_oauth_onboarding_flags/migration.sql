ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "oauth_onboarding_required" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "oauth_onboarding_completed_at" TIMESTAMP(3);
