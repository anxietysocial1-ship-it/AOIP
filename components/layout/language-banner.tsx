"use client";

import { Languages, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useLanguage } from "@/components/providers/language-provider";
import { LOCALE_NAMES } from "@/lib/i18n/config";

interface LanguageBannerProps {
  onChangeLanguage: () => void;
}

/**
 * First-visit banner shown when the language was auto-detected from the
 * browser, letting the user confirm or change it.
 */
export function LanguageBanner({ onChangeLanguage }: LanguageBannerProps) {
  const { locale, dictionary, suggestionPending, confirmLocale, dismissSuggestion } =
    useLanguage();

  const message = dictionary.banner.message.replace(
    "{lang}",
    LOCALE_NAMES[locale],
  );

  return (
    <AnimatePresence>
      {suggestionPending ? (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          role="status"
          className="fixed inset-x-0 top-16 z-40 px-4"
        >
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-lg shadow-navy-900/10 backdrop-blur dark:border-white/10 dark:bg-navy-900/90">
            <Languages className="h-4 w-4 shrink-0 text-saffron-500" aria-hidden />
            <p className="text-sm text-navy-900 dark:text-slate-100">{message}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={confirmLocale}
                className="rounded-full bg-navy-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:bg-saffron-400 dark:text-navy-950 dark:hover:bg-saffron-300"
              >
                {dictionary.banner.keep}
              </button>
              <button
                type="button"
                onClick={onChangeLanguage}
                className="rounded-full border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-navy-900 transition-colors hover:border-navy-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:border-white/20 dark:text-white dark:hover:border-white/40"
              >
                {dictionary.banner.change}
              </button>
              <button
                type="button"
                onClick={dismissSuggestion}
                aria-label="Dismiss"
                className="rounded-full p-1.5 text-slate-400 transition-colors hover:text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
