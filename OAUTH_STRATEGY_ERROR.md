# OAuth Strategy Error Debugging Guide

This guide addresses the specific error: `"google does not match one of the allowed values for parameter strategy"` and similar OAuth authentication errors.

## Problem

When using OAuth authentication with Clerk, you may encounter an error message like:

```json
{
  "errors": [
    {
      "message": "is invalid",
      "long_message": "google does not match one of the allowed values for parameter strategy",
      "code": "form_param_value_invalid",
      "meta": {
        "param_name": "strategy"
      }
    }
  ]
}
```

## Cause

This error occurs when an incorrect strategy name is used for OAuth authentication. The Clerk API expects specific strategy names for each OAuth provider.

## Correct Strategy Names

The correct strategy names for OAuth providers are:

- For Google: `oauth_google` (not just "google")
- For Facebook: `oauth_facebook` (not just "facebook")
- For GitHub: `oauth_github`
- For Discord: `oauth_discord`

## Solution

1. **Check the strategy mapping in AuthorizationModal.tsx**:

   ```typescript
   const strategy = provider === "google" ? "oauth_google" : "oauth_facebook";
   ```

2. **Use the OAuth test utility**:
   Visit `/oauth-test` to test the OAuth sign-in functionality in isolation.

3. **Check your Clerk dashboard**:
   Make sure the OAuth providers are properly configured in your Clerk dashboard.

## Additional Debugging Steps

1. **Enable debug logs**:

   ```typescript
   console.log(`Using OAuth strategy: ${strategy} for provider: ${provider}`);
   ```

2. **Check middleware configuration**:
   Ensure the `/sso-callback` route is properly configured as a public route.

3. **Check for OAuth race conditions**:
   Make sure the Clerk components are fully loaded before trying to authenticate:
   ```typescript
   if (!isSignInLoaded) {
     console.error("Sign-in component not loaded yet");
     return;
   }
   ```

## How to Fix the Current Issue

1. Visit the `/oauth-test` page
2. Test both Google and Facebook authentication
3. Check the browser console for detailed error messages
4. Verify that the strategy mapping is correct in all authentication code

Remember: Always use `oauth_google` instead of just `google` as the strategy name!
