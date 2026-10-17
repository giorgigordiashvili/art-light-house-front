import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Art Light House – premium chandeliers, modern lighting solutions, stylish furniture and decorative accessories.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ka",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// The <html>/<body> shell lives in app/[lang]/layout.tsx so it can set the
// correct `lang` attribute per locale. This root layout only provides metadata.
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
