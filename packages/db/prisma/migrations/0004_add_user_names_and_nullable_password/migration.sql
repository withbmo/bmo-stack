-- AlterTable
ALTER TABLE "users" ADD COLUMN "first_name" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN "last_name" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "hashed_password" DROP NOT NULL;

