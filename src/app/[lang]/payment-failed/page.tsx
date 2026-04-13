import FailedPayment from "@/screens/FailedPaymentScreen";
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
    title: dictionary.metadata.paymentFailed.title,
    description: dictionary.metadata.paymentFailed.subTitle,
    locale,
    pathname: "/payment-failed",
    noIndex: true,
  });
}

export default async function PaymentFailedPage({ params }: PageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
  return <FailedPayment dictionary={dictionary} />;
}
