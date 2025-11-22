import HomeScreen from "@/screens/HomeScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import { Metadata } from "next";
import { ecommerceClientHomepageList } from "@/api/generated/api";
import type { HomepageSection } from "@/types/homepage";
import { fetchServerFeaturedProducts } from "@/api/products";
import type { ProductList } from "@/api/generated/interfaces";

// Revalidate the homepage every 60 seconds
export const revalidate = 60;

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  const locale = isLocale(lang) ? lang : "ge";

  // Get metadata translations from dictionary
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.metadata.main.title,
    description: dictionary.metadata.main.subTitle,
  };
}

export default async function HomePage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const locale = isLocale(lang) ? lang : "ge";

  const dictionary = await getDictionary(locale);

  // Fetch homepage sections and featured products server-side in parallel
  let homepageSections: HomepageSection[] = [];
  let featuredProducts: ProductList[] = [];

  try {
    const [sectionsResponse, featuredResponse] = await Promise.all([
      ecommerceClientHomepageList(),
      fetchServerFeaturedProducts(),
    ]);

    // Handle sections response
    if (Array.isArray(sectionsResponse)) {
      homepageSections = sectionsResponse as unknown as HomepageSection[];
    } else {
      const wrappedResponse = sectionsResponse as unknown as { sections: HomepageSection[] };
      homepageSections = wrappedResponse.sections || [];
    }

    // Handle featured products response
    featuredProducts = featuredResponse.results || [];
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
  }

  return (
    <HomeScreen
      dictionary={dictionary}
      homepageSections={homepageSections}
      lang={locale}
      initialFeaturedProducts={featuredProducts}
    />
  );
}
