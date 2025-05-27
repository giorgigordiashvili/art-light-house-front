import React from "react";
import FavoritesScreen from "@/screens/FavoritesScreen";
import { getDictionary } from "@/config/get-dictionary";

export default async function Page({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(lang);
  return <FavoritesScreen dictionary={dictionary} />;
}
