#!/bin/bash

# OAuth troubleshooting script
# This script helps diagnose and fix OAuth authentication issues

echo "Running OAuth troubleshooting..."

# Check environment variables
echo "Checking OAuth environment variables..."
if [ -z "$CLERK_PUBLISHABLE_KEY" ]; then
    echo "⚠️  CLERK_PUBLISHABLE_KEY is not set"
else
    echo "✅ CLERK_PUBLISHABLE_KEY is set"
fi

if [ -z "$CLERK_SECRET_KEY" ]; then
    echo "⚠️  CLERK_SECRET_KEY is not set"
else
    echo "✅ CLERK_SECRET_KEY is set"
fi

# Check for OAuth provider configurations
echo "Checking OAuth provider configurations..."

# Check if OAuth redirect URLs are properly configured
echo "Checking OAuth redirect URLs..."
echo "Make sure the following URLs are configured in your OAuth providers:"
echo "- http://localhost:3000/api/auth/callback/[provider]"
echo "- https://your-domain.com/api/auth/callback/[provider]"

# Check middleware configuration
echo "Checking middleware configuration..."
if [ -f "src/middleware.ts" ]; then
    echo "✅ Middleware file exists"
else
    echo "⚠️  Middleware file not found"
fi

echo "OAuth troubleshooting completed."
echo "Check the console output above for any issues."
