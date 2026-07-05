"use client";

import { ArrowRight, Loader2, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import { useLanguage } from "@/components/providers/language-provider";
import type { LeadContact } from "@/lib/engine/lead";

interface ContactFormProps {
  onSubmit: (contact: LeadContact) => Promise<void>;
  onSkip: () => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ onSubmit, onSkip }: ContactFormProps) {
  const { dictionary } = useLanguage();
  const copy = dictionary.journey;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError(copy.errorRequired);
      return;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError(copy.errorEmail);
      return;
    }
    setError(null);
    setSending(true);
    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      consent,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-xl"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron-50 ring-1 ring-saffron-400/40 dark:bg-saffron-400/10">
        <Mail className="h-5 w-5 text-saffron-600 dark:text-saffron-300" aria-hidden />
      </span>
      <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-navy-900 dark:text-white md:text-3xl">
        {copy.contactTitle}
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {copy.contactSubtitle}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="lead-name"
            className="mb-1.5 block text-sm font-medium text-navy-900 dark:text-slate-200"
          >
            {copy.nameLabel}
          </label>
          <input
            id="lead-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-navy-900 outline-none transition-colors focus:border-navy-400 focus:ring-2 focus:ring-navy-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-saffron-400"
          />
        </div>
        <div>
          <label
            htmlFor="lead-email"
            className="mb-1.5 block text-sm font-medium text-navy-900 dark:text-slate-200"
          >
            {copy.emailLabel}
          </label>
          <input
            id="lead-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-navy-900 outline-none transition-colors focus:border-navy-400 focus:ring-2 focus:ring-navy-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-saffron-400"
          />
        </div>
        <div>
          <label
            htmlFor="lead-phone"
            className="mb-1.5 block text-sm font-medium text-navy-900 dark:text-slate-200"
          >
            {copy.phoneLabel}
          </label>
          <input
            id="lead-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-navy-900 outline-none transition-colors focus:border-navy-400 focus:ring-2 focus:ring-navy-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-saffron-400"
          />
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-saffron-500"
          />
          <span className="text-sm text-slate-600 dark:text-slate-300">
            {copy.consentLabel}
          </span>
        </label>

        {error ? (
          <p role="alert" className="text-sm font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={sending}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-navy-900 px-6 text-base font-semibold text-white shadow-lg shadow-navy-900/20 transition-colors hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 disabled:opacity-60 dark:bg-saffron-400 dark:text-navy-950 dark:hover:bg-saffron-300 sm:w-auto"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <ArrowRight className="h-4 w-4" aria-hidden />
            )}
            {copy.submit}
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="text-sm font-medium text-slate-400 transition-colors hover:text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:hover:text-white"
          >
            {copy.skipContact}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
