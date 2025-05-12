# Clerk Authentication Troubleshooting Guide

This guide addresses common issues that may arise with Clerk authentication implementation in this application.

## CAPTCHA and Bot Protection

### Issue: CAPTCHA Widget Not Found

```
Cannot initialize Smart CAPTCHA widget because the `clerk-captcha` DOM element was not found; falling back to Invisible CAPTCHA widget.
```

#### Solution:

1. Make sure there's a div with `id="clerk-captcha"` in your layout or authentication pages
2. We've added this element in both:
   - Root layout (`/src/app/layout.tsx`)
   - SSO callback page (`/src/app/sso-callback/page.tsx`)

### Why This Happens:

Clerk uses CAPTCHA for bot protection during authentication flows. It needs a DOM element with the ID "clerk-captcha" to mount the CAPTCHA widget. If it can't find this element, it falls back to an invisible CAPTCHA, which may cause issues or warnings.

## OAuth Redirect Issues

### Issue: 400 Bad Request on OAuth Image Loading

```
GET https://your-app.netlify.app/_next/image?url=https%3A%2F%2Fimages.clerk.dev%2Foauth_google%2F... 400 (Bad Request)
```

#### Solution:

1. Ensure your Next.js configuration properly handles Clerk's image domains
2. The following domains should be configured in `next.config.ts`:
   ```javascript
   images: {
     remotePatterns: [
       {
         protocol: 'https',
         hostname: 'img.clerk.com',
         pathname: '**',
       },
       {
         protocol: 'https',
         hostname: 'images.clerk.dev',
         pathname: '**',
       },
       {
         protocol: 'https',
         hostname: 'cdn.clerk.dev',
         pathname: '**',
       },
       {
         protocol: 'https',
         hostname: 'cdn.clerk.app',
         pathname: '**',
       }
     ],
   },
   ```
3. Check the browser console after deployment to identify if any additional domains need to be added
4. See detailed solution in `CLERK_IMAGE_FIX.md`

## Authentication Flow Errors

### Issue: OAuth Flow Fails After Redirect

#### Solution:

1. Check that your OAuth providers are correctly configured in the Clerk Dashboard
2. Verify that the redirect URLs match exactly what's in your code
3. Ensure your environment variables (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`) are correctly set
4. Check the browser console for specific error messages

## Webhook Handling

### Issue: User Data Not Syncing with Database

#### Solution:

1. Verify that the webhook URL is correctly set up in the Clerk Dashboard
2. Ensure the `CLERK_WEBHOOK_SECRET` environment variable is set correctly
3. Check your webhook handler logs for any errors
4. Test the webhook using Clerk's webhook testing tool in their dashboard

## General Clerk Best Practices

1. **Keep Dependencies Updated**: Ensure you're using the latest version of `@clerk/nextjs`
2. **Environment-Specific Keys**: Use different Clerk keys for development and production
3. **Error Handling**: Always implement robust error handling in authentication flows
4. **Limit Webhook Events**: Subscribe only to the webhook events you need to improve performance
5. **Custom Flow Documentation**: Refer to [Clerk's documentation on custom flows](https://clerk.com/docs/custom-flows/bot-sign-up-protection) for advanced scenarios

Remember that the CAPTCHA and bot protection features are important security measures in Clerk. Always ensure they're properly implemented rather than trying to bypass them.
