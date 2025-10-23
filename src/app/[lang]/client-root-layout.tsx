"use client";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import StyledComponentsRegistry from "../../../lib/registry";
import "../globals.css";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import { ReactNode, useEffect } from "react";
import { Dictionary } from "@/config/get-dictionary";

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
    <AuthProvider>
      <AuthModalProvider>
        <StyledComponentsRegistry>
          {!isAdminRoute && <Header header={dictionary.header} dictionary={dictionary} />}
          {children}
          {!isAdminRoute && <Footer footer={dictionary.footer} />}
        </StyledComponentsRegistry>
      </AuthModalProvider>
    </AuthProvider>
  );
}
