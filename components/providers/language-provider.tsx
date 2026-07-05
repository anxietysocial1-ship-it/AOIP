"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_LOCALE,
  LANGUAGE_STORAGE_KEY,
  detectBrowserLocale,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/types";

interface LanguageContextValue {
  locale: Locale;
  dictionary: Dictionary;
  /** Explicit user choice: applies the locale and persists it. */
  setLocale: (locale: Locale) => void;
  /** Persist the currently active locale (used by the suggestion banner). */
  confirmLocale: () => void;
  /** True while the auto-detected locale has not been confirmed by the user. */
  suggestionPending: boolean;
  dismissSuggestion: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

function persistLocale(locale: Locale) {
  try {
    // When authentication lands, this is also where the profile
    // preference should be synced.
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  } catch {
    // Storage may be unavailable (private mode); the choice still
    // applies for the current visit.
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [suggestionPending, setSuggestionPending] = useState(false);

  // First visit: honour a saved preference, otherwise detect the browser
  // language, apply it and offer the suggestion banner.
  useEffect(() => {
    const stored = readStoredLocale();
    if (stored) {
      setLocaleState(stored);
      return;
    }
    const detected = detectBrowserLocale();
    if (detected && detected !== DEFAULT_LOCALE) {
      setLocaleState(detected);
      setSuggestionPending(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
    setSuggestionPending(false);
  }, []);

  const confirmLocale = useCallback(() => {
    setLocaleState((current) => {
      persistLocale(current);
      return current;
    });
    setSuggestionPending(false);
  }, []);

  const dismissSuggestion = useCallback(() => {
    setSuggestionPending(false);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      dictionary: getDictionary(locale),
      setLocale,
      confirmLocale,
      suggestionPending,
      dismissSuggestion,
    }),
    [locale, setLocale, confirmLocale, suggestionPending, dismissSuggestion],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
