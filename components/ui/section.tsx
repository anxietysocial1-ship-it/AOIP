"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

/** Full-width page section with a scroll-triggered reveal animation. */
export function Section({ id, className, children }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn("scroll-mt-24 px-4 py-20 sm:px-6 md:py-28", className)}
    >
      {children}
    </motion.section>
  );
}

interface SectionHeaderProps {
  heading: string;
  subheading?: string;
  className?: string;
}

export function SectionHeader({
  heading,
  subheading,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mx-auto mb-14 max-w-2xl text-center", className)}>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-navy-900 dark:text-white md:text-4xl">
        {heading}
      </h2>
      {subheading ? (
        <p className="mt-4 text-pretty text-lg text-slate-600 dark:text-slate-300">
          {subheading}
        </p>
      ) : null}
    </div>
  );
}
