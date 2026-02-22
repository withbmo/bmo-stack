CREATE TABLE "public"."auth_login_attempts" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "failed_attempts" INTEGER NOT NULL DEFAULT 0,
  "first_failed_at" TIMESTAMP(3),
  "last_failed_at" TIMESTAMP(3),
  "locked_until" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "auth_login_attempts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "auth_login_attempts_email_key" ON "public"."auth_login_attempts"("email");
CREATE INDEX "auth_login_attempts_locked_until_idx" ON "public"."auth_login_attempts"("locked_until");
