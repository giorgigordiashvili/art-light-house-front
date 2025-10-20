import SettingsScreen from "@/screens/SettingsScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import { PageProps } from "@/models/lang.model";
import type { Metadata } from "next";

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");

  return {
    title: dictionary.metadata.settings.title,
    description: dictionary.metadata.settings.subTitle,
  };
}

export default async function SettingPage({ params }: PageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
  return <SettingsScreen dictionary={dictionary} />;
}
