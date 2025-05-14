#!/bin/bash

# This script ensures Prisma's engine binaries are properly included in the build

echo "🔧 Running Prisma binary fixup script"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Create the output directory if it doesn't exist
mkdir -p ./.next/server

# Copy all Prisma engine binaries to the build output
echo "📂 Copying Prisma binaries to build output..."
if [ -d "./node_modules/.prisma" ]; then
  cp -R ./node_modules/.prisma ./.next/
  echo "✅ Copied Prisma binaries to .next folder"
else
  echo "❌ Could not find Prisma binaries in node_modules/.prisma"
fi

# Log success
echo "✅ Prisma binary fixup complete"
