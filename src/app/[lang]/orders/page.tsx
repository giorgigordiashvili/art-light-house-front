import OrdersScreen from "@/screens/OrdersScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export default async function OrdersPage(props: { params: { lang: string } }) {
  const { lang } = props.params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
  return <OrdersScreen dictionary={dictionary} />;
}
