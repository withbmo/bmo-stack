-- CreateEnum
CREATE TYPE "EngineWebhookProcessingStatus" AS ENUM ('received', 'queued', 'processed', 'failed');

-- DropForeignKey
ALTER TABLE "billing_subscriptions" DROP CONSTRAINT "billing_subscriptions_billing_account_id_fkey";

-- DropForeignKey
ALTER TABLE "credit_ledger_entries" DROP CONSTRAINT "credit_ledger_entries_billing_account_id_fkey";

-- DropForeignKey
ALTER TABLE "quota_counters" DROP CONSTRAINT "quota_counters_billing_account_id_fkey";

-- DropForeignKey
ALTER TABLE "rate_card_items" DROP CONSTRAINT "rate_card_items_rate_card_id_fkey";

-- DropForeignKey
ALTER TABLE "stripe_credit_topups" DROP CONSTRAINT "stripe_credit_topups_billing_account_id_fkey";

-- DropForeignKey
ALTER TABLE "usage_events" DROP CONSTRAINT "usage_events_billing_account_id_fkey";

-- DropForeignKey
ALTER TABLE "usage_events" DROP CONSTRAINT "usage_events_ledger_entry_id_fkey";

-- DropForeignKey
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_billing_account_id_fkey";

-- AlterTable
ALTER TABLE "billing_engine_states" ALTER COLUMN "provider" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "billing_provider_id" TEXT;

-- DropTable
DROP TABLE "billing_subscriptions";

-- DropTable
DROP TABLE "credit_ledger_entries";

-- DropTable
DROP TABLE "quota_counters";

-- DropTable
DROP TABLE "rate_card_items";

-- DropTable
DROP TABLE "rate_cards";

-- DropTable
DROP TABLE "stripe_credit_topups";

-- DropTable
DROP TABLE "stripe_plan_prices";

-- DropTable
DROP TABLE "usage_events";

-- DropTable
DROP TABLE "wallets";

-- DropEnum
DROP TYPE "BillingReasonCode";

-- DropEnum
DROP TYPE "LedgerEntryType";

-- DropEnum
DROP TYPE "StripePriceInterval";

-- DropEnum
DROP TYPE "UsageCategory";

-- DropEnum
DROP TYPE "UsageEventStatus";

-- CreateTable
CREATE TABLE "engine_webhook_events" (
    "engine_event_id" TEXT NOT NULL,
    "provider" "BillingEngineProvider" NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload_json" JSONB NOT NULL,
    "raw_body" BYTEA NOT NULL,
    "signature_header" TEXT NOT NULL,
    "processing_status" "EngineWebhookProcessingStatus" NOT NULL DEFAULT 'received',
    "processing_attempts" INTEGER NOT NULL DEFAULT 0,
    "last_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engine_webhook_events_pkey" PRIMARY KEY ("engine_event_id")
);

-- CreateIndex
CREATE INDEX "engine_webhook_events_provider_processing_status_created_at_idx" ON "engine_webhook_events"("provider", "processing_status", "created_at");

-- CreateIndex
CREATE INDEX "billing_engine_states_provider_updated_at_idx" ON "billing_engine_states"("provider", "updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "users_billing_provider_id_key" ON "users"("billing_provider_id");

-- RenameIndex
ALTER INDEX "billing_engine_states_external_subscription_id_key" RENAME TO "billing_engine_states_engine_subscription_external_id_key";

