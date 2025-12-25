import ProductsScreen from "@/screens/ProductsScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import { PageProps } from "@/models/lang.model";
import type { Metadata } from "next";
import { fetchServerProducts, fetchServerAttributes, ProductQueryParams } from "@/api/products";
import type { AttributeDefinition } from "@/api/generated/interfaces";

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

  // Fetch attributes first to support mapping to attr_* query keys
  const initialAttributes: AttributeDefinition[] | null = await fetchServerAttributes().catch(
    (error) => {
      console.error("Failed to fetch attributes server-side:", error);
      return null;
    }
  );

  // Build query parameters from URL search params
  const queryParams: ProductQueryParams = {};

  // Pagination
  if (search.page) {
    queryParams.page = typeof search.page === "string" ? parseInt(search.page, 10) : 1;
  }

  // Ordering
  if (search.ordering && typeof search.ordering === "string") {
    queryParams.ordering = search.ordering;
  }

  // Search
  if (search.search && typeof search.search === "string") {
    queryParams.search = search.search;
  }

  // Price filters (support snake_case and camelCase)
  const minPriceRaw =
    (search.min_price as string | undefined) || (search.minPrice as string | undefined);
  const maxPriceRaw =
    (search.max_price as string | undefined) || (search.maxPrice as string | undefined);
  if (typeof minPriceRaw === "string") {
    queryParams.min_price = parseFloat(minPriceRaw);
  }
  if (typeof maxPriceRaw === "string") {
    queryParams.max_price = parseFloat(maxPriceRaw);
  }

  // On sale
  if (search.on_sale === "true") {
    queryParams.on_sale = true;
  }

  // Collect existing attr_* parameters directly
  Object.entries(search).forEach(([key, value]) => {
    if (key.startsWith("attr_") && typeof value === "string") {
      queryParams[key] = value;
    }
  });

  // Map categories param (e.g., "color:red,category:12") into attr_* keys
  if (typeof search.categories === "string" && search.categories.trim().length > 0) {
    const entries = search.categories
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    const attrAccumulator = new Map<string, Set<string>>();

    const addAttr = (key: string, value: string) => {
      const acc = attrAccumulator.get(key) || new Set<string>();
      acc.add(value);
      attrAccumulator.set(key, acc);
    };

    for (const entry of entries) {
      const [attributeKey, value] = entry.split(":");
      if (attributeKey && value) {
        addAttr(attributeKey, value);
      }
    }

    for (const [key, values] of attrAccumulator.entries()) {
      queryParams[`attr_${key}`] = Array.from(values).join(",");
    }
  }

  // Map attributes param (e.g., "123:red,124:large") into attr_* using definitions
  if (typeof search.attributes === "string" && search.attributes.trim().length > 0) {
    const pairs = search.attributes
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const attrAccumulator = new Map<string, Set<string>>();

    const addAttr = (key: string, value: string) => {
      const acc = attrAccumulator.get(key) || new Set<string>();
      acc.add(value);
      attrAccumulator.set(key, acc);
    };

    const defById = new Map<number, AttributeDefinition>();
    (initialAttributes || []).forEach((def) => defById.set(def.id, def));

    for (const pair of pairs) {
      const [idStr, value] = pair.split(":");
      const id = Number(idStr);
      if (!Number.isFinite(id) || !value) continue;
      const def = defById.get(id);
      const key = def?.key || `attribute-${id}`;
      addAttr(key, value);
    }

    for (const [key, values] of attrAccumulator.entries()) {
      queryParams[`attr_${key}`] = Array.from(values).join(",");
    }
  }

  // Finally fetch products with server-side ISR
  const initialProductsData = await fetchServerProducts(queryParams).catch((error) => {
    console.error("Failed to fetch products server-side:", error);
    return null;
  });

  return (
    <ProductsScreen
      dictionary={dictionary}
      initialProductsData={initialProductsData}
      initialAttributes={initialAttributes}
      initialPage={queryParams.page as number | undefined}
    />
  );
}
