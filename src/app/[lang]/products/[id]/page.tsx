import ProductDetailScreen from "@/screens/ProductDetailScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import type { Metadata } from "next";
import axios from "axios";
import { fetchServerProductDetail } from "@/api/server-product-detail";

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
    // Fetch only in current language to reduce overhead
    const response = await axios.get(
      `https://testapi.artlighthouse.ge/api/products/${productId}/`,
      {
        headers: {
          "Accept-Language": resolvedLang === "ge" ? "ka" : "en",
        },
      }
    );
    const product = response.data || {};
    // Prefer localized name, fallback to title, then slug
    const rawTitle = product.name || product.title || product.slug || "Product";
    // Localize brand suffix (simple Georgian variant)
    const brandSuffix = resolvedLang === "ge" ? "არტ Lighthouse" : "Art Lighthouse";
    const title = `${rawTitle} - ${brandSuffix}`;
    const description =
      product.meta_description ||
      product.short_description ||
      product.description ||
      "Product details";
    return { title, description };
  } catch {
    return {
      title:
        resolvedLang === "ge"
          ? "პროდუქტის დეტალები - არტ Lighthouse"
          : "Product Details - Art Lighthouse",
      description: resolvedLang === "ge" ? "ნახეთ პროდუქტის დეტალები." : "View product details.",
    };
  }
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { lang, id } = await params;
  const resolvedLang = isLocale(lang) ? lang : "ge";
  const dictionary = await getDictionary(resolvedLang);
  const productId = parseInt(id, 10);
  const { product, error } = await fetchServerProductDetail(resolvedLang, productId);
  return (
    <ProductDetailScreen dictionary={dictionary} initialProduct={product} initialError={error} />
  );
}
