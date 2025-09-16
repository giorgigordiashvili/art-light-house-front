import { NextRequest, NextResponse } from "next/server";
import { i18n } from "@/config/i18n";

// Always use the configured app default locale (Georgian)
function getLocale(_request: NextRequest): string {
  // Mark parameter as intentionally unused to satisfy lint rules
  void _request;
  return i18n.defaultLocale; // "ge"
}

// Internationalization middleware for routing
export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for specific paths
  if (
    ["/manifest.json", "/favicon.ico", "/robots.txt", "/sitemap.xml", "/api-spec.json"].includes(
      pathname
    ) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/.netlify/") ||
    pathname.startsWith("/dictionaries/") ||
    pathname.includes("/api-docs") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if pathname has a locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    const url = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
