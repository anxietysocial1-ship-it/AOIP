"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/** Slim distraction-free header for the questionnaire flow. */
export function JourneyHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-navy-950/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 shadow-md shadow-navy-900/20 dark:from-saffron-400 dark:to-saffron-600">
            <Sparkles className="h-[18px] w-[18px] text-saffron-300 dark:text-navy-950" aria-hidden />
          </span>
          <span className="text-lg font-bold tracking-tight text-navy-900 dark:text-white">
            GOP
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
