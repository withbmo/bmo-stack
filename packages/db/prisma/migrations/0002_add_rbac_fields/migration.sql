-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin', 'support', 'billing');

-- AlterTable
ALTER TABLE "users"
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'user',
ADD COLUMN     "permissions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

