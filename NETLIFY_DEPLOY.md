# Netlify Deployment Guide

This guide explains how to deploy the application to Netlify with proper Prisma configuration.

## Deployment Configuration

The application is configured to automatically generate the Prisma client during the Netlify build process, addressing the issues with Netlify's dependency caching.

### Key Configuration Files

1. **package.json**: Contains the build scripts that ensure Prisma client is generated

   - `"build": "prisma generate && next build && ./scripts/prisma-postbuild.sh"` - Generates Prisma client before the Next.js build and copies binaries
   - `"postinstall": "prisma generate"` - Ensures Prisma client is generated after npm install

2. **netlify.toml**: Configures the Netlify build process

   - Sets up the Next.js plugin for proper handling of Next.js applications

3. **scripts/prisma-postbuild.sh**: Ensures Prisma binaries are properly included in the build
   - Copies Prisma engine binaries to the build output directory
   - Runs automatically as part of the build process

## Environment Variables

Make sure to set the following environment variables in the Netlify dashboard:

- `DATABASE_URL`: Your PostgreSQL database connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key
- `CLERK_WEBHOOK_SECRET`: Your Clerk webhook secret (if using webhooks)

## Deployment Steps

1. Push your code to your GitHub repository
2. Connect Netlify to your GitHub repository
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add the required environment variables
5. Deploy!

## Troubleshooting

### Prisma Issues

If you encounter issues with Prisma during deployment:

1. **Error: Prisma has detected that this project was built on Netlify CI**
   - This error should be resolved by our configuration changes
   - If it persists, ensure the `prisma generate` command is properly running during build

### Image Loading Issues

If you encounter image loading issues after deployment:

1. **404 Errors for missing images**

   - Check the browser console for specific paths causing 404 errors
   - Ensure all referenced image paths in components match the actual file paths in `/public/assets`
   - Verify that placeholder paths like `/path/to/image.png` have been replaced with actual image paths

2. **Clerk Image 400 Bad Request Errors**

   - Make sure all Clerk domains are properly configured in `next.config.ts`
   - The configuration already includes: `img.clerk.com`, `images.clerk.dev`, `cdn.clerk.dev`, and `cdn.clerk.app`
   - If you see 400 errors for other domains, add them to the configuration
   - See `CLERK_IMAGE_FIX.md` for detailed information about fixing Clerk image issues

3. **Database connectivity issues**

   - Ensure your database URL is correctly set in the environment variables
   - Check that your database is accessible from Netlify's servers

4. **Prisma binary issues**
   - Our custom post-build script should handle copying the necessary binaries to the build output
   - If you encounter errors about missing binaries, check the Netlify deploy logs for more details
5. **Clerk CAPTCHA errors**
   - If you see errors about "Cannot initialize Smart CAPTCHA widget", make sure the `clerk-captcha` DOM element exists in the layout
   - We've added this element in both the root layout and the SSO callback page to ensure proper CAPTCHA rendering
