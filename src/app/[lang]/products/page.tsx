import ProductsScreen from "@/screens/ProductsScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import { PageProps } from "@/models/lang.model";
import type { Metadata } from "next";
import { fetchServerProducts, fetchServerAttributes, ProductQueryParams } from "@/api/products";

// Revalidate this page every 60 seconds
export const revalidate = 60;

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");

  return {
    title: dictionary.metadata.products.title,
    description: dictionary.metadata.products.subTitle,
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
  const search = await searchParams;

  // Build query parameters from URL search params
  const queryParams: ProductQueryParams = {};

  // Handle pagination
  if (search.page) {
    queryParams.page = typeof search.page === "string" ? parseInt(search.page, 10) : 1;
  }

  // Handle ordering
  if (search.ordering && typeof search.ordering === "string") {
    queryParams.ordering = search.ordering;
  }

  // Handle search
  if (search.search && typeof search.search === "string") {
    queryParams.search = search.search;
  }

  // Handle price filters
  if (search.min_price && typeof search.min_price === "string") {
    queryParams.min_price = parseFloat(search.min_price);
  }
  if (search.max_price && typeof search.max_price === "string") {
    queryParams.max_price = parseFloat(search.max_price);
  }

  // Handle on_sale filter
  if (search.on_sale === "true") {
    queryParams.on_sale = true;
  }

  // Handle attribute filters (attr_* parameters)
  Object.entries(search).forEach(([key, value]) => {
    if (key.startsWith("attr_") && typeof value === "string") {
      queryParams[key] = value;
    }
  });

  // Fetch products and attributes server-side in parallel
  const [initialProductsData, initialAttributes] = await Promise.all([
    fetchServerProducts(queryParams).catch((error) => {
      console.error("Failed to fetch products server-side:", error);
      return null;
    }),
    fetchServerAttributes().catch((error) => {
      console.error("Failed to fetch attributes server-side:", error);
      return null;
    }),
  ]);

  return (
    <ProductsScreen
      dictionary={dictionary}
      initialProductsData={initialProductsData}
      initialAttributes={initialAttributes}
      initialPage={queryParams.page as number | undefined}
    />
  );
}
