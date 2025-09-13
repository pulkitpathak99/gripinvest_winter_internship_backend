# backend/Dockerfile (FINAL VERSION)

# ---- Builder Stage ----
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter backend exec prisma generate
RUN pnpm --filter backend build

# ---- Final Production Stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/backend/package.json ./
COPY --from=builder /app/backend/prisma ./prisma

RUN pnpm install --prod
RUN pnpm exec prisma generate

COPY --from=builder /app/backend/dist ./dist

# Copy the new entrypoint script
COPY --from=builder /app/backend/entrypoint.sh .

# Make the script executable
RUN chmod +x entrypoint.sh

EXPOSE 3001
# Set the entrypoint to our new script
ENTRYPOINT ["./entrypoint.sh"]