FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json turbo.json ./
COPY apps ./apps
COPY packages ./packages
RUN corepack enable && pnpm install --frozen-lockfile

FROM deps AS build
# Accept Turnstile site key as build argument (baked into Next.js client bundle)
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY

# API base URL is also baked into the Next.js client bundle.
# Example: https://api.dev.pytholit.dev
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# App environment selector, also baked into the Next.js client bundle.
# Values: localhost | development | production
ARG NEXT_PUBLIC_APP_ENV
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV

RUN pnpm --filter @pytholit/web... build
# In some CI/buildkit cases the `public/` dir may not exist (or may be empty).
# Ensure the path exists so the runtime stage COPY doesn't fail.
RUN mkdir -p /app/apps/web/public

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# pnpm workspace layout: per-app node_modules contains symlinks into the root .pnpm store,
# so we must copy both the root node_modules and the app node_modules.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=build /app/apps/web/.next ./apps/web/.next
COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/apps/web/package.json ./apps/web/package.json

WORKDIR /app/apps/web
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]
