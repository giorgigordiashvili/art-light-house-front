import HomeScreen from "@/screens/HomeScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import { Metadata } from "next";

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

  return <HomeScreen dictionary={dictionary} />;
}
