import OrderDetailScreen from "@/screens/OrderDetailScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import type { Metadata } from "next";
import axios from "axios";

interface OrderDetailsPageProps {
  params: Promise<{ lang: string; id: string }>;
}

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export async function generateMetadata({ params }: OrderDetailsPageProps): Promise<Metadata> {
  const { lang, id } = await params;

  // Map 'ge' to 'ka' for backend API
  const apiLang = lang === "en" ? "en" : "ka";

  try {
    // Fetch order data
    const response = await axios.get(`https://testapi.artlighthouse.ge/api/orders/${id}/`, {
      headers: {
        "Accept-Language": apiLang,
      },
    });

    const order = response.data;
    const title = `${lang === "ge" ? "შეკვეთა" : "Order"} #${order.order_number} - Art Lighthouse`;
    const description = `${lang === "ge" ? "შეკვეთის დეტალები" : "Order details"} - ${order.order_number}`;

    return {
      title,
      description,
    };
  } catch {
    // Fallback metadata if order fetch fails
    const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
    return {
      title: dictionary.metadata.orderDetail.title,
      description: dictionary.metadata.orderDetail.subTitle,
    };
  }
}

export default async function OrderDetailPage({ params }: OrderDetailsPageProps) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");
  const orderId = id;

  return <OrderDetailScreen dictionary={dictionary} orderId={orderId} />;
}
