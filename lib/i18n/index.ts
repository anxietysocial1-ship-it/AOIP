import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

import as from "@/lib/i18n/dictionaries/as";
import bn from "@/lib/i18n/dictionaries/bn";
import en from "@/lib/i18n/dictionaries/en";
import gu from "@/lib/i18n/dictionaries/gu";
import hi from "@/lib/i18n/dictionaries/hi";
import kn from "@/lib/i18n/dictionaries/kn";
import ml from "@/lib/i18n/dictionaries/ml";
import mr from "@/lib/i18n/dictionaries/mr";
import or from "@/lib/i18n/dictionaries/or";
import pa from "@/lib/i18n/dictionaries/pa";
import ta from "@/lib/i18n/dictionaries/ta";
import te from "@/lib/i18n/dictionaries/te";

export const DICTIONARIES: Record<Locale, Dictionary> = {
  en,
  hi,
  mr,
  pa,
  gu,
  bn,
  ta,
  te,
  kn,
  ml,
  or,
  as,
};

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
