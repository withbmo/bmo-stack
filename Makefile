.PHONY: help up down restart dev install db-migrate db-studio logs ps kill-ports

COMPOSE := docker compose -f docker-compose.dev.yml

# ── Default ────────────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  make up           Start infra (postgres, redis) — orchestrator runs locally via pnpm dev"
	@echo "  make down         Stop and remove infra containers"
	@echo "  make restart      Restart infra containers"
	@echo "  make dev          Run all apps in watch mode (turbo dev)"
	@echo "  make install      Install all dependencies"
	@echo "  make db-migrate   Run Prisma migrations"
	@echo "  make db-studio    Open Prisma Studio"
	@echo "  make logs         Tail infra container logs"
	@echo "  make ps           Show running containers"
	@echo "  make kill-ports   Free ports 3000 3001 3003 (dev ports)"
	@echo ""

# ── Infrastructure ──────────────────────────────────────────────────────────────
up:
	$(COMPOSE) up -d postgres redis

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart postgres redis

logs:
	$(COMPOSE) logs -f postgres redis

ps:
	$(COMPOSE) ps

# ── App ────────────────────────────────────────────────────────────────────────
dev: up
	pnpm dev

install:
	pnpm install

# ── Database ───────────────────────────────────────────────────────────────────
db-migrate:
	pnpm db:migrate

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
