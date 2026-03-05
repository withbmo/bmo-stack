CREATE TABLE IF NOT EXISTS "signup_bonus_grants" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "SignupBonusStatus" NOT NULL DEFAULT 'PENDING',
    "granted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "signup_bonus_grants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "signup_bonus_grants_user_id_key" ON "signup_bonus_grants"("user_id");
CREATE INDEX IF NOT EXISTS "signup_bonus_grants_status_created_at_idx" ON "signup_bonus_grants"("status", "created_at");

ALTER TABLE "signup_bonus_grants"
ADD CONSTRAINT "signup_bonus_grants_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "signup_bonus_grants" ("id", "user_id", "status", "granted_at", "created_at", "updated_at")
SELECT
  md5(random()::text || clock_timestamp()::text || u."id"::text),
  u."id",
  COALESCE(u."signup_bonus_status", 'PENDING')::"SignupBonusStatus",
  u."signup_bonus_granted_at",
  NOW(),
  NOW()
FROM "users" u
WHERE u."signup_bonus_granted_at" IS NOT NULL
   OR u."signup_bonus_status" IS DISTINCT FROM 'PENDING'
ON CONFLICT ("user_id") DO NOTHING;

ALTER TABLE "users"
DROP COLUMN IF EXISTS "signup_bonus_granted_at",
DROP COLUMN IF EXISTS "signup_bonus_status";
