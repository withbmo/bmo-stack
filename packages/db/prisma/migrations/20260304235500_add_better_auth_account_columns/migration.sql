-- Better Auth account table compatibility columns
ALTER TABLE "accounts"
  ADD COLUMN IF NOT EXISTS "id_token" TEXT,
  ADD COLUMN IF NOT EXISTS "scope" TEXT,
  ADD COLUMN IF NOT EXISTS "password" TEXT,
  ADD COLUMN IF NOT EXISTS "access_token_expires_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "refresh_token_expires_at" TIMESTAMP(3);
