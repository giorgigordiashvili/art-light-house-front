# Art Light House Frontend

This is the frontend application for Art Light House, built with Next.js and using Clerk for authentication.

## Authentication Setup

The application uses [Clerk](https://clerk.com/) for authentication, which provides:

- Email/password authentication
- Social login (Google, Facebook)
- Password reset functionality
- User profile management

### Environment Variables

To run the application with authentication, you need to set up the following environment variables:

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
DATABASE_URL=your_postgresql_database_url

# If using webhooks (recommended)
CLERK_WEBHOOK_SECRET=your_webhook_secret_key
```

### User Data Storage

By default, user data is stored in Clerk's database, not in your PostgreSQL database. If you want to sync user data to your database, you can use the webhook functionality provided in `/src/app/api/webhooks/clerk/route.ts`.

### Setting Up Social Login

To enable social login with Google and Facebook:

1. Go to the [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to User & Authentication > Social Connections
3. Configure the Google and Facebook providers with appropriate OAuth credentials

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at http://localhost:3000.

## Application Structure

- `src/app` - Next.js app router pages
- `src/components` - React components
- `src/middleware.ts` - Authentication middleware for protected routes

## Custom Authentication UI

The application uses custom-designed UI components for authentication instead of Clerk's pre-built components. The main authentication components are:

- `AuthorizationModal.tsx` - The main authentication modal for sign-in and sign-up
- `UserMenu.tsx` - User menu displayed when signed in
- `sso-callback` - Handles redirects from social login providers
