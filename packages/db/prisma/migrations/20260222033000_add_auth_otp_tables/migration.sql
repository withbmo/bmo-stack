CREATE TABLE "auth_otp_codes" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "code_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "attempts_used" INTEGER NOT NULL DEFAULT 0,
  "max_attempts" INTEGER NOT NULL DEFAULT 5,
  "consumed_at" TIMESTAMP(3),
  "requested_from_ip" TEXT,
  "requested_from_ua" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "auth_otp_codes_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "auth_otp_codes_email_purpose_expires_at_idx"
  ON "auth_otp_codes"("email", "purpose", "expires_at");
CREATE INDEX "auth_otp_codes_email_purpose_consumed_at_idx"
  ON "auth_otp_codes"("email", "purpose", "consumed_at");

CREATE TABLE "auth_otp_throttles" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "ip" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "window_start" TIMESTAMP(3) NOT NULL,
  "window_sec" INTEGER NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "locked_until" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "auth_otp_throttles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "auth_otp_throttles_email_ip_action_window_start_window_sec_key"
  ON "auth_otp_throttles"("email", "ip", "action", "window_start", "window_sec");
CREATE INDEX "auth_otp_throttles_email_ip_action_locked_until_idx"
  ON "auth_otp_throttles"("email", "ip", "action", "locked_until");
