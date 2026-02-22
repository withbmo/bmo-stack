-- Rename legacy Stripe-prefixed billing columns to neutral external-id names.
ALTER TABLE "subscriptions"
  RENAME COLUMN "stripe_subscription_id" TO "external_subscription_id";

ALTER TABLE "invoices"
  RENAME COLUMN "stripe_invoice_id" TO "external_invoice_id";

-- Keep index names aligned with the new column names for developer clarity.
ALTER INDEX IF EXISTS "subscriptions_stripe_subscription_id_key"
  RENAME TO "subscriptions_external_subscription_id_key";

ALTER INDEX IF EXISTS "invoices_stripe_invoice_id_key"
  RENAME TO "invoices_external_invoice_id_key";
