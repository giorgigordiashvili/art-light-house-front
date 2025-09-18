import ProductDetailScreen from "@/screens/ProductDetailScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";

interface ProductDetailsPageProps {
  params: Promise<{ lang: string; id: string }>;
}

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
  const productId = parseInt(id, 10);

  return <ProductDetailScreen dictionary={dictionary} productId={productId} />;
}
