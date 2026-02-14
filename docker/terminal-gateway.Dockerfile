FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json turbo.json ./
COPY apps ./apps
COPY packages ./packages
RUN corepack enable && pnpm install --frozen-lockfile

FROM deps AS build
RUN pnpm --filter @pytholit/terminal-gateway build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/terminal-gateway/dist ./apps/terminal-gateway/dist
COPY --from=build /app/apps/terminal-gateway/package.json ./apps/terminal-gateway/package.json
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3403
CMD ["node", "apps/terminal-gateway/dist/main.js"]
