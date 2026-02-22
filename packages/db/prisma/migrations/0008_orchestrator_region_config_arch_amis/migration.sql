-- Add x86_64 + arm64 AMI columns (backfill from old ami_id), then drop ami_id.

ALTER TABLE "orchestrator_region_configs"
  ADD COLUMN "ami_id_x86_64" TEXT,
  ADD COLUMN "ami_id_arm64" TEXT;

UPDATE "orchestrator_region_configs"
SET
  "ami_id_x86_64" = COALESCE("ami_id_x86_64", "ami_id"),
  "ami_id_arm64" = COALESCE("ami_id_arm64", "ami_id");

ALTER TABLE "orchestrator_region_configs"
  ALTER COLUMN "ami_id_x86_64" SET NOT NULL,
  ALTER COLUMN "ami_id_arm64" SET NOT NULL;

ALTER TABLE "orchestrator_region_configs"
  DROP COLUMN "ami_id";

