"use client";

import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { useLanguage } from "@/components/providers/language-provider";
import { OBJECTIVES } from "@/lib/data/objectives";
import type { ObjectiveId } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

const GRID_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

/**
 * The interactive objective selector — the heart of the homepage.
 * Selecting a card reveals a confirmation bar with the primary CTA.
 */
export function ObjectiveGrid() {
  const { dictionary } = useLanguage();
  const [selected, setSelected] = useState<ObjectiveId | null>(null);

  return (
    <div id="objectives" className="scroll-mt-24">
      <motion.ul
        variants={GRID_VARIANTS}
        initial="hidden"
        animate="visible"
        role="listbox"
        aria-label={dictionary.hero.title}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5"
      >
        {OBJECTIVES.map((objective) => {
          const copy = dictionary.objectives[objective.id];
          const isSelected = selected === objective.id;
          return (
            <motion.li key={objective.id} variants={CARD_VARIANTS} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() =>
                  setSelected(isSelected ? null : objective.id)
                }
                className={cn(
                  "group flex h-full w-full flex-col items-start gap-3 rounded-2xl border bg-white/70 p-4 text-left backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 dark:bg-white/[0.04] dark:hover:shadow-black/40 dark:focus-visible:ring-saffron-400 dark:focus-visible:ring-offset-navy-950 md:p-5",
                  isSelected
                    ? "border-saffron-400 shadow-lg shadow-saffron-400/20 ring-1 ring-saffron-400 dark:border-saffron-400"
                    : "border-slate-200 hover:border-navy-200 dark:border-white/10 dark:hover:border-white/25",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ring-1 transition-transform duration-200 group-hover:scale-110",
                    objective.accent,
                  )}
                >
                  {objective.emoji}
                </span>
                <span className="text-sm font-semibold leading-snug text-navy-900 dark:text-white md:text-[15px]">
                  {copy.title}
                </span>
                <span className="hidden text-xs leading-relaxed text-slate-500 dark:text-slate-400 md:block">
                  {copy.description}
                </span>
              </button>
            </motion.li>
          );
        })}
      </motion.ul>

      <AnimatePresence>
        {selected ? (
          <motion.div
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 12, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-saffron-400/40 bg-gradient-to-r from-saffron-50 to-white p-5 shadow-lg shadow-saffron-400/10 dark:from-saffron-400/10 dark:to-transparent dark:border-saffron-400/30 sm:flex-row">
              <p className="text-center text-sm text-navy-900 dark:text-white sm:text-left">
                <span className="font-medium text-slate-500 dark:text-slate-300">
                  {dictionary.hero.selectedLabel}:
                </span>{" "}
                <span className="font-semibold">
                  {dictionary.objectives[selected].title}
                </span>
              </p>
              {/* Architecture hook: this will route to the questionnaire flow
                  (/journey?objective=<id>) once it ships. */}
              <a
                href="#cta"
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-navy-900 px-5 text-sm font-semibold text-white shadow-lg shadow-navy-900/20 transition-all hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:bg-saffron-400 dark:text-navy-950 dark:hover:bg-saffron-300"
              >
                {dictionary.hero.ctaPrimary}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
