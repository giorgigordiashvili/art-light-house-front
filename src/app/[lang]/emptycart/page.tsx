import React from "react";
import EmptyCartScreen from "@/screens/EmptyCartScreen";
import { getDictionary } from "@/config/get-dictionary";

export default async function page(props: { params: { lang: string } }) {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);
  return <EmptyCartScreen dictionary={dictionary} />;
}
