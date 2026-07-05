"use client";

import { Brain, ListChecks, Map, Target } from "lucide-react";
import { motion } from "framer-motion";

import { useLanguage } from "@/components/providers/language-provider";
import { Section, SectionHeader } from "@/components/ui/section";

const STEP_ICONS = [Target, ListChecks, Brain, Map];

export function HowItWorks() {
  const { dictionary } = useLanguage();

  return (
    <Section id="how-it-works" className="bg-slate-50 dark:bg-navy-900/40">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          heading={dictionary.how.heading}
          subheading={dictionary.how.subheading}
        />
        <ol className="relative grid gap-8 md:grid-cols-4">
          <div
            aria-hidden
            className="absolute left-6 top-6 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-saffron-400/60 via-navy-300/40 to-emerald-400/60 md:left-[12.5%] md:block md:w-3/4"
          />
          {dictionary.how.steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? Target;
            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="relative flex flex-col items-center text-center md:items-center"
              >
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-md shadow-navy-900/5 dark:border-white/10 dark:bg-navy-900">
                  <Icon className="h-5 w-5 text-navy-700 dark:text-saffron-300" aria-hidden />
                </span>
                <span className="mt-3 text-xs font-bold uppercase tracking-widest text-saffron-600 dark:text-saffron-400">
                  {index + 1}
                </span>
                <h3 className="mt-1.5 text-base font-semibold text-navy-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {step.description}
                </p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
