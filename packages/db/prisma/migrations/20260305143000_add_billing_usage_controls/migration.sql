-- CreateTable
CREATE TABLE "billing_usage_limits" (
    "user_id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "max_credits" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billing_usage_limits_pkey" PRIMARY KEY ("user_id", "event_name")
);

-- CreateTable
CREATE TABLE "billing_usage_aggregates" (
    "user_id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "consumed_credits" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billing_usage_aggregates_pkey" PRIMARY KEY ("user_id", "event_name", "period_start")
);

-- CreateTable
CREATE TABLE "billing_usage_reports" (
    "idempotency_key" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "consumed_credits" INTEGER NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billing_usage_reports_pkey" PRIMARY KEY ("idempotency_key")
);

-- CreateIndex
CREATE INDEX "billing_usage_limits_user_id_idx" ON "billing_usage_limits"("user_id");

-- CreateIndex
CREATE INDEX "billing_usage_aggregates_user_id_period_start_idx" ON "billing_usage_aggregates"("user_id", "period_start");

-- CreateIndex
CREATE INDEX "billing_usage_reports_user_id_occurred_at_idx" ON "billing_usage_reports"("user_id", "occurred_at");

-- AddForeignKey
ALTER TABLE "billing_usage_limits" ADD CONSTRAINT "billing_usage_limits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_usage_aggregates" ADD CONSTRAINT "billing_usage_aggregates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_usage_reports" ADD CONSTRAINT "billing_usage_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
