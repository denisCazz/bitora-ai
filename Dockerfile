# syntax=docker/dockerfile:1.7

# ---------- Base image ----------
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=production

# ---------- Deps ----------
FROM base AS deps
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# ---------- Build ----------
FROM base AS build
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --omit=dev

# ---------- Runtime ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=80 \
    ASTRO_TELEMETRY_DISABLED=1

# Crea utente non-root
RUN addgroup -g 1001 -S nodejs \
 && adduser -S astro -u 1001 -G nodejs

COPY --from=build --chown=astro:nodejs /app/dist ./dist
COPY --from=build --chown=astro:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=astro:nodejs /app/package.json ./package.json

USER astro

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/api/health || exit 1

CMD ["node", "./dist/server/entry.mjs"]
