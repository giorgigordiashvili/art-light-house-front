import React from "react";
import EmptyCartScreen from "@/screens/EmptyCartScreen";
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
    title: locale === "ge" ? "კალათა ცარიელია" : "Cart is Empty",
    description:
      locale === "ge"
        ? "თქვენი კალათა ცარიელია. დაამატეთ პროდუქტები."
        : "Your cart is empty. Add products to continue.",
    locale,
    pathname: "/emptycart",
    noIndex: true,
  });
}

export default async function EmptyCartPage({ params }: PageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
  return <EmptyCartScreen dictionary={dictionary} />;
}
