"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { useLanguage } from "@/components/providers/language-provider";
import type { Question } from "@/lib/data/questionnaire/types";
import type { AnswerValue } from "@/lib/engine/conditions";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  initialValue?: AnswerValue;
  error?: string | null;
  onAnswer: (value: AnswerValue) => void;
  onBack?: () => void;
}

function optionLabel(raw: unknown): string {
  return String(raw);
}

export function QuestionCard({
  question,
  initialValue,
  error,
  onAnswer,
  onBack,
}: QuestionCardProps) {
  const { dictionary } = useLanguage();
  const [draft, setDraft] = useState<string>(
    initialValue !== undefined && !Array.isArray(initialValue)
      ? String(initialValue)
      : "",
  );
  const [multiDraft, setMultiDraft] = useState<string[]>(
    Array.isArray(initialValue) ? initialValue : [],
  );
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(
      initialValue !== undefined && !Array.isArray(initialValue)
        ? String(initialValue)
        : "",
    );
    setMultiDraft(Array.isArray(initialValue) ? initialValue : []);
    setLocalError(null);
  }, [question.question_id, initialValue]);

  const submitTyped = () => {
    if (draft.trim() === "") {
      setLocalError(dictionary.journey.errorRequired);
      return;
    }
    if (question.input_type === "number" || question.input_type === "currency_inr") {
      const numeric = Number(draft);
      if (!Number.isFinite(numeric) || numeric < 0) {
        setLocalError(dictionary.journey.errorRequired);
        return;
      }
      onAnswer(numeric);
      return;
    }
    onAnswer(draft.trim());
  };

  const isTyped =
    question.input_type === "number" ||
    question.input_type === "currency_inr" ||
    question.input_type === "text";

  return (
    <motion.div
      key={question.question_id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-2xl"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-saffron-600 dark:text-saffron-400">
        {question.module_name}
      </p>
      <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-navy-900 dark:text-white md:text-3xl">
        {question.question_text}
      </h2>
      {question.help_text ? (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {question.help_text}
        </p>
      ) : null}

      <div className="mt-8">
        {question.input_type === "boolean" ? (
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((value) => (
              <button
                key={String(value)}
                type="button"
                onClick={() => onAnswer(value)}
                className={cn(
                  "rounded-2xl border px-5 py-4 text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500",
                  initialValue === value
                    ? "border-saffron-400 bg-saffron-50 text-navy-900 ring-1 ring-saffron-400 dark:bg-saffron-400/10 dark:text-white"
                    : "border-slate-200 bg-white text-navy-900 hover:border-navy-300 dark:border-white/10 dark:bg-white/5 dark:text-white",
                )}
              >
                {value ? dictionary.journey.yes : dictionary.journey.no}
              </button>
            ))}
          </div>
        ) : null}

        {question.input_type === "single_select" ? (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {(question.options ?? []).map((option) => {
              const selected = String(initialValue) === String(option.value);
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => onAnswer(option.value as AnswerValue)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500",
                    selected
                      ? "border-saffron-400 bg-saffron-50 text-navy-900 ring-1 ring-saffron-400 dark:bg-saffron-400/10 dark:text-white"
                      : "border-slate-200 bg-white text-navy-900 hover:border-navy-300 dark:border-white/10 dark:bg-white/5 dark:text-white",
                  )}
                >
                  {optionLabel(option.label)}
                  {selected ? (
                    <Check className="h-4 w-4 shrink-0 text-saffron-500" aria-hidden />
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}

        {question.input_type === "multi_select" ? (
          <>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {(question.options ?? []).map((option) => {
                const value = String(option.value);
                const selected = multiDraft.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setMultiDraft((current) =>
                        selected
                          ? current.filter((item) => item !== value)
                          : [...current, value],
                      )
                    }
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500",
                      selected
                        ? "border-saffron-400 bg-saffron-50 text-navy-900 ring-1 ring-saffron-400 dark:bg-saffron-400/10 dark:text-white"
                        : "border-slate-200 bg-white text-navy-900 hover:border-navy-300 dark:border-white/10 dark:bg-white/5 dark:text-white",
                    )}
                  >
                    {optionLabel(option.label)}
                    {selected ? (
                      <Check className="h-4 w-4 shrink-0 text-saffron-500" aria-hidden />
                    ) : null}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => {
                if (multiDraft.length === 0) {
                  setLocalError(dictionary.journey.errorRequired);
                  return;
                }
                onAnswer(multiDraft);
              }}
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-navy-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:bg-saffron-400 dark:text-navy-950 dark:hover:bg-saffron-300"
            >
              {dictionary.journey.next}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </>
        ) : null}

        {isTyped ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitTyped();
            }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <div className="relative flex-1">
              {question.input_type === "currency_inr" ? (
                <span
                  aria-hidden
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  ₹
                </span>
              ) : null}
              <input
                type={question.input_type === "text" ? "text" : "number"}
                inputMode={question.input_type === "text" ? "text" : "numeric"}
                value={draft}
                min={0}
                autoFocus
                onChange={(event) => {
                  setDraft(event.target.value);
                  setLocalError(null);
                }}
                aria-label={question.question_text}
                className={cn(
                  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-navy-900 outline-none transition-colors placeholder:text-slate-400 focus:border-navy-400 focus:ring-2 focus:ring-navy-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-saffron-400",
                  question.input_type === "currency_inr" && "pl-9",
                )}
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-navy-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:bg-saffron-400 dark:text-navy-950 dark:hover:bg-saffron-300"
            >
              {dictionary.journey.next}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </form>
        ) : null}
      </div>

      {(error || localError) ? (
        <p role="alert" className="mt-4 text-sm font-medium text-rose-600 dark:text-rose-400">
          {error ?? localError}
        </p>
      ) : null}

      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {dictionary.journey.back}
        </button>
      ) : null}
    </motion.div>
  );
}
