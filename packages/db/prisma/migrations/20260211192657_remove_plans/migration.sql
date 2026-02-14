/*
  Warnings:

  - You are about to drop the column `plan_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `plan_features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `plans` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "plan_features" DROP CONSTRAINT "plan_features_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_plan_id_fkey";

-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "plan_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "plan_id";

-- DropTable
DROP TABLE "plan_features";

-- DropTable
DROP TABLE "plans";
