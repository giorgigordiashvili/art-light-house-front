"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import StyledComponentsRegistry from "../../lib/registry";
import "./globals.css";
import { usePathname } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <ClerkProvider
      appearance={{
        elements: {
          // Ensure captcha elements have proper styling
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
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Art Light House</title>
          <meta name="description" content="Art Light House - Premium lighting solutions" />
        </head>
        <body>
          {/* Add a hidden div for Clerk CAPTCHA at the root level */}
          <div id="clerk-captcha" style={{ display: "none" }}></div>
          <StyledComponentsRegistry>
            {!isAdminRoute && <Header />}
            {children}
            {!isAdminRoute && <Footer />}
          </StyledComponentsRegistry>
        </body>
      </html>
    </ClerkProvider>
  );
}
