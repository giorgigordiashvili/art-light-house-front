import { i18n } from "@/config/i18n";

const LOCALE_PREFIX_RE = new RegExp(`^/(${i18n.locales.join("|")})(?=[/?#]|$)`);

// Prefix internal CMS links with the current locale so they skip the middleware redirect
export const localizeHref = (raw: string, lang: string) => {
  if (!raw.startsWith("/") || raw.startsWith("//")) return raw; // absolute, protocol-relative, mailto, #anchor
  if (LOCALE_PREFIX_RE.test(raw)) return raw; // already has a locale
  if (/^\/(admin|api|assets)(?=[/?#]|$)/.test(raw)) return raw; // middleware-exempt paths
  return `/${lang}${raw === "/" ? "" : raw}`;
};
