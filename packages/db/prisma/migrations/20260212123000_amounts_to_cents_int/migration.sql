-- Standardize money amounts to minor units (cents)
-- - payments.amount: DECIMAL dollars -> INTEGER cents
-- - invoices.amount: DECIMAL dollars -> INTEGER cents

ALTER TABLE "payments"
  ALTER COLUMN "amount" TYPE INTEGER
  USING (ROUND("amount" * 100)::INTEGER);

ALTER TABLE "invoices"
  ALTER COLUMN "amount" TYPE INTEGER
  USING (ROUND("amount" * 100)::INTEGER);

