"use client";

import {
  ArrowRight,
  CheckCircle2,
  Info,
  PencilLine,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { ContactForm } from "@/components/journey/contact-form";
import { QuestionCard } from "@/components/journey/question-card";
import { useLanguage } from "@/components/providers/language-provider";
import type { Question } from "@/lib/data/questionnaire/types";
import type { AnswerValue } from "@/lib/engine/conditions";
import {
  buildLead,
  sendLead,
  storeLeadLocally,
  type LeadContact,
} from "@/lib/engine/lead";
import { brandText } from "@/lib/utils";
import {
  computeOutcome,
  mandatoryQuestionsForState,
  milestoneMessage,
  questionById,
  routeFoundationState,
  selectAdaptiveQuestion,
  validateAnswer,
} from "@/lib/engine/session";

const APPLICANT_IDS = ["Q-APP-001", "Q-APP-004", "Q-APP-006"];
const LOCATION_IDS = ["Q-LOC-001", "Q-LOC-003"];
const PREFERENCE_IDS = ["Q-PRF-001", "Q-PRF-005", "Q-PRF-006"];
const ADAPTIVE_LIMIT = 6;
const ADAPTIVE_EXCLUDED_MODULES = new Set(["DOC", "PRF"]);

type Screen =
  | { kind: "welcome" }
  | { kind: "question"; question: Question; stage: string }
  | { kind: "notice"; messages: string[] }
  | { kind: "review" }
  | { kind: "contact" }
  | { kind: "complete" };

const STAGE_PROGRESS: Record<string, [number, number]> = {
  objective: [2, 15],
  applicant: [15, 28],
  location: [30, 40],
  foundation: [40, 55],
  adaptive: [55, 80],
  documents: [85, 92],
  preferences: [92, 96],
};

export function JourneyExperience() {
  const { dictionary, locale } = useLanguage();
  const copy = dictionary.journey;
  const searchParams = useSearchParams();

  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const [adaptiveIds, setAdaptiveIds] = useState<string[]>([]);
  const [noticeAck, setNoticeAck] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [contactDone, setContactDone] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [milestone, setMilestone] = useState<string | null>(null);
  const seededRef = useRef(false);

  // Homepage objective cards pre-answer Q-OBJ-001 via ?objective=<value>.
  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    const value = searchParams.get("objective");
    if (!value) return;
    const options = questionById("Q-OBJ-001")?.options ?? [];
    if (options.some((option) => String(option.value) === value)) {
      setAnswers({ primary_objective: value });
      setAnsweredIds(["Q-OBJ-001"]);
    }
  }, [searchParams]);

  const outcome = useMemo(() => computeOutcome(answers), [answers]);

  const screen: Screen = useMemo(() => {
    if (!started) return { kind: "welcome" };

    if (editingId) {
      const question = questionById(editingId);
      if (question) return { kind: "question", question, stage: "edit" };
    }

    if (answers["primary_objective"] === undefined) {
      const question = questionById("Q-OBJ-001");
      if (question) return { kind: "question", question, stage: "objective" };
    }

    for (const id of APPLICANT_IDS) {
      const question = questionById(id);
      if (question && answers[question.attribute_key] === undefined) {
        return { kind: "question", question, stage: "applicant" };
      }
    }

    if (outcome.flagMessages.length > 0 && !noticeAck) {
      return { kind: "notice", messages: outcome.flagMessages };
    }

    for (const id of LOCATION_IDS) {
      const question = questionById(id);
      if (question && answers[question.attribute_key] === undefined) {
        return { kind: "question", question, stage: "location" };
      }
    }

    const foundationState = routeFoundationState(outcome.attributes);
    const foundationPending = mandatoryQuestionsForState(
      foundationState,
      answers,
      outcome,
    );
    if (foundationPending.length > 0) {
      return {
        kind: "question",
        question: foundationPending[0],
        stage: "foundation",
      };
    }

    if (adaptiveIds.length < ADAPTIVE_LIMIT) {
      const next = selectAdaptiveQuestion(
        answers,
        outcome,
        ADAPTIVE_EXCLUDED_MODULES,
      );
      if (next) return { kind: "question", question: next, stage: "adaptive" };
    }

    const documentsPending = mandatoryQuestionsForState(
      "S-080-DOCUMENTS",
      answers,
      outcome,
    );
    if (documentsPending.length > 0) {
      return {
        kind: "question",
        question: documentsPending[0],
        stage: "documents",
      };
    }

    for (const id of PREFERENCE_IDS) {
      const question = questionById(id);
      if (question && answers[question.attribute_key] === undefined) {
        return { kind: "question", question, stage: "preferences" };
      }
    }

    if (!reviewConfirmed) return { kind: "review" };
    if (!contactDone) return { kind: "contact" };
    return { kind: "complete" };
  }, [
    started,
    editingId,
    answers,
    outcome,
    noticeAck,
    adaptiveIds,
    reviewConfirmed,
    contactDone,
  ]);

  const progress = useMemo(() => {
    if (!started) return 0;
    if (screen.kind === "review") return 96;
    if (screen.kind === "contact") return 98;
    if (screen.kind === "complete") return 100;
    if (screen.kind === "notice") return 28;
    if (screen.kind === "question") {
      const band = STAGE_PROGRESS[screen.stage];
      if (!band) return 96;
      if (screen.stage === "adaptive") {
        const [lo, hi] = band;
        return Math.round(lo + (hi - lo) * (adaptiveIds.length / ADAPTIVE_LIMIT));
      }
      return band[0];
    }
    return 0;
  }, [started, screen, adaptiveIds.length]);

  const handleAnswer = (question: Question, value: AnswerValue) => {
    const nextAnswers = { ...answers, [question.attribute_key]: value };
    const failure = validateAnswer(question.attribute_key, nextAnswers);
    if (failure) {
      setValidationError(brandText(failure));
      return;
    }
    setValidationError(null);
    setAnswers(nextAnswers);

    const isNew = !answeredIds.includes(question.question_id);
    const nextAnswered = isNew
      ? [...answeredIds, question.question_id]
      : answeredIds;
    if (isNew) setAnsweredIds(nextAnswered);
    if (screen.kind === "question" && screen.stage === "adaptive" && isNew) {
      setAdaptiveIds((ids) => [...ids, question.question_id]);
    }
    if (editingId) setEditingId(null);

    const message = milestoneMessage(nextAnswered.length);
    if (message) {
      setMilestone(message);
      window.setTimeout(() => setMilestone(null), 4200);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (editingId) {
      setEditingId(null);
      return;
    }
    const lastId = answeredIds[answeredIds.length - 1];
    if (!lastId) return;
    const question = questionById(lastId);
    if (!question) return;
    setAnsweredIds((ids) => ids.slice(0, -1));
    setAdaptiveIds((ids) => ids.filter((id) => id !== lastId));
    setAnswers((current) => {
      const next = { ...current };
      delete next[question.attribute_key];
      return next;
    });
  };

  const finishWithContact = async (contact: LeadContact) => {
    const record = buildLead(contact, answers, locale);
    storeLeadLocally(record);
    if (contact.consent) {
      await sendLead(record);
    }
    setContactDone(true);
  };

  const finishWithoutContact = () => {
    storeLeadLocally(
      buildLead(
        { name: "", email: "", phone: "", consent: false },
        answers,
        locale,
      ),
    );
    setContactDone(true);
  };

  const formatAnswer = (question: Question): string => {
    const value = answers[question.attribute_key];
    if (value === undefined) return "";
    if (typeof value === "boolean") {
      return value ? copy.yes : copy.no;
    }
    if (Array.isArray(value)) {
      return value
        .map(
          (item) =>
            question.options?.find((o) => String(o.value) === item)?.label ??
            item,
        )
        .join(", ");
    }
    const option = question.options?.find(
      (o) => String(o.value) === String(value),
    );
    if (option) return String(option.label);
    if (typeof value === "number") return value.toLocaleString("en-IN");
    return String(value);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col px-4 pb-16 pt-28 sm:px-6">
      {started && screen.kind !== "complete" ? (
        <div className="mb-10">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>{copy.progress}</span>
            <span>{progress}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-saffron-400 to-saffron-500"
            />
          </div>
        </div>
      ) : null}

      <AnimatePresence>
        {milestone ? (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300"
          >
            {brandText(milestone)}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <div className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
          {screen.kind === "welcome" ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-2xl text-center"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 shadow-lg shadow-navy-900/20 dark:from-saffron-400 dark:to-saffron-600">
                <Sparkles className="h-6 w-6 text-saffron-300 dark:text-navy-950" aria-hidden />
              </span>
              <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight text-navy-900 dark:text-white md:text-4xl">
                {copy.welcomeTitle}
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-slate-600 dark:text-slate-300">
                {copy.welcomeMessage}
              </p>
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-navy-900 px-7 text-base font-semibold text-white shadow-lg shadow-navy-900/20 transition-colors hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:bg-saffron-400 dark:text-navy-950 dark:hover:bg-saffron-300"
              >
                {copy.begin}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </motion.div>
          ) : null}

          {screen.kind === "question" ? (
            <QuestionCard
              key={screen.question.question_id}
              question={screen.question}
              initialValue={answers[screen.question.attribute_key]}
              error={validationError}
              onAnswer={(value) => handleAnswer(screen.question, value)}
              onBack={answeredIds.length > 0 || editingId ? handleBack : undefined}
            />
          ) : null}

          {screen.kind === "notice" ? (
            <motion.div
              key="notice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-xl"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-400/40 dark:bg-blue-400/10">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden />
              </span>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-navy-900 dark:text-white">
                {copy.noticeTitle}
              </h2>
              <div className="mt-4 space-y-3">
                {screen.messages.map((message) => (
                  <p
                    key={message}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  >
                    {brandText(message)}
                  </p>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setNoticeAck(true)}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-navy-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:bg-saffron-400 dark:text-navy-950 dark:hover:bg-saffron-300"
              >
                {copy.next}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </motion.div>
          ) : null}

          {screen.kind === "review" ? (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto w-full max-w-2xl"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-navy-900 dark:text-white md:text-3xl">
                {copy.reviewTitle}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {copy.reviewSubtitle}
              </p>
              <ul className="mt-6 max-h-[50vh] space-y-2 overflow-y-auto pr-1">
                {answeredIds.map((id) => {
                  const question = questionById(id);
                  if (!question) return null;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => setEditingId(id)}
                        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:border-navy-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/25"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                            {brandText(question.question_text)}
                          </span>
                          <span className="mt-0.5 block truncate text-sm font-semibold text-navy-900 dark:text-white">
                            {formatAnswer(question)}
                          </span>
                        </span>
                        <PencilLine className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={() => setReviewConfirmed(true)}
                className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-navy-900 px-6 text-base font-semibold text-white shadow-lg shadow-navy-900/20 transition-colors hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:bg-saffron-400 dark:text-navy-950 dark:hover:bg-saffron-300"
              >
                {copy.confirm}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </motion.div>
          ) : null}

          {screen.kind === "contact" ? (
            <ContactForm
              key="contact"
              onSubmit={finishWithContact}
              onSkip={finishWithoutContact}
            />
          ) : null}

          {screen.kind === "complete" ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-xl text-center"
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-400/50 dark:bg-emerald-400/10">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" aria-hidden />
              </span>
              <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-navy-900 dark:text-white">
                {copy.doneTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-pretty text-lg text-slate-600 dark:text-slate-300">
                {copy.doneSubtitle}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-navy-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:bg-saffron-400 dark:text-navy-950 dark:hover:bg-saffron-300"
                >
                  {copy.backHome}
                </Link>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
