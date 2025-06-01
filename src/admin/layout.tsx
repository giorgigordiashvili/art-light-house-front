"use client";
import StyledComponentsRegistry from "../../lib/registry";
import "../globals.css";

// In Next.js 13+, we need to configure this layout to not inherit the root layout
// For this to work correctly, we need to modify the root layout to check for admin route

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // We don't include the full html/body structure here because that would cause
  // multiple document roots, which is problematic
  return <StyledComponentsRegistry>{children}</StyledComponentsRegistry>;
}
