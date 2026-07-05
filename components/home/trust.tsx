"use client";

import { FileCheck2, HeartHandshake, ScanSearch, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { useLanguage } from "@/components/providers/language-provider";
import { Section, SectionHeader } from "@/components/ui/section";

const POINT_ICONS = [FileCheck2, ScanSearch, ShieldCheck, HeartHandshake];

export function Trust() {
  const { dictionary } = useLanguage();

  return (
    <Section id="trust">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          heading={dictionary.trust.heading}
          subheading={dictionary.trust.subheading}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {dictionary.trust.points.map((point, index) => {
            const Icon = POINT_ICONS[index] ?? ShieldCheck;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-navy-900/5 dark:border-white/10 dark:bg-white/[0.04]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 dark:bg-white/10">
                  <Icon className="h-5 w-5 text-navy-700 dark:text-saffron-300" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-navy-900 dark:text-white">
                    {point.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
