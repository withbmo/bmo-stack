-- Stripe credit grants are no longer used; keep top-ups purely as local wallet ledger updates.
-- Drop the Stripe Credit Grant ID column from our top-up audit table.

ALTER TABLE "stripe_credit_topups"
  DROP CONSTRAINT IF EXISTS "stripe_credit_topups_stripe_credit_grant_id_key";

DROP INDEX IF EXISTS "stripe_credit_topups_stripe_credit_grant_id_key";

ALTER TABLE "stripe_credit_topups"
  DROP COLUMN IF EXISTS "stripe_credit_grant_id";

