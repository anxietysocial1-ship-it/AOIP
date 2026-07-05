"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/components/providers/language-provider";
import { Section } from "@/components/ui/section";

export function Cta() {
  const { dictionary } = useLanguage();

  return (
    <Section id="cta">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-navy-900 px-6 py-16 text-center shadow-2xl shadow-navy-900/30 dark:bg-gradient-to-br dark:from-navy-800 dark:to-navy-950 md:px-16">
        <div
          aria-hidden
          className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-saffron-400/20 blur-3xl"
        />
        <h2 className="relative text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {dictionary.cta.heading}
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-pretty text-lg text-slate-300">
          {dictionary.cta.subheading}
        </p>
        <Link
          href="/journey"
          className="relative mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-saffron-400 px-7 text-base font-semibold text-navy-950 shadow-lg shadow-saffron-400/30 transition-all hover:bg-saffron-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-300 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
        >
          {dictionary.cta.button}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </Section>
  );
}
