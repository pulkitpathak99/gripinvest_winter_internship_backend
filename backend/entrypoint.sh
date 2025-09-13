#!/bin/sh
# backend/entrypoint.sh

# Run migrations
pnpm exec prisma migrate deploy

# Start the application
exec pnpm start