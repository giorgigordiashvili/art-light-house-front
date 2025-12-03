import { ReactNode } from "react";
import { getDictionary, Dictionary } from "@/config/get-dictionary"; // Your updated path
import { i18n, Locale } from "@/config/i18n";
import ClientRootLayout from "./client-root-layout";

interface ServerRootLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
}

// Static params for pre-rendering each locale
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function ServerRootLayout({ children, params }: ServerRootLayoutProps) {
  const { lang } = await params;
  // Make sure lang is a valid locale
  const validLang = lang === "ge" || lang === "en" ? lang : "ge";
  const dictionary: Dictionary = await getDictionary(validLang);

  return (
    <ClientRootLayout lang={validLang} dictionary={dictionary}>
      {children}
    </ClientRootLayout>
  );
}
