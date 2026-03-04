-- CreateEnum
CREATE TYPE "AdminLevel" AS ENUM ('owner', 'operator', 'viewer');

-- CreateEnum
CREATE TYPE "SignupBonusStatus" AS ENUM ('PENDING', 'GRANTED', 'FAILED');

-- CreateEnum
CREATE TYPE "DeployJobStatus" AS ENUM ('queued', 'running', 'succeeded', 'failed', 'canceled');

-- CreateEnum
CREATE TYPE "BillingAccountType" AS ENUM ('user');

-- CreateEnum
CREATE TYPE "PlanId" AS ENUM ('free', 'pro', 'max');

-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('month', 'year');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'trialing', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused', 'canceled', 'processing_upgrade');

-- CreateEnum
CREATE TYPE "FeatureAccessState" AS ENUM ('enabled', 'locked_due_to_payment', 'locked_no_subscription');

-- CreateEnum
CREATE TYPE "LedgerEntryType" AS ENUM ('grant', 'debit', 'reversal', 'adjustment');

-- CreateEnum
CREATE TYPE "UsageCategory" AS ENUM ('ai', 'compute', 'storage', 'egress', 'export');

-- CreateEnum
CREATE TYPE "UsageEventStatus" AS ENUM ('pending', 'accepted', 'rejected_insufficient_credits', 'rejected_not_allowed', 'duplicate', 'reversed');

-- CreateEnum
CREATE TYPE "StripeWebhookProcessingStatus" AS ENUM ('received', 'queued', 'processed', 'failed');

-- CreateEnum
CREATE TYPE "StripePriceInterval" AS ENUM ('month', 'year');

-- CreateEnum
CREATE TYPE "BillingReasonCode" AS ENUM ('OK', 'BILLING_ROLLOUT_DISABLED', 'FEATURE_NOT_IN_PLAN', 'PLAN_LIMIT_REACHED', 'SUBSCRIPTION_LOCKED', 'INSUFFICIENT_CREDITS', 'INVALID_REQUEST', 'INTERNAL_ERROR');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "display_username" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "bio" TEXT,
    "avatar_url" TEXT,
    "hashed_password" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "signup_bonus_granted_at" TIMESTAMP(3),
    "signup_bonus_status" "SignupBonusStatus" NOT NULL DEFAULT 'PENDING',
    "novu_subscriber_id" TEXT,
    "stripe_customer_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "oauth_accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "account_email" TEXT,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_login_attempts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,
    "first_failed_at" TIMESTAMP(3),
    "last_failed_at" TIMESTAMP(3),
    "locked_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_otp_throttles" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "window_start" TIMESTAMP(3) NOT NULL,
    "window_sec" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_otp_throttles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "repo_export_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environments" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "project_id" TEXT,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "tier_policy" TEXT NOT NULL DEFAULT 'free',
    "execution_mode" TEXT NOT NULL DEFAULT 'managed',
    "region" TEXT NOT NULL DEFAULT 'us-east-1',
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "config" JSONB,
    "orchestrator_status" TEXT NOT NULL DEFAULT 'unknown',
    "orchestrator_status_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "environments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terminal_tabs" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "environment_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "archived_at" TIMESTAMP(3),
    "transcript" TEXT NOT NULL DEFAULT '',
    "last_seq" BIGINT NOT NULL DEFAULT 0,
    "last_active_at" TIMESTAMP(3),
    "tmux_enabled" BOOLEAN NOT NULL DEFAULT false,
    "tmux_session_name" TEXT,
    "tmux_last_used_at" TIMESTAMP(3),
    "tmux_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terminal_tabs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orchestrator_region_configs" (
    "id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "subnet_ids" TEXT[],
    "security_group_ids" TEXT[],
    "ami_id_x86_64" TEXT NOT NULL,
    "ami_id_arm64" TEXT NOT NULL,
    "instance_profile_name" TEXT NOT NULL,
    "user_data_base64" TEXT,
    "dynamodb_table" TEXT NOT NULL DEFAULT 'EnvRouting',
    "env_domain_suffix" TEXT NOT NULL DEFAULT 'envs.pytholit.dev',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orchestrator_region_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deploy_jobs" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "environment_id" TEXT NOT NULL,
    "triggered_by_user_id" TEXT,
    "status" "DeployJobStatus" NOT NULL DEFAULT 'queued',
    "current_step" TEXT,
    "steps" JSONB NOT NULL,
    "source" JSONB NOT NULL,
    "execution_mode_snapshot" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "deploy_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wizard_builds" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "inputs" JSONB NOT NULL,
    "manifest" JSONB NOT NULL,
    "lock" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wizard_builds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_accounts" (
    "id" TEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "type" "BillingAccountType" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billing_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "billing_account_id" TEXT NOT NULL,
    "balance_microcredits" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("billing_account_id")
);

