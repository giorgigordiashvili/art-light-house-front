#!/bin/bash

# Prisma post-build script
# This script runs after the build process to handle any post-build database operations

echo "Running Prisma post-build operations..."

# Ensure Prisma client is generated
echo "Generating Prisma client..."
npx prisma generate

# Check if we're in production and run migrations if needed
if [ "$NODE_ENV" = "production" ]; then
    echo "Production environment detected. Deploying migrations..."
    npx prisma migrate deploy
else
    echo "Development environment detected. Skipping migrations."
fi

echo "Prisma post-build operations completed."
