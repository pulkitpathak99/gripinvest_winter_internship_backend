# backend/Dockerfile (UPDATED VERSION)

# ---- Builder Stage: Compile the TypeScript ----
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile

COPY . .

# Run prisma generate before building
RUN pnpm --filter backend exec prisma generate

# This now creates a clean `dist` folder because tsconfig.json is correct
RUN pnpm --filter backend build

# ---- Final Production Stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm

# Copy only the necessary files for a production install
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/backend/package.json ./
COPY --from=builder /app/backend/prisma ./prisma

# Install ONLY production dependencies
RUN pnpm install --prod

# EXPLICITLY run prisma generate to ensure client is generated
RUN pnpm exec prisma generate

# Copy the pre-built, correctly structured `dist` folder
COPY --from=builder /app/backend/dist ./dist

EXPOSE 3001

# This "start" script now correctly points to "dist/index.js"
CMD ["pnpm", "start"]