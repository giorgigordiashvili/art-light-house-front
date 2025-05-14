#!/bin/zsh

# OAuth Troubleshooting Script
# This script helps diagnose and fix OAuth authentication issues in the application

echo "🔍 OAuth Troubleshooting Script"
echo "==============================="

# Check for required environment variables
echo "\n📋 Checking Clerk environment variables..."

REQUIRED_VARS=(
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
  "CLERK_SECRET_KEY" 
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL"
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL"
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL"
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL"
)

ENV_FILE=".env.local"
MISSING_VARS=0

if [[ -f "$ENV_FILE" ]]; then
  echo "Found .env.local file"
  for VAR in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${VAR}=" "$ENV_FILE"; then
      echo "⚠️ Missing: $VAR in $ENV_FILE"
      MISSING_VARS=$((MISSING_VARS+1))
    else
      echo "✅ Found: $VAR"
    fi
  done
else
  echo "⚠️ No .env.local file found!"
  MISSING_VARS=$((MISSING_VARS+1))
fi

if [[ "$MISSING_VARS" -gt 0 ]]; then
  echo "\n❌ Environment variables check failed. Please fix the missing variables."
else
  echo "\n✅ All required environment variables are present."
fi

# Check OAuth implementation files
echo "\n📋 Checking OAuth implementation..."

FILES_TO_CHECK=(
  "src/components/Header/AuthorizationModal.tsx"
  "src/app/sso-callback/page.tsx"
  "src/middleware.ts"
  "next.config.ts"
)

for FILE in "${FILES_TO_CHECK[@]}"; do
  if [[ -f "$FILE" ]]; then
    echo "✅ Found: $FILE"
    
    # Check for proper usage of oauth_google in AuthorizationModal.tsx
    if [[ "$FILE" == "src/components/Header/AuthorizationModal.tsx" ]]; then
      if grep -q "oauth_google" "$FILE"; then
        echo "  ✅ Found correct OAuth strategy name 'oauth_google'"
      else
        echo "  ❌ Could not find correct OAuth strategy name 'oauth_google'"
        echo "  🔧 FIX: Make sure you're using 'oauth_google' instead of just 'google' as the strategy"
      fi
    fi
    
    # Check middleware for proper SSO callback config
    if [[ "$FILE" == "src/middleware.ts" ]]; then
      if grep -q "/sso-callback" "$FILE"; then
        echo "  ✅ SSO callback route is properly configured in middleware"
      else
        echo "  ❌ SSO callback is not configured in middleware"
        echo "  🔧 FIX: Add '/sso-callback(.*)' to the publicRoutes array"
      fi
    fi
  else
    echo "❌ Missing: $FILE"
  fi
done

# Provide a summary of fixes for common OAuth issues
echo "\n📝 Common OAuth Issues and Solutions:"
echo "---------------------------------------"
echo "1. For 'google does not match one of the allowed values for parameter strategy':"
echo "   ✅ Use 'oauth_google' instead of just 'google' as the strategy"
echo "   ✅ Use 'oauth_facebook' instead of just 'facebook' as the strategy"
echo ""
echo "2. For OAuth flow getting stuck:"
echo "   ✅ Ensure '/sso-callback' is in the publicRoutes array in middleware.ts"
echo "   ✅ Add proper error handling in your OAuth implementation"
echo "   ✅ Configure proper redirectUrl and redirectUrlComplete values"
echo ""
echo "3. For testing OAuth authentication:"
echo "   ✅ Visit the /oauth-test page to test authentication in isolation"

echo "\n🎉 Troubleshooting complete! Use the /oauth-test page to test your fixes."
