"use client";

import {
  Download,
  FileJson,
  Inbox,
  KeyRound,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  downloadJson,
  readStoredLeads,
  type LeadRecord,
} from "@/lib/engine/lead";

/**
 * SHA-256 of the admin access key. The static site has no backend, so
 * this gate is a deterrent, not real authentication — move the console
 * behind server-side auth before storing sensitive data at scale.
 */
const ADMIN_KEY_HASH =
  "88656baf417f2cf84467d80ab8fe1824c7c4b21513efdf09d6ea34a9ee45a5e7";
const SESSION_FLAG = "gop.admin.session";

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function leadFilename(lead: LeadRecord, index: number): string {
  const name = lead.name
    ? lead.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    : `applicant-${index + 1}`;
  return `gop-applicant-${name}.json`;
}

export function AdminConsole() {
  const [authed, setAuthed] = useState(false);
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<LeadRecord[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_FLAG) === "1") {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) setLeads(readStoredLeads());
  }, [authed]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if ((await sha256Hex(key)) === ADMIN_KEY_HASH) {
      sessionStorage.setItem(SESSION_FLAG, "1");
      setAuthed(true);
      setError(null);
    } else {
      setError("Incorrect access key.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_FLAG);
    setAuthed(false);
    setKey("");
  };

  if (!authed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-sm text-center"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 ring-1 ring-navy-200 dark:bg-white/10 dark:ring-white/15">
          <KeyRound className="h-6 w-6 text-navy-700 dark:text-saffron-300" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-navy-900 dark:text-white">
          Admin console
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Enter the admin access key to manage applicant data.
        </p>
        <form onSubmit={handleLogin} className="mt-6 space-y-3">
          <input
            type="password"
            value={key}
            autoFocus
            onChange={(event) => {
              setKey(event.target.value);
              setError(null);
            }}
            aria-label="Admin access key"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-center text-base text-navy-900 outline-none transition-colors focus:border-navy-400 focus:ring-2 focus:ring-navy-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-saffron-400"
          />
          {error ? (
            <p role="alert" className="text-sm font-medium text-rose-600 dark:text-rose-400">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-navy-900 text-base font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:bg-saffron-400 dark:text-navy-950 dark:hover:bg-saffron-300"
          >
            Unlock
          </button>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-3xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-400/40 dark:bg-emerald-400/10">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-navy-900 dark:text-white">
              Applicant data
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {leads.length} applicant{leads.length === 1 ? "" : "s"} captured in
              this browser
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={leads.length === 0}
            onClick={() =>
              downloadJson(leads, "gop-applicants-all.json")
            }
            className="inline-flex h-10 items-center gap-2 rounded-full bg-navy-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 disabled:opacity-50 dark:bg-saffron-400 dark:text-navy-950 dark:hover:bg-saffron-300"
          >
            <Download className="h-4 w-4" aria-hidden />
            Download all (bulk JSON)
          </button>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Lock console"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-navy-300 hover:text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:border-white/15 dark:text-slate-300 dark:hover:text-white"
          >
            <LogOut className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-white/15">
          <Inbox className="h-8 w-8 text-slate-400" aria-hidden />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            No applicants captured in this browser yet.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-2">
          {leads.map((lead, index) => (
            <li
              key={`${lead.submittedAt}-${index}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy-900 dark:text-white">
                  {lead.name || "(no contact details)"}
                  {lead.email ? (
                    <span className="ml-2 font-normal text-slate-500 dark:text-slate-400">
                      {lead.email}
                    </span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {new Date(lead.submittedAt).toLocaleString("en-IN")} ·{" "}
                  {lead.primaryObjective || "no objective"} ·{" "}
                  {Object.keys(lead.profile).length} attributes · consent:{" "}
                  {lead.consent ? "yes" : "no"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => downloadJson(lead, leadFilename(lead, index))}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-3.5 text-xs font-semibold text-navy-900 transition-colors hover:border-navy-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:border-white/15 dark:text-white dark:hover:border-white/30"
              >
                <FileJson className="h-3.5 w-3.5" aria-hidden />
                JSON
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 text-xs leading-relaxed text-slate-400 dark:text-slate-500">
        This console lists applicants stored in this browser&apos;s local
        storage. On the hosted static site, every submitted lead is also
        emailed to the team inbox, which remains the complete record across
        all visitors.
      </p>
    </motion.div>
  );
}
