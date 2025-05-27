import React from "react";
import CartScreen from "@/screens/CartScreen";
import { getDictionary } from "@/config/get-dictionary";

export default async function Page({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(lang);
  return <CartScreen dictionary={dictionary} />;
}