-- CreateTable
CREATE TABLE "credit_ledger_entries" (
    "id" TEXT NOT NULL,
    "billing_account_id" TEXT NOT NULL,
    "entry_type" "LedgerEntryType" NOT NULL,
    "amount_microcredits" BIGINT NOT NULL,
    "balance_after_microcredits" BIGINT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "reference_type" TEXT NOT NULL,
    "reference_id" TEXT NOT NULL,
    "usage_event_id" TEXT,
    "reason_code" TEXT,
    "metadata_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_events" (
    "usage_event_id" TEXT NOT NULL,
    "billing_account_id" TEXT NOT NULL,
    "category" "UsageCategory" NOT NULL,
    "rate_key" TEXT NOT NULL,
    "units_json" JSONB NOT NULL,
    "rated_cost_microcredits" BIGINT NOT NULL,
    "status" "UsageEventStatus" NOT NULL,
    "decision_reason_code" "BillingReasonCode" NOT NULL,
    "ledger_entry_id" TEXT,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_events_pkey" PRIMARY KEY ("usage_event_id")
);

-- CreateTable
CREATE TABLE "stripe_plan_prices" (
    "id" TEXT NOT NULL,
    "plan_id" "PlanId" NOT NULL,
    "interval" "StripePriceInterval" NOT NULL,
    "stripe_price_id" TEXT NOT NULL,
    "stripe_usage_price_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stripe_plan_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stripe_credit_topups" (
    "id" TEXT NOT NULL,
    "billing_account_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT NOT NULL,
    "stripe_invoice_id" TEXT NOT NULL,
    "stripe_credit_grant_id" TEXT NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stripe_credit_topups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_cards" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "effective_from" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_card_items" (
    "id" TEXT NOT NULL,
    "rate_card_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "unit_amount" INTEGER NOT NULL,
    "price_microcredits" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_card_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quota_counters" (
    "id" TEXT NOT NULL,
    "billing_account_id" TEXT NOT NULL,
    "counter_key" TEXT NOT NULL,
    "window_start" TIMESTAMP(3) NOT NULL,
    "window_end" TIMESTAMP(3) NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quota_counters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_topup_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "external_invoice_id" TEXT NOT NULL,
    "amount_usd" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "granted_at" TIMESTAMP(3),
    "processed_at" TIMESTAMP(3),
    "failure_code" TEXT,
    "idempotency_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_topup_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actor_user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_novu_subscriber_id_key" ON "users"("novu_subscriber_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "admins_user_id_key" ON "admins"("user_id");

-- CreateIndex
CREATE INDEX "admins_level_idx" ON "admins"("level");

-- CreateIndex
CREATE INDEX "admins_granted_by_user_id_idx" ON "admins"("granted_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_accounts_provider_account_id_key" ON "oauth_accounts"("provider", "account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_id_account_id_key" ON "accounts"("provider_id", "account_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_value_key" ON "verification"("value");

-- CreateIndex
CREATE UNIQUE INDEX "verification_identifier_value_key" ON "verification"("identifier", "value");

-- CreateIndex
CREATE UNIQUE INDEX "auth_login_attempts_email_key" ON "auth_login_attempts"("email");

-- CreateIndex
CREATE INDEX "auth_login_attempts_locked_until_idx" ON "auth_login_attempts"("locked_until");

-- CreateIndex
CREATE INDEX "auth_otp_throttles_email_ip_action_locked_until_idx" ON "auth_otp_throttles"("email", "ip", "action", "locked_until");

-- CreateIndex
CREATE UNIQUE INDEX "auth_otp_throttles_email_ip_action_window_start_window_sec_key" ON "auth_otp_throttles"("email", "ip", "action", "window_start", "window_sec");

-- CreateIndex
CREATE UNIQUE INDEX "projects_owner_id_slug_key" ON "projects"("owner_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "environments_owner_id_display_name_key" ON "environments"("owner_id", "display_name");

-- CreateIndex
CREATE INDEX "terminal_tabs_owner_id_environment_id_idx" ON "terminal_tabs"("owner_id", "environment_id");

-- CreateIndex
CREATE INDEX "terminal_tabs_environment_id_idx" ON "terminal_tabs"("environment_id");

-- CreateIndex
CREATE INDEX "terminal_tabs_tmux_enabled_tmux_expires_at_idx" ON "terminal_tabs"("tmux_enabled", "tmux_expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "orchestrator_region_configs_region_key" ON "orchestrator_region_configs"("region");

-- CreateIndex
CREATE INDEX "wizard_builds_owner_id_idx" ON "wizard_builds"("owner_id");

-- CreateIndex
CREATE INDEX "wizard_builds_project_id_idx" ON "wizard_builds"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "billing_accounts_owner_user_id_key" ON "billing_accounts"("owner_user_id");

-- CreateIndex
CREATE INDEX "credit_ledger_entries_billing_account_id_created_at_idx" ON "credit_ledger_entries"("billing_account_id", "created_at");

-- CreateIndex
CREATE INDEX "credit_ledger_entries_entry_type_reference_type_reference_i_idx" ON "credit_ledger_entries"("entry_type", "reference_type", "reference_id");

-- CreateIndex
CREATE INDEX "usage_events_billing_account_id_created_at_idx" ON "usage_events"("billing_account_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_plan_prices_stripe_price_id_key" ON "stripe_plan_prices"("stripe_price_id");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_plan_prices_stripe_usage_price_id_key" ON "stripe_plan_prices"("stripe_usage_price_id");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_plan_prices_plan_id_interval_key" ON "stripe_plan_prices"("plan_id", "interval");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_credit_topups_stripe_invoice_id_key" ON "stripe_credit_topups"("stripe_invoice_id");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_credit_topups_stripe_credit_grant_id_key" ON "stripe_credit_topups"("stripe_credit_grant_id");

-- CreateIndex
CREATE INDEX "stripe_credit_topups_billing_account_id_idx" ON "stripe_credit_topups"("billing_account_id");

-- CreateIndex
CREATE INDEX "stripe_credit_topups_stripe_customer_id_idx" ON "stripe_credit_topups"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "rate_cards_version_key" ON "rate_cards"("version");

-- CreateIndex
CREATE INDEX "rate_card_items_key_idx" ON "rate_card_items"("key");

-- CreateIndex
CREATE UNIQUE INDEX "rate_card_items_rate_card_id_key_key" ON "rate_card_items"("rate_card_id", "key");

-- CreateIndex
CREATE INDEX "quota_counters_billing_account_id_counter_key_idx" ON "quota_counters"("billing_account_id", "counter_key");

-- CreateIndex
CREATE UNIQUE INDEX "quota_counters_billing_account_id_counter_key_window_start__key" ON "quota_counters"("billing_account_id", "counter_key", "window_start", "window_end");

-- CreateIndex
CREATE UNIQUE INDEX "credit_topup_requests_external_invoice_id_key" ON "credit_topup_requests"("external_invoice_id");

-- CreateIndex
CREATE UNIQUE INDEX "credit_topup_requests_idempotency_key_key" ON "credit_topup_requests"("idempotency_key");

-- CreateIndex
CREATE INDEX "credit_topup_requests_user_id_status_idx" ON "credit_topup_requests"("user_id", "status");

-- CreateIndex
CREATE INDEX "audit_logs_actor_user_id_idx" ON "audit_logs"("actor_user_id");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_granted_by_user_id_fkey" FOREIGN KEY ("granted_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environments" ADD CONSTRAINT "environments_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terminal_tabs" ADD CONSTRAINT "terminal_tabs_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terminal_tabs" ADD CONSTRAINT "terminal_tabs_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deploy_jobs" ADD CONSTRAINT "deploy_jobs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deploy_jobs" ADD CONSTRAINT "deploy_jobs_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deploy_jobs" ADD CONSTRAINT "deploy_jobs_triggered_by_user_id_fkey" FOREIGN KEY ("triggered_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wizard_builds" ADD CONSTRAINT "wizard_builds_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wizard_builds" ADD CONSTRAINT "wizard_builds_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_accounts" ADD CONSTRAINT "billing_accounts_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_billing_account_id_fkey" FOREIGN KEY ("billing_account_id") REFERENCES "billing_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_ledger_entries" ADD CONSTRAINT "credit_ledger_entries_billing_account_id_fkey" FOREIGN KEY ("billing_account_id") REFERENCES "billing_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_events" ADD CONSTRAINT "usage_events_billing_account_id_fkey" FOREIGN KEY ("billing_account_id") REFERENCES "billing_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_events" ADD CONSTRAINT "usage_events_ledger_entry_id_fkey" FOREIGN KEY ("ledger_entry_id") REFERENCES "credit_ledger_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stripe_credit_topups" ADD CONSTRAINT "stripe_credit_topups_billing_account_id_fkey" FOREIGN KEY ("billing_account_id") REFERENCES "billing_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_card_items" ADD CONSTRAINT "rate_card_items_rate_card_id_fkey" FOREIGN KEY ("rate_card_id") REFERENCES "rate_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quota_counters" ADD CONSTRAINT "quota_counters_billing_account_id_fkey" FOREIGN KEY ("billing_account_id") REFERENCES "billing_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_topup_requests" ADD CONSTRAINT "credit_topup_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
