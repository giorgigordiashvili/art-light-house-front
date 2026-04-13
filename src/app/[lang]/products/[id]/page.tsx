import ProductDetailScreen from "@/screens/ProductDetailScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import type { Metadata } from "next";
import { fetchServerProductDetail } from "@/api/server-product-detail";
import { buildSeoMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";

interface ProductDetailsPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export const revalidate = 60; // ISR: regenerate product detail every 60s

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export async function generateMetadata({ params }: ProductDetailsPageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const productId = parseInt(id, 10);
  const resolvedLang = isLocale(lang) ? lang : "ge";

  try {
    const { product } = await fetchServerProductDetail(resolvedLang, productId);
    if (product) {
      const rawName =
        typeof product.name === "string"
          ? product.name
          : product.name?.[resolvedLang === "ge" ? "ka" : "en"] ||
            product.name?.ka ||
            product.name?.en ||
            "Product";

      const brandSuffix = resolvedLang === "ge" ? "არტ Lighthouse" : "Art Lighthouse";
      const title = `${rawName} - ${brandSuffix}`;
      const description =
        product.meta_description ||
        product.short_description ||
        (typeof product.description === "string"
          ? product.description.replace(/<[^>]*>/g, "").slice(0, 160)
          : "") ||
        "Product details";

      // Pick the best product image for OG
      const ogImage =
        product.image || (product.images?.length > 0 ? product.images[0].image : undefined);

      const metadata = buildSeoMetadata({
        title,
        description: typeof description === "string" ? description : String(description),
        locale: resolvedLang,
        pathname: `/products/${id}`,
        ogImage,
        ogType: "website",
      });

      // Enhance OG with product-specific fields
      if (metadata.openGraph && typeof metadata.openGraph === "object") {
        const images = ogImage
          ? [
              {
                url: ogImage,
                width: 800,
                height: 800,
                alt: rawName,
              },
            ]
          : undefined;

        metadata.openGraph = {
          ...metadata.openGraph,
          ...(images ? { images } : {}),
        };
      }

      return metadata;
    }
  } catch {
    // Fall through to fallback
  }

  return buildSeoMetadata({
    title:
      resolvedLang === "ge"
        ? "პროდუქტის დეტალები - არტ Lighthouse"
        : "Product Details - Art Lighthouse",
    description: resolvedLang === "ge" ? "ნახეთ პროდუქტის დეტალები." : "View product details.",
    locale: resolvedLang,
    pathname: `/products/${id}`,
  });
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { lang, id } = await params;
  const resolvedLang = isLocale(lang) ? lang : "ge";
  const dictionary = await getDictionary(resolvedLang);
  const productId = parseInt(id, 10);
  const { product, error } = await fetchServerProductDetail(resolvedLang, productId);

  // Build Product JSON-LD structured data
  let productJsonLd: object | null = null;
  if (product) {
    const rawName =
      typeof product.name === "string"
        ? product.name
        : product.name?.[resolvedLang === "ge" ? "ka" : "en"] ||
          product.name?.ka ||
          product.name?.en ||
          "Product";

    const productImage =
      product.image || (product.images?.length > 0 ? product.images[0].image : undefined);

    const allImages = product.images?.map((img) => img.image).filter(Boolean) || [];
    if (product.image && !allImages.includes(product.image)) {
      allImages.unshift(product.image);
    }

    productJsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: rawName,
      description:
        product.meta_description ||
        product.short_description ||
        (typeof product.description === "string"
          ? product.description.replace(/<[^>]*>/g, "").slice(0, 300)
          : ""),
      image: allImages.length > 0 ? allImages : productImage,
      sku: product.sku,
      url: `${SITE_URL}/${resolvedLang}/products/${id}`,
      brand: {
        "@type": "Organization",
        name: SITE_NAME,
      },
      offers: {
        "@type": "Offer",
        url: `${SITE_URL}/${resolvedLang}/products/${id}`,
        priceCurrency: "GEL",
        price: product.price,
        availability: product.is_in_stock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        ...(product.compare_at_price
          ? {
              priceSpecification: {
                "@type": "PriceSpecification",
                price: product.compare_at_price,
                priceCurrency: "GEL",
              },
            }
          : {}),
      },
      ...(product.average_rating && parseFloat(product.average_rating) > 0
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.average_rating,
              reviewCount: product.review_count || "1",
            },
          }
        : {}),
    };
  }

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <ProductDetailScreen dictionary={dictionary} initialProduct={product} initialError={error} />
    </>
  );
}
