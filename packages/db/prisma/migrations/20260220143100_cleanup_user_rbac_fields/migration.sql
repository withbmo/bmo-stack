-- Drop legacy RBAC columns from users
ALTER TABLE "users"
DROP COLUMN IF EXISTS "permissions",
DROP COLUMN IF EXISTS "role",
DROP COLUMN IF EXISTS "is_superuser";

-- Drop legacy enum type
DROP TYPE IF EXISTS "UserRole";
