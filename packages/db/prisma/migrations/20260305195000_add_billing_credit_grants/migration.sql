CREATE TABLE "billing_credit_grants" (
    "stripe_invoice_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billing_credit_grants_pkey" PRIMARY KEY ("stripe_invoice_id")
);

CREATE INDEX "billing_credit_grants_user_id_idx" ON "billing_credit_grants"("user_id");

ALTER TABLE "billing_credit_grants" ADD CONSTRAINT "billing_credit_grants_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
