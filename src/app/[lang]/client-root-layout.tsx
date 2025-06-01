"use client";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import StyledComponentsRegistry from "../../../lib/registry";
import "../globals.css";
import { usePathname } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
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
        if (
          message?.includes("Clerk") ||
          message?.includes("oauth") ||
          message?.includes("authentication")
        ) {
          console.error("Clerk/OAuth error:", message);
          localStorage.setItem("oauth_error", message);
        }
      };

      window.addEventListener("error", handleError);
      console.log("Clerk provider initialized in", process.env.NODE_ENV, "mode");

      return () => window.removeEventListener("error", handleError);
    }
  }, []);

  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-yellow-500 hover:bg-yellow-600 text-black",
          captchaContainer: "w-full flex justify-center my-4",
          userButtonAvatarBox: "w-10 h-10 overflow-hidden",
          userButtonAvatarImage: "w-full h-full object-cover",
          avatarBox: "overflow-hidden rounded-full",
          avatarImage: "w-full h-full object-cover",
        },
        layout: {
          logoPlacement: "inside",
          showOptionalFields: true,
          helpPageUrl: "https://art-light-house.netlify.app/help",
          privacyPageUrl: "https://art-light-house.netlify.app/privacy",
          termsPageUrl: "https://art-light-house.netlify.app/terms",
        },
      }}
    >
      <div id="clerk-captcha" style={{ display: "none" }}></div>
      <StyledComponentsRegistry>
        {!isAdminRoute && <Header header={dictionary.header} dictionary={dictionary} />}
        {children}
        {!isAdminRoute && <Footer footer={dictionary.footer} />}
      </StyledComponentsRegistry>
    </ClerkProvider>
  );
}
