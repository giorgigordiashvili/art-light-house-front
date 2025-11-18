import HomeScreen from "@/screens/HomeScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import { Metadata } from "next";
import { ecommerceClientHomepageList } from "@/api/generated/api";
import type { HomepageSection } from "@/types/homepage";

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

  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");

  // Fetch homepage sections server-side
  let homepageSections: HomepageSection[] = [];
  try {
    const response = await ecommerceClientHomepageList();
    // Handle both array and wrapped response formats
    if (Array.isArray(response)) {
      homepageSections = response as unknown as HomepageSection[];
    } else {
      const wrappedResponse = response as unknown as { sections: HomepageSection[] };
      homepageSections = wrappedResponse.sections || [];
    }
  } catch (error) {
    console.error("Failed to fetch homepage sections:", error);
  }

  return <HomeScreen dictionary={dictionary} homepageSections={homepageSections} />;
}
