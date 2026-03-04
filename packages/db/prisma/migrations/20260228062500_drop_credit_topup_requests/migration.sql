-- Drop legacy table that was used by the pre-Stripe-CreditTopup implementation.
-- Safe to run even if the table does not exist.
DROP TABLE IF EXISTS "credit_topup_requests" CASCADE;

