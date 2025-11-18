import ContactScreen from "@/screens/ContactScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import { PageProps } from "@/models/lang.model";
import type { Metadata } from "next";
import { ecommerceClientHomepageList } from "@/api/generated/api";
import type { HomepageSection } from "@/types/homepage";

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");

  return {
    title: dictionary.metadata.contact.title,
    description: dictionary.metadata.contact.subTitle,
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "ge";
  const dictionary = await getDictionary(locale);

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

  return (
    <ContactScreen dictionary={dictionary} homepageSections={homepageSections} lang={locale} />
  );
}
