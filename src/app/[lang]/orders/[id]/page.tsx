import OrderDetailScreen from "@/screens/OrderDetailScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo";

interface OrderDetailsPageProps {
  params: Promise<{ lang: string; id: string }>;
}

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export async function generateMetadata({ params }: OrderDetailsPageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const resolvedLang = isLocale(lang) ? lang : "ge";
  const dictionary = await getDictionary(resolvedLang);

  return buildSeoMetadata({
    title: dictionary.metadata.orderDetail.title,
    description: dictionary.metadata.orderDetail.subTitle,
    locale: resolvedLang,
    pathname: `/orders/${id}`,
    noIndex: true,
  });
}

export default async function OrderDetailPage({ params }: OrderDetailsPageProps) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
  const orderId = id;
  return <OrderDetailScreen dictionary={dictionary} orderId={orderId} />;
}
