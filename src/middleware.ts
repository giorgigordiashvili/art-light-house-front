import { authMiddleware } from "@clerk/nextjs";

// This middleware handles authentication for all routes
// We specifically ensure that the SSO callback route is properly handled
export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/", // Homepage
    "/products(.*)", // Product pages
    "/details(.*)", // Product details
    "/contact", // Contact page
    "/sso-callback(.*)", // SSO callback route - important for OAuth!
    "/api/webhooks/clerk(.*)", // Clerk webhooks
    "/oauth-test", // OAuth test page
    "/(icons|assets|images)/(.*)", // Public assets
  ],
  // Debug OAuth issues in development
  debug: process.env.NODE_ENV === "development",
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
