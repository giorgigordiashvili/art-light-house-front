import Success from "@/screens/SuccsessOrderScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export default async function SuccessPage(props: { params: { lang: string } }) {
  const { lang } = props.params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
  return <Success dictionary={dictionary} />;
}
