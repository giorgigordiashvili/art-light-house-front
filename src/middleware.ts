import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "@/config/i18n";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default clerkMiddleware();

function getLocale(request: NextRequest): string {
  // Check if there's already a locale in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = i18n.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    return pathnameLocale;
  }

  // Get locale from referrer if it exists
  const referrer = request.headers.get("referer");
  if (referrer) {
    const referrerUrl = new URL(referrer);
    const referrerLocale = i18n.locales.find(
      (locale) =>
        referrerUrl.pathname.startsWith(`/${locale}/`) || referrerUrl.pathname === `/${locale}`
    );
    if (referrerLocale) {
      return referrerLocale;
    }
  }

  return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    [
      "/manifest.json",
      "/favicon.ico",
      "/robots.txt",
      "/sitemap.xml",
      "/admin", // Add admin to the exempted paths
      "/api-spec.json", // Add API spec file
      // Add other files in `public` as needed
    ].includes(pathname) ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/admin/") || // Also exempt all paths under /admin/
    pathname.startsWith("/api/") || // Exempt all API routes
    pathname.startsWith("/.netlify/") || // Exempt Netlify functionality paths
    pathname.startsWith("/dictionaries/") || // Exempt dictionaries folder
    pathname.includes("/api-docs") // Exempt API documentation pages
  ) {
    return;
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /ge/products
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
