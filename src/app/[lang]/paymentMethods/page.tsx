import PaymentMethodsScreen from "@/screens/PaymentMethodsScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import { PageProps } from "@/models/lang.model";
import type { Metadata } from "next";

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");

  return {
    title: dictionary.paymentMethods.title,
    description: dictionary.paymentMethods.title,
  };
}

export default async function PaymentMethods({ params }: PageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");

  return <PaymentMethodsScreen dictionary={dictionary} />;
}
