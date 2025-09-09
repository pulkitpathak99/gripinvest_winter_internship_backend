# frontend/Dockerfile



# ---- Base Stage ----

FROM node:20-alpine AS base

WORKDIR /app

RUN npm install -g pnpm



# ---- Builder Stage ----

FROM base AS builder

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

COPY backend/package.json ./backend/

COPY frontend/package.json ./frontend/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter frontend build



# ---- Runner Stage ----

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production



RUN addgroup --system --gid 1001 nodejs

RUN adduser --system --uid 1001 nextjs



# CORRECTED: Added a trailing slash "/" to the source path

COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone/ .



USER nextjs



EXPOSE 3000



CMD ["node", "frontend/server.js"]