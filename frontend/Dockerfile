# ---- Base Stage ----
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# ---- Dependencies Stage ----
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the frontend
RUN pnpm --filter frontend build

# ---- Runner Stage ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
# Copy static files
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./frontend/.next/static
# Copy public files if they exist
COPY --from=builder --chown=nextjs:nodejs /app/frontend/public ./frontend/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "frontend/server.js"]