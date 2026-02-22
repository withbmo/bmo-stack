FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json turbo.json ./
COPY apps ./apps
COPY packages ./packages
RUN corepack enable && pnpm install --frozen-lockfile

FROM deps AS build
RUN pnpm --filter @pytholit/env-orchestrator build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/env-orchestrator/dist ./apps/env-orchestrator/dist
COPY --from=build /app/apps/env-orchestrator/package.json ./apps/env-orchestrator/package.json
# pnpm workspace layout: per-app node_modules contains symlinks into the root .pnpm store,
# so we must copy both the root node_modules and the app node_modules.
COPY --from=build /app/apps/env-orchestrator/node_modules ./apps/env-orchestrator/node_modules
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3003
CMD ["node", "apps/env-orchestrator/dist/main.js"]
