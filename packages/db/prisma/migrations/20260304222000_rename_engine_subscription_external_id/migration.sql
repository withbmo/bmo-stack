DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'billing_engine_states'
      AND column_name = 'external_subscription_id'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'billing_engine_states'
      AND column_name = 'engine_subscription_external_id'
  ) THEN
    ALTER TABLE "billing_engine_states"
      RENAME COLUMN "external_subscription_id" TO "engine_subscription_external_id";
  END IF;
END
$$;
