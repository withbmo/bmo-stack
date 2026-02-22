-- Remove legacy custom OTP code table now that Better Auth OTP is the single source of truth.
DROP TABLE IF EXISTS "auth_otp_codes";
