import { ReactNode } from "react";
import { getDictionary, Dictionary } from "@/config/get-dictionary"; // Your updated path
import { i18n, Locale } from "@/config/i18n";
import { SITE_URL, SITE_NAME, safeJsonLd, toHtmlLang } from "@/lib/seo";
import ClientRootLayout from "./client-root-layout";

interface ServerRootLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

// Static params for pre-rendering each locale
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function ServerRootLayout({ children, params }: ServerRootLayoutProps) {
  const { lang } = await params;
  // Make sure lang is a valid locale
  const validLang: Locale = lang === "ge" || lang === "en" ? lang : "ge";
  const dictionary: Dictionary = await getDictionary(validLang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Art Light House is a premium ecommerce destination offering elegant chandeliers, modern lighting solutions, stylish furniture, and decorative accessories for every home.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon-512.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/${validLang}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={toHtmlLang(validLang)}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      </head>
      <body>
        <ClientRootLayout lang={validLang} dictionary={dictionary}>
          {children}
        </ClientRootLayout>
      </body>
    </html>
  );
}
