DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BillingEngineProvider') THEN
    CREATE TYPE "BillingEngineProvider" AS ENUM ('stripe', 'lago', 'orb');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BillingEngineAccessState') THEN
    CREATE TYPE "BillingEngineAccessState" AS ENUM (
      'enabled',
      'locked_due_to_payment',
      'locked_wallet_depleted',
      'locked_no_subscription'
    );
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "billing_engine_states" (
  "user_id" TEXT NOT NULL,
  "provider" "BillingEngineProvider" NOT NULL DEFAULT 'stripe',
  "external_customer_id" TEXT NOT NULL,
  "external_subscription_id" TEXT NOT NULL,
  "plan_code" TEXT NOT NULL,
  "access_state" "BillingEngineAccessState" NOT NULL,
  "locked_reason" TEXT,
  "last_stripe_event_id" TEXT,
  "last_engine_event_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "billing_engine_states_pkey" PRIMARY KEY ("user_id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "billing_engine_states_external_customer_id_key"
  ON "billing_engine_states"("external_customer_id");
CREATE UNIQUE INDEX IF NOT EXISTS "billing_engine_states_external_subscription_id_key"
  ON "billing_engine_states"("external_subscription_id");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'billing_engine_states_user_id_fkey'
  ) THEN
    ALTER TABLE "billing_engine_states"
      ADD CONSTRAINT "billing_engine_states_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END
$$;

ALTER TABLE "billing_engine_states"
ADD COLUMN IF NOT EXISTS "plan_catalog_version" INTEGER;
