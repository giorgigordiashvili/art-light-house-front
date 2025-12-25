export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Art Light House",
    url: "https://artlighthouse.ge/",
    description:
      "Art Light House is a premium ecommerce destination offering elegant chandeliers, modern lighting solutions, stylish furniture, and decorative accessories for every home.",
    publisher: {
      "@type": "Organization",
      name: "Art Light House",
      logo: {
        "@type": "ImageObject",
        url: "https://artlighthouse.ge/assets/icons/logo.png",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://artlighthouse.ge/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <title>Art Light House</title>
        <meta name="description" content="Art Light House - Premium lighting solutions" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body>{children}</body>
    </html>
  );
}

export const metadata = {
  title: "Art Light House",
  description: "This is Art Light House shop website",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};
