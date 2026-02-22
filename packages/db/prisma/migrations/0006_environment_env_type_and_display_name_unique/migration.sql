-- Replace Environment.name with envType at the Prisma-level (DB column remains "name")
-- and move uniqueness from (owner_id, name) to (owner_id, display_name) so users can
-- create multiple envs of the same type (e.g. multiple "dev") distinguished by display name.

DROP INDEX IF EXISTS "environments_owner_id_name_key";
CREATE UNIQUE INDEX IF NOT EXISTS "environments_owner_id_display_name_key"
ON "environments"("owner_id", "display_name");

