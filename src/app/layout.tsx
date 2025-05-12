"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import StyledComponentsRegistry from "../../lib/registry";
import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          {!isAdminRoute && <Header />}
          {children}
          {!isAdminRoute && <Footer />}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
