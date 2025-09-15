"use client";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import StyledComponentsRegistry from "../../../lib/registry";
import "../globals.css";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { Dictionary } from "@/config/get-dictionary";
// import { TranslationProvider } from "@/hooks/useTranslations";
// import { CartProvider } from "../../contexts/CartContext";
import { TranslationProvider } from "@/hooks/useTranslations";
import { CartProvider } from "@/contexts/CartContext";
import SessionRestore from "@/components/SessionRestore";

interface ClientRootLayoutProps {
  children: ReactNode;
  lang: string; // The locale passed from the server layout (can be 'en' | 'ge')
  dictionary: Dictionary;
}

export default function ClientRootLayout({ children, dictionary, lang }: ClientRootLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Normalize legacy 'ge' to 'ka' for API + translation hooks
  const normalizedLang = lang === "ge" ? "ka" : lang;

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clean up any old authentication tokens/errors
      const oauthError = localStorage.getItem("oauth_error");
      if (oauthError) {
        console.log("Cleaning up old OAuth errors");
        localStorage.removeItem("oauth_error");
      }

      // Clean up any old custom session tokens
      const customToken = localStorage.getItem("custom_session_token");
      if (customToken) {
        console.log("Cleaning up old custom session tokens");
        localStorage.removeItem("custom_session_token");
      }
    }
  }, []);

  return (
    <SessionProvider>
      <SessionRestore>
        <StyledComponentsRegistry>
          <TranslationProvider defaultLanguage={normalizedLang as any}>
            <CartProvider>
              {!isAdminRoute && <Header header={dictionary.header} dictionary={dictionary} />}
              {children}
              {!isAdminRoute && <Footer footer={dictionary.footer} />}
            </CartProvider>
          </TranslationProvider>
        </StyledComponentsRegistry>
      </SessionRestore>
    </SessionProvider>
  );
}
