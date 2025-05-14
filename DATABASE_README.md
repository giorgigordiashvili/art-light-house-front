# Database Setup for Clerk Authentication

This document explains how the database is structured to work with Clerk authentication.

## Database Schema

We use PostgreSQL with Prisma ORM to manage our database. The schema includes:

```prisma
model User {
  id        String   @id @default(uuid())
  clerk_id  String   @unique
  email     String?
  name      String?
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}
```

## How it works

1. When a user signs up or logs in via Clerk, their information is synchronized to our PostgreSQL database via webhooks
2. The webhook handlers in `/src/app/api/webhooks/clerk/route.ts` process user events:

   - `user.created`: Creates a new user in our database
   - `user.updated`: Updates user information
   - `user.deleted`: Removes the user from our database

3. User data is stored with the following fields:
   - `id`: Database primary key (UUID)
   - `clerk_id`: Unique identifier from Clerk
   - `email`: User's email address
   - `name`: User's display name
   - `created_at`: When the user was created
   - `updated_at`: When the user was last updated

## Setting up the Webhook

To use the webhook sync functionality:

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Webhooks** in the sidebar
3. Create a new webhook endpoint with URL: `https://your-domain.com/api/webhooks/clerk`
4. Add the following events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy the signing secret and add it to your `.env` file as `CLERK_WEBHOOK_SECRET`

## Testing the Setup

You can test if the database integration is working by:

1. Visit `/api/test-user` to create a test user and verify database connectivity
2. Sign up with a new account in your application
3. Check your database to confirm the user was created

## Utility Functions

The `/src/lib/user-service.ts` file provides utility functions for working with users:

- `createOrUpdateUser`: Creates or updates a user in the database
- `getUserByClerkId`: Fetches a user by their Clerk ID
- `deleteUserByClerkId`: Deletes a user by their Clerk ID
