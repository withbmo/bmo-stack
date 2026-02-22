-- CreateEnum
CREATE TYPE "AdminLevel" AS ENUM ('owner', 'operator', 'viewer');

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "level" "AdminLevel" NOT NULL,
    "granted_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_user_id_key" ON "admins"("user_id");

-- CreateIndex
CREATE INDEX "admins_level_idx" ON "admins"("level");

-- CreateIndex
CREATE INDEX "admins_granted_by_user_id_idx" ON "admins"("granted_by_user_id");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_granted_by_user_id_fkey" FOREIGN KEY ("granted_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill only superusers as owner admins
INSERT INTO "admins" ("id", "user_id", "level", "created_at", "updated_at")
SELECT u."id", u."id", 'owner'::"AdminLevel", NOW(), NOW()
FROM "users" u
WHERE u."is_superuser" = true
ON CONFLICT ("user_id") DO NOTHING;
