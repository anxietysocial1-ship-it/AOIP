"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Counter } from "@/components/ui/counter";
import { Section, SectionHeader } from "@/components/ui/section";

export function Coverage() {
  const { dictionary } = useLanguage();

  const stats = [
    { value: 36, suffix: "", label: dictionary.coverage.states },
    { value: 780, suffix: "+", label: dictionary.coverage.districts },
    { value: 2500, suffix: "+", label: dictionary.coverage.opportunities },
    { value: 12, suffix: "", label: dictionary.coverage.languages },
  ];

  return (
    <Section
      id="coverage"
      className="bg-navy-900 dark:bg-navy-900/60"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          heading={dictionary.coverage.heading}
          subheading={dictionary.coverage.subheading}
          className="[&>h2]:text-white [&>p]:text-slate-300"
        />
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur"
            >
              <dd className="text-4xl font-bold tracking-tight text-saffron-300">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mt-2 text-sm text-slate-300">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
