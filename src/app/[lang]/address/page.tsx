import React from "react";
import AddressScreen from "@/screens/AddressScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export default async function Address(props: { params: { lang: string } }) {
  const { lang } = props.params;

  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");

  return <AddressScreen dictionary={dictionary} />;
}
