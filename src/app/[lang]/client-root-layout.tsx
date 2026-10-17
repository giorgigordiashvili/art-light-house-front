"use client";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import StyledComponentsRegistry from "../../../lib/registry";
import "../globals.css";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import { ReactNode, useEffect } from "react";
import { Dictionary } from "@/config/get-dictionary";
import QueryProvider from "@/providers/QueryProvider";
import Toast from "@/components/ui/Toast";

interface ClientRootLayoutProps {
  children: ReactNode;
  lang: string; // The locale passed from the server layout
  dictionary: Dictionary;
}

export default function ClientRootLayout({ children, dictionary }: ClientRootLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleError = (event: ErrorEvent) => {
        const message = event.error?.message;
        if (message?.includes("authentication")) {
          localStorage.setItem("auth_error", message);
        }
      };

      window.addEventListener("error", handleError);

      return () => window.removeEventListener("error", handleError);
    }
  }, []);

  return (
    <QueryProvider>
      {/* Preload above-the-fold fonts (React 19 hoists these into <head>) */}
      <link
        rel="preload"
        href="/fonts/helgeo45.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/helrom.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <NextTopLoader color="#FFD700" height={3} showSpinner={false} />
      <AuthProvider>
        <AuthModalProvider>
          <StyledComponentsRegistry>
            {!isAdminRoute && <Header header={dictionary.header} dictionary={dictionary} />}
            {children}
            {!isAdminRoute && <Footer footer={dictionary.footer} />}
            <Toast dictionary={dictionary} />
          </StyledComponentsRegistry>
        </AuthModalProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
