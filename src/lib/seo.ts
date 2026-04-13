import type { Metadata } from "next";
import { i18n, Locale } from "@/config/i18n";

export const SITE_URL = "https://artlighthouse.ge";
export const SITE_NAME = "Art Light House";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/favicon.png`;

/**
 * Map front-end locale codes to BCP-47 hreflang codes.
 * "ge" is our Georgian locale key; Google expects "ka" for Georgian.
 */
const HREFLANG_MAP: Record<string, string> = {
  ge: "ka",
  en: "en",
};

interface SeoMetadataOptions {
  title: string;
  description: string;
  locale: Locale;
  /** Path without leading locale segment, e.g. "/products" or "/products/123" */
  pathname: string;
  /** Override the default OG image */
  ogImage?: string;
  /** OG type — Next.js metadata only supports "website" | "article" */
  ogType?: "website" | "article";
  /** Prevent indexing (e.g. for account pages) */
  noIndex?: boolean;
}

/**
 * Build a full Metadata object with OG, Twitter, canonical, and hreflang alternates.
 */
export function buildSeoMetadata({
  title,
  description,
  locale,
  pathname,
  ogImage,
  ogType = "website",
  noIndex = false,
}: SeoMetadataOptions): Metadata {
  const canonicalUrl = `${SITE_URL}/${locale}${pathname}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  // Build hreflang alternates for all locales + x-default
  const languages: Record<string, string> = {};
  for (const loc of i18n.locales) {
    const hreflang = HREFLANG_MAP[loc] || loc;
    languages[hreflang] = `${SITE_URL}/${loc}${pathname}`;
  }
  languages["x-default"] = `${SITE_URL}/${i18n.defaultLocale}${pathname}`;

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: ogType,
      locale: HREFLANG_MAP[locale] || locale,
      images: [
        {
          url: image,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };

  if (noIndex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}
