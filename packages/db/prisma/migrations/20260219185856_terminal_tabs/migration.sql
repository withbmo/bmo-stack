-- CreateTable
CREATE TABLE "terminal_tabs" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "environment_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "archived_at" TIMESTAMP(3),
    "transcript" TEXT NOT NULL DEFAULT '',
    "last_seq" BIGINT NOT NULL DEFAULT 0,
    "last_active_at" TIMESTAMP(3),
    "tmux_enabled" BOOLEAN NOT NULL DEFAULT false,
    "tmux_session_name" TEXT,
    "tmux_last_used_at" TIMESTAMP(3),
    "tmux_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terminal_tabs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "terminal_tabs_owner_id_environment_id_idx" ON "terminal_tabs"("owner_id", "environment_id");

-- CreateIndex
CREATE INDEX "terminal_tabs_environment_id_idx" ON "terminal_tabs"("environment_id");

-- CreateIndex
CREATE INDEX "terminal_tabs_tmux_enabled_tmux_expires_at_idx" ON "terminal_tabs"("tmux_enabled", "tmux_expires_at");

-- AddForeignKey
ALTER TABLE "terminal_tabs" ADD CONSTRAINT "terminal_tabs_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terminal_tabs" ADD CONSTRAINT "terminal_tabs_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
