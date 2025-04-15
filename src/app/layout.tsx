'use client'
import StyledComponentsRegistry from "../../lib/registry";
import Header from "@/components/Header";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Header />
          {children}  
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
