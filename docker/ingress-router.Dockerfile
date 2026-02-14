FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json turbo.json ./
COPY apps ./apps
COPY packages ./packages
RUN corepack enable && pnpm install --frozen-lockfile

FROM deps AS build
RUN pnpm --filter @pytholit/ingress-router build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/ingress-router/dist ./apps/ingress-router/dist
COPY --from=build /app/apps/ingress-router/package.json ./apps/ingress-router/package.json
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3402
CMD ["node", "apps/ingress-router/dist/main.js"]
