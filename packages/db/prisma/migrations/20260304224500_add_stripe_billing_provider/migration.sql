-- Add stripe provider for Stripe-only billing migration
ALTER TYPE "BillingEngineProvider" ADD VALUE IF NOT EXISTS 'stripe';

-- Backfill legacy rows so local billing state snapshots are Stripe-owned.
UPDATE "billing_engine_states"
SET "provider" = 'stripe'
WHERE "provider" IN ('lago', 'orb');
