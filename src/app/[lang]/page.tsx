import HomeScreen from "@/screens/HomeScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export default async function HomePage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");

  return <HomeScreen dictionary={dictionary} />;
}
