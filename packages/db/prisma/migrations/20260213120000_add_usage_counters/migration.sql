-- Usage counters for entitlements
CREATE TABLE "usage_counters" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "feature_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "used" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_counters_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "usage_counters_user_id_feature_id_period_start_period_end_key" ON "usage_counters"("user_id", "feature_id", "period_start", "period_end");

ALTER TABLE "usage_counters" ADD CONSTRAINT "usage_counters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
