export const i18n = {
  locales: ["ge", "en"] as const,
  defaultLocale: "ge",
};

export type Locale = (typeof i18n)["locales"][number];
