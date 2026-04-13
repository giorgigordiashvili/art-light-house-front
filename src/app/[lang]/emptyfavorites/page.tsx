import React from "react";
import EmptyFavoritesScreen from "@/screens/EmptyFavoritesScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import { PageProps } from "@/models/lang.model";
import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo";

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "ge";
  return buildSeoMetadata({
    title: locale === "ge" ? "ფავორიტები ცარიელია" : "Favorites is Empty",
    description:
      locale === "ge" ? "თქვენი ფავორიტების სია ცარიელია." : "Your favorites list is empty.",
    locale,
    pathname: "/emptyfavorites",
    noIndex: true,
  });
}

export default async function EmptyFavoritesPage({ params }: PageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
  return <EmptyFavoritesScreen dictionary={dictionary} />;
}
