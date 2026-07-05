"use client";

import { Sparkles } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";

export function Footer() {
  const { dictionary } = useLanguage();
  const links = [
    { label: dictionary.footer.about, href: "#top" },
    { label: dictionary.footer.contact, href: "#cta" },
    { label: dictionary.footer.privacy, href: "#" },
    { label: dictionary.footer.terms, href: "#" },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-12 dark:border-white/10 dark:bg-navy-950 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-navy-800 to-navy-950 dark:from-saffron-400 dark:to-saffron-600">
              <Sparkles className="h-4 w-4 text-saffron-300 dark:text-navy-950" aria-hidden />
            </span>
            <span className="text-base font-bold tracking-tight text-navy-900 dark:text-white">
              GOP
            </span>
          </div>
          <p className="max-w-xs text-center text-sm text-slate-500 dark:text-slate-400 md:text-left">
            {dictionary.footer.tagline}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-slate-500 transition-colors hover:text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:text-slate-400 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-slate-400 dark:text-slate-500">
        {dictionary.footer.disclaimer}
      </p>
      <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
        {dictionary.footer.rights}
      </p>
    </footer>
  );
}
