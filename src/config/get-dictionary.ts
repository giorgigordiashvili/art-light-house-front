import "server-only";
import type { Locale } from "./i18n";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  ge: () => import("../../dictionaries/ge.json").then((module) => module.default),
  en: () => import("../../dictionaries/en.json").then((module) => module.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["ge"]>>;

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.ge();
