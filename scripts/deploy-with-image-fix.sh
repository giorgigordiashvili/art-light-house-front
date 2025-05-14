#!/bin/bash

# This script ensures that the latest changes are properly deployed to Netlify

echo "Starting deployment process for Art Light House..."

# Step 1: Add missing Clerk domains in next.config.ts if needed
# (Already done in the codebase)

# Step 2: Set up environment variables
echo "Checking environment variables..."

# Ensure these environment variables are set in Netlify dashboard
required_vars=(
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
  "CLERK_SECRET_KEY"
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL"
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL"
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL"
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL"
  "DATABASE_URL"
  "DIRECT_URL"
)

echo "Please make sure the following environment variables are set in your Netlify dashboard:"
for var in "${required_vars[@]}"; do
  echo "- $var"
done

# Step 3: Deploy with cache clearing
echo "Running build command with cache clearing..."
echo "You can use the following command in Netlify:"
echo "npm run build && npx prisma generate && ./scripts/prisma-postbuild.sh"

echo "Deployment preparation complete!"
echo "To deploy to Netlify, commit and push these changes to your repository."
echo "Netlify should automatically deploy from your main branch."
