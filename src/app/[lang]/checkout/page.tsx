import Checkout from "@/screens/CheckoutScreen";
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
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");

  const locale = isLocale(lang) ? lang : "ge";
  return buildSeoMetadata({
    title: dictionary.metadata.checkout.title,
    description: dictionary.metadata.checkout.subTitle,
    locale,
    pathname: "/checkout",
    noIndex: true,
  });
}

export default async function CheckoutPage({ params }: PageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
  return <Checkout dictionary={dictionary} />;
}
