# Art Light House

This is the front-end repository for Art Light House, a modern e-commerce platform for premium lighting solutions built with Next.js and Clerk authentication.

## Project Documentation

- [OAuth Implementation](./OAUTH_README.md) - Details on social login integration
- [Database Setup](./DATABASE_README.md) - PostgreSQL and Prisma configuration
- [Netlify Deployment Guide](./NETLIFY_DEPLOY.md) - How to deploy to Netlify
- [Clerk Troubleshooting](./CLERK_TROUBLESHOOTING.md) - Solving common Clerk issues
- [Image Loading Fixes](./CLERK_IMAGE_FIX.md) - Solutions for image loading issues

## Recent Updates

- Fixed 404 errors for missing images in CategorySection
- Resolved 400 Bad Request errors for Clerk images by adding additional domains to Next.js config
- Updated OAuth implementation with better error handling
- Enhanced deployment documentation

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
