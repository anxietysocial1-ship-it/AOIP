export const SUPPORTED_LOCALES = [
  "en",
  "hi",
  "mr",
  "pa",
  "gu",
  "bn",
  "ta",
  "te",
  "kn",
  "ml",
  "or",
  "as",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LANGUAGE_STORAGE_KEY = "aoip.language";

/** Native display names, shown in the language switcher. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
  pa: "ਪੰਜਾਬੀ",
  gu: "ગુજરાતી",
  bn: "বাংলা",
  ta: "தமிழ்",
  te: "తెలుగు",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  or: "ଓଡ଼ିଆ",
  as: "অসমীয়া",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Match the browser's preferred languages against the supported locales.
 * Only the primary subtag matters ("hi-IN" → "hi").
 */
export function detectBrowserLocale(): Locale | null {
  if (typeof navigator === "undefined") return null;
  const preferences =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];
  for (const tag of preferences) {
    if (!tag) continue;
    const primary = tag.toLowerCase().split("-")[0];
    if (isLocale(primary)) return primary;
  }
  return null;
}
