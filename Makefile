.PHONY: help dev install db-migrate db-push db-studio kill-ports

# ── Default ────────────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  make dev          Run all apps in watch mode (turbo dev)"
	@echo "  make install      Install all dependencies"
	@echo "  make db-migrate   Run Prisma migrations"
	@echo "  make db-push      Push the current Prisma schema to a fresh local database"
	@echo "  make db-studio    Open Prisma Studio"
	@echo "  make kill-ports   Free ports 3000 3001 3003 (dev ports)"
	@echo ""

# ── App ────────────────────────────────────────────────────────────────────────
dev:
	pnpm dev

install:
	pnpm install

# ── Database ───────────────────────────────────────────────────────────────────
db-migrate:
	pnpm db:migrate

db-push:
	pnpm --filter @pytholit/db db:push

db-studio:
	pnpm db:studio

# ── Helpers ────────────────────────────────────────────────────────────────────
kill-ports:
	@for port in 3000 3001 3003; do \
		pids=$$(lsof -ti :$$port 2>/dev/null); \
		if [ -n "$$pids" ]; then \
			for pid in $$pids; do \
				cmd=$$(ps -p $$pid -o comm= 2>/dev/null || true); \
				if echo "$$cmd" | grep -qiE 'docker|vpnkit|com\.docker'; then \
					echo "Skipping port $$port (pid $$pid) — Docker process: $$cmd"; \
				else \
					echo "Killing port $$port (pid $$pid, cmd: $$cmd)"; \
					kill -9 $$pid 2>/dev/null || true; \
				fi; \
			done; \
		fi; \
	done
	@echo "Done."
