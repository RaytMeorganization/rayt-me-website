# syntax=docker/dockerfile:1
# Build from monorepo root: docker build -f rayt-me-website/Dockerfile .

FROM node:22-bookworm-slim AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate
WORKDIR /app

FROM base AS shared
COPY rayt-me-shared ./rayt-me-shared
WORKDIR /app/rayt-me-shared
RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm exec tsc -p tsconfig.json

FROM base AS deps
COPY --from=shared /app/rayt-me-shared /app/rayt-me-website/.local-packages/rayt-me-shared
COPY rayt-me-website/package.json rayt-me-website/pnpm-lock.yaml ./rayt-me-website/
WORKDIR /app/rayt-me-website
# postinstall syncs sibling when present; in Docker the vendored copy is already in place
RUN pnpm install --frozen-lockfile --ignore-scripts || pnpm install --ignore-scripts
RUN mkdir -p node_modules/@rayt-me \
  && rm -rf node_modules/@rayt-me/plan-pricing \
  && ln -s /app/rayt-me-website/.local-packages/rayt-me-shared node_modules/@rayt-me/plan-pricing

FROM base AS build
ARG API_PROXY_TARGET=http://api:4000
ARG NEXT_PUBLIC_API_URL=https://api.raytme.me
ARG NEXT_PUBLIC_SITE_URL=https://raytme.me
ENV API_PROXY_TARGET=$API_PROXY_TARGET
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/rayt-me-website /app/rayt-me-website
COPY rayt-me-website /app/rayt-me-website-src
# Overlay app sources; keep deps node_modules. Do not strip .local-packages —
# lib/plan-pricing.ts imports the committed vendored sources directly.
RUN rm -rf /app/rayt-me-website-src/node_modules \
  && cp -a /app/rayt-me-website-src/. /app/rayt-me-website/ \
  && mkdir -p /app/rayt-me-website/node_modules/@rayt-me \
  && rm -rf /app/rayt-me-website/node_modules/@rayt-me/plan-pricing \
  && ln -sfn /app/rayt-me-website/.local-packages/rayt-me-shared /app/rayt-me-website/node_modules/@rayt-me/plan-pricing \
  && test -f /app/rayt-me-website/.local-packages/rayt-me-shared/src/plan-pricing.ts
WORKDIR /app/rayt-me-website
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
WORKDIR /app/rayt-me-website
COPY --from=build /app/rayt-me-website ./
RUN mkdir -p node_modules/@rayt-me \
  && rm -rf node_modules/@rayt-me/plan-pricing \
  && ln -s /app/rayt-me-website/.local-packages/rayt-me-shared node_modules/@rayt-me/plan-pricing
EXPOSE 3000
CMD ["pnpm", "start"]
