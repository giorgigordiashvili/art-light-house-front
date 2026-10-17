import type { LocalizedText } from "@/types/homepage";

/**
 * Resolves a LocalizedText (or legacy plain string) to a renderable string.
 * Never returns an object, so it is always safe as a React child or alt text.
 */
export const localized = (t: LocalizedText | string | null | undefined, lang: string): string =>
  typeof t === "string" ? t : t?.[lang] || t?.en || t?.ka || "";
