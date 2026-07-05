"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { NetworkCanvas } from "@/components/home/network-canvas";
import { ObjectiveGrid } from "@/components/home/objective-grid";
import { useLanguage } from "@/components/providers/language-provider";

/**
 * First screen: a premium AI advisor asking "What would you like to
 * achieve?" with the interactive objective cards front and centre.
 */
export function Hero() {
  const { dictionary } = useLanguage();

  return (
    <section id="top" className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 md:pt-36">
      {/* Layered background: soft glows + animated opportunity network */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-50 via-white to-white dark:from-navy-950 dark:via-navy-950 dark:to-navy-950" />
        <div className="absolute -top-32 left-1/4 h-96 w-96 animate-glow-pulse rounded-full bg-saffron-400/15 blur-3xl" />
        <div className="absolute -top-16 right-1/4 h-80 w-80 animate-glow-pulse rounded-full bg-emerald-400/10 blur-3xl [animation-delay:2s]" />
        <NetworkCanvas />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-navy-700 backdrop-blur dark:border-white/15 dark:bg-white/5 dark:text-saffron-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-saffron-500 dark:text-saffron-300" aria-hidden />
            {dictionary.hero.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-balance text-4xl font-bold tracking-tight text-navy-900 dark:text-white sm:text-5xl md:text-6xl"
          >
            {dictionary.hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-slate-600 dark:text-slate-300"
          >
            {dictionary.hero.subtitle}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-12"
        >
          <ObjectiveGrid />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/journey"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-navy-900 px-6 text-base font-semibold text-white shadow-lg shadow-navy-900/20 transition-all hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:bg-saffron-400 dark:text-navy-950 dark:shadow-saffron-400/20 dark:hover:bg-saffron-300"
          >
            {dictionary.hero.ctaPrimary}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-12 items-center rounded-full border border-slate-300 bg-white/70 px-6 text-base font-medium text-navy-900 backdrop-blur transition-colors hover:border-navy-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10"
          >
            {dictionary.hero.ctaSecondary}
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mx-auto mt-6 max-w-xl text-center text-xs text-slate-400 dark:text-slate-500"
        >
          {dictionary.footer.disclaimer}
        </motion.p>
      </div>
    </section>
  );
}
