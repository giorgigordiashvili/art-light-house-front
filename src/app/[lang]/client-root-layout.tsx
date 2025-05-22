"use client";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import StyledComponentsRegistry from "../../../lib/registry";
import "../globals.css"; // Global styles
import { usePathname } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode, useEffect } from "react";
import { Dictionary } from "@/config/get-dictionary";

interface ClientRootLayoutProps {
  children: ReactNode;
  lang: string; // The locale passed from the server layout
  dictionary: Dictionary; // The dictionary passed from the server layout
}

export default function ClientRootLayout({ children, lang, dictionary }: ClientRootLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Add error handling with a useEffect (your existing Clerk error handling)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleError = (event: ErrorEvent) => {
        if (
          event.error &&
          (event.error.message?.includes("Clerk") ||
            event.error.message?.includes("oauth") ||
            event.error.message?.includes("authentication"))
        ) {
          console.error("Clerk/OAuth error:", event.error);
          localStorage.setItem("oauth_error", event.error.message);
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
      <html lang={lang}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Art Light House</title>
          <meta name="description" content="Art Light House - Premium lighting solutions" />
        </head>
        <body>
          <div id="clerk-captcha" style={{ display: "none" }}></div>
          <StyledComponentsRegistry>
            {/* Pass only the relevant parts of the dictionary to Header and Footer */}
            {!isAdminRoute && <Header header={dictionary.header} />}{" "}
            {/* Assuming 'common' namespace for Header/Footer */}
            {children}
            {!isAdminRoute && <Footer footer={dictionary.footer} />}{" "}
            {/* Pass common translations */}
          </StyledComponentsRegistry>
        </body>
      </html>
    </ClerkProvider>
  );
}
