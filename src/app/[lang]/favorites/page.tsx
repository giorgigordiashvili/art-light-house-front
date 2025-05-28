import React from "react";
import FavoritesScreen from "@/screens/FavoritesScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export default async function Page({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
  return <FavoritesScreen dictionary={dictionary} />;
}
