import { ReactNode } from "react";
import { getDictionary } from "@/config/get-dictionary"; // Adjust path as needed
import { i18n, Locale } from "@/config/i18n"; // Adjust path as needed
import ClientRootLayout from "./client-root-layout"; // Import your client layout

interface ServerRootLayoutProps {
  children: ReactNode;
  params: { lang: Locale }; // Use your Locale type
}

// generateStaticParams MUST be in a Server Component layout/page
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function ServerRootLayout({
  children,
  params: { lang },
}: ServerRootLayoutProps) {
  // Fetch the dictionary on the server
  const dictionary = await getDictionary(lang);

  return (
    // Pass the dictionary and other necessary props to your client layout
    <ClientRootLayout lang={lang} dictionary={dictionary}>
      {children}
    </ClientRootLayout>
  );
}
