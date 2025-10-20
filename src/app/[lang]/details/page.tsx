import MyDetails from "@/screens/DetailsScreen";
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
    title: dictionary.metadata.details.title,
    description: dictionary.metadata.details.subTitle,
  };
}

export default async function DetailsPage({ params }: PageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
  return <MyDetails dictionary={dictionary} />;
}
