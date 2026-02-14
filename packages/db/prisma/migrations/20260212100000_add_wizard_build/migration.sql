-- CreateTable
CREATE TABLE "wizard_builds" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "inputs" JSONB NOT NULL,
    "manifest" JSONB NOT NULL,
    "lock" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wizard_builds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wizard_builds_owner_id_idx" ON "wizard_builds"("owner_id");

-- CreateIndex
CREATE INDEX "wizard_builds_project_id_idx" ON "wizard_builds"("project_id");

-- AddForeignKey
ALTER TABLE "wizard_builds" ADD CONSTRAINT "wizard_builds_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wizard_builds" ADD CONSTRAINT "wizard_builds_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

