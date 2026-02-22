-- CreateTable
CREATE TABLE "orchestrator_region_configs" (
  "id" TEXT NOT NULL,
  "region" TEXT NOT NULL,
  "subnet_ids" TEXT[] NOT NULL,
  "security_group_ids" TEXT[] NOT NULL,
  "ami_id" TEXT NOT NULL,
  "instance_profile_name" TEXT NOT NULL,
  "user_data_base64" TEXT,
  "dynamodb_table" TEXT NOT NULL DEFAULT 'EnvRouting',
  "env_domain_suffix" TEXT NOT NULL DEFAULT 'envs.pytholit.dev',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "orchestrator_region_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orchestrator_region_configs_region_key" ON "orchestrator_region_configs"("region");

