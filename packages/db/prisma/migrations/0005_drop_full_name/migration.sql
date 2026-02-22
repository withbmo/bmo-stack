-- AlterTable: remove deprecated full_name column (replaced by first_name + last_name)
ALTER TABLE "users" DROP COLUMN IF EXISTS "full_name";
