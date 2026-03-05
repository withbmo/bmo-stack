-- Ensure social sign-in can create users when provider doesn't send username
ALTER TABLE "users"
  ALTER COLUMN "username" SET DEFAULT ('user_'::text || substr(md5(((random())::text || (clock_timestamp())::text)), 1, 12));
