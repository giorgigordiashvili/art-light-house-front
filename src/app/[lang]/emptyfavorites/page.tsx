"server only";
import React from "react";
import EmptyFavoritesScreen from "@/screens/EmptyFavoritesScreen";
import { getDictionary } from "@/config/get-dictionary";

export default async function page(props: { params: { lang: string } }) {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);
  return <EmptyFavoritesScreen dictionary={dictionary} />;
}
