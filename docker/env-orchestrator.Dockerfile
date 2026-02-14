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
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3401
CMD ["node", "apps/env-orchestrator/dist/main.js"]
