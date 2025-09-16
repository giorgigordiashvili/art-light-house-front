import ProductDetailScreen from "@/screens/ProductDetailScreen";
import { ProductService } from "@/lib/productService";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import { PageProps } from "@/models/lang.model";

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { lang, id } = (await params) as any;
  const locale = isLocale(lang) ? lang : "ge";
  const dictionary = await getDictionary(locale);
  // Normalize locale for API (ge -> ka)
  const apiLang = locale === "ge" ? "ka" : locale;
  let product = null;
  try {
    product = await ProductService.getProductById({ id, language: apiLang as any });
  } catch {
    // swallow; product will be null and client can show fallback
  }
  return <ProductDetailScreen dictionary={dictionary} product={product} />;
}
