import { Locale } from "@/config/i18n";

export const getLocaleFromPath = (pathname?: string): Locale => {
  const segments = pathname?.split("/").filter(Boolean) ?? [];
  return segments[0] === "en" ? "en" : "ge";
};
