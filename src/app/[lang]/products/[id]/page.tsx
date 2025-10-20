import ProductDetailScreen from "@/screens/ProductDetailScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import type { Metadata } from "next";
import axios from "axios";

interface ProductDetailsPageProps {
  params: Promise<{ lang: string; id: string }>;
}

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export async function generateMetadata({ params }: ProductDetailsPageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const productId = parseInt(id, 10);

  // Map 'ge' to 'ka' for backend API
  const apiLang = lang === "en" ? "en" : "ka";

  try {
    // Fetch product data for both languages
    const geResponse = await axios.get(
      `https://testapi.artlighthouse.ge/api/products/${productId}/`,
      {
        headers: {
          "Accept-Language": "ka",
        },
      }
    );

    const enResponse = await axios.get(
      `https://testapi.artlighthouse.ge/api/products/${productId}/`,
      {
        headers: {
          "Accept-Language": "en",
        },
      }
    );

    const geProduct = geResponse.data;
    const enProduct = enResponse.data;

    // Use current language for title, but include both in description
    const currentProduct = apiLang === "ka" ? geProduct : enProduct;
    const title = `${currentProduct.title} - Art Lighthouse`;

    // Create bilingual description
    const description =
      lang === "ge"
        ? geProduct.description || geProduct.meta_description
        : enProduct.description || enProduct.meta_description;

    return {
      title,
      description,
    };
  } catch {
    // Fallback metadata if product fetch fails
    return {
      title: "Product Details - Art Lighthouse",
      description: "View product details.",
    };
  }
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
  const productId = parseInt(id, 10);

  return <ProductDetailScreen dictionary={dictionary} productId={productId} />;
}
