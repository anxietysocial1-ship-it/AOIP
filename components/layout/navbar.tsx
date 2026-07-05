"use client";

import { Menu, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { LanguageBanner } from "@/components/layout/language-banner";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useLanguage } from "@/components/providers/language-provider";

const NAV_LINKS = [
  { href: "#objectives", key: "objectives" },
  { href: "#how-it-works", key: "how" },
  { href: "#coverage", key: "coverage" },
  { href: "#faq", key: "faq" },
] as const;

export function Navbar() {
  const { dictionary } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [switcherSignal, setSwitcherSignal] = useState(0);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-navy-950/70">
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6"
        >
          <a
            href="#top"
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 rounded-lg"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 shadow-md shadow-navy-900/20 dark:from-saffron-400 dark:to-saffron-600">
              <Sparkles className="h-4.5 w-4.5 h-[18px] w-[18px] text-saffron-300 dark:text-navy-950" aria-hidden />
            </span>
            <span className="text-lg font-bold tracking-tight text-navy-900 dark:text-white">
              AOIP
            </span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {dictionary.nav[link.key]}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher openSignal={switcherSignal} />
            <ThemeToggle />
            <a
              href="#cta"
              className="hidden h-10 items-center rounded-full bg-navy-900 px-4 text-sm font-semibold text-white shadow-lg shadow-navy-900/20 transition-colors hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:bg-saffron-400 dark:text-navy-950 dark:shadow-saffron-400/20 dark:hover:bg-saffron-300 sm:inline-flex"
            >
              {dictionary.nav.cta}
            </a>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-navy-900 backdrop-blur transition-colors hover:border-navy-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:border-white/15 dark:bg-white/5 dark:text-white lg:hidden"
            >
              {menuOpen ? (
                <X className="h-4 w-4" aria-hidden />
              ) : (
                <Menu className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-navy-950/95 lg:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    {dictionary.nav[link.key]}
                  </a>
                ))}
                <a
                  href="#cta"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 rounded-xl bg-navy-900 px-3 py-2.5 text-center text-sm font-semibold text-white dark:bg-saffron-400 dark:text-navy-950"
                >
                  {dictionary.nav.cta}
                </a>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <LanguageBanner onChangeLanguage={() => setSwitcherSignal((n) => n + 1)} />
    </>
  );
}
