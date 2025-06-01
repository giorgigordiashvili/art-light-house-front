import Checkout from "@/screens/CheckoutScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import { PageProps } from "@/models/lang.model";

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export default async function CheckoutPage({ params }: PageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
  return <Checkout dictionary={dictionary} />;
}
