# OAuth Authentication Implementation

This document explains how OAuth social authentication is implemented in this project.

## Overview

Our application uses Clerk's authentication system to provide OAuth sign-in options for users. Currently, we support:

- Google OAuth Authentication
- Facebook OAuth Authentication

## Implementation Details

### 1. SSO Callback Page

We use a dedicated SSO callback page at `/sso-callback` that handles the OAuth redirect flow. This page:

- Shows a loading spinner while authentication processes
- Uses Clerk's `<AuthenticateWithRedirectCallback />` component to automatically handle authentication redirects
- Routes the user back to the homepage after successful authentication
- Works with our app's popup modal authentication approach, so it doesn't require specific sign-in/sign-up URLs
- Contains a dedicated div with id="clerk-captcha" to support Clerk's bot protection CAPTCHA

**File**: `/src/app/sso-callback/page.tsx`

### 2. Authentication Modal

The `AuthorizationModal` component allows users to:

- Sign in with email/password
- Sign up with email/password
- Sign in with Google
- Sign in with Facebook

When a user clicks on a social sign-in button, we call `authenticateWithRedirect()` with the appropriate OAuth strategy. The modal captures the current URL path before redirecting, so users return to the same page they were on before the authentication flow.

**File**: `/src/components/Header/AuthorizationModal.tsx`

### 3. OAuth Strategy Names

When working with Clerk's OAuth providers, we use these strategy identifiers:

- Google: `oauth_google`
- Facebook: `oauth_facebook`

## Database Integration

When users sign up or sign in with OAuth:

1. Clerk handles the OAuth authentication flow
2. Our webhook handler (`/src/app/api/webhooks/clerk/route.ts`) saves user data to our database
3. The User table maintains a record with the `clerk_id` to link our database user with Clerk's user

## Testing

You can test the OAuth implementation by:

1. Visiting the homepage and clicking on the sign-in button
2. Selecting either Google or Facebook sign-in
3. Completing the OAuth flow on the provider's site
4. Being redirected back to our application

There's also a test page available at `/oauth-test` to verify the callback functionality.

## Troubleshooting

If you encounter issues with OAuth authentication:

1. Check the Clerk dashboard settings for the OAuth providers
2. Verify the correct redirect URLs are configured
3. Check browser console logs for any errors
4. Ensure all environment variables are properly set

## Environment Variables

The following environment variables are required:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

For production, you'll need to configure the OAuth providers in the Clerk dashboard with appropriate credentials.
