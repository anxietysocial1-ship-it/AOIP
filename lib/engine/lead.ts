import type { AnswerValue } from "@/lib/engine/conditions";

export interface LeadContact {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
}

export interface LeadRecord extends LeadContact {
  submittedAt: string;
  locale: string;
  primaryObjective: string;
  profile: Record<string, AnswerValue>;
}

const LEADS_STORAGE_KEY = "aoip.leads";

/**
 * Address that receives one email per completed questionnaire so the
 * team can follow up. FormSubmit requires a one-time activation click
 * (sent to this inbox on the first submission); until then leads are
 * still preserved in localStorage and downloadable from the completion
 * screen.
 */
const LEAD_INBOX = "anxiety.social1@gmail.com";
const LEAD_ENDPOINT = `https://formsubmit.co/ajax/${LEAD_INBOX}`;

export function buildLead(
  contact: LeadContact,
  profile: Record<string, AnswerValue>,
  locale: string,
): LeadRecord {
  return {
    ...contact,
    submittedAt: new Date().toISOString(),
    locale,
    primaryObjective: String(profile["primary_objective"] ?? ""),
    profile,
  };
}

export function storeLeadLocally(lead: LeadRecord): void {
  try {
    const existing = JSON.parse(
      window.localStorage.getItem(LEADS_STORAGE_KEY) ?? "[]",
    ) as LeadRecord[];
    existing.push(lead);
    window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // Storage unavailable — the email path below still applies.
  }
}

/** Send the lead to the team inbox. Resolves false on any failure. */
export async function sendLead(lead: LeadRecord): Promise<boolean> {
  try {
    const response = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `GOP lead: ${lead.name} (${lead.primaryObjective || "no objective"})`,
        _template: "table",
        name: lead.name,
        email: lead.email,
        phone: lead.phone || "—",
        consent: lead.consent ? "yes" : "no",
        locale: lead.locale,
        objective: lead.primaryObjective,
        submitted_at: lead.submittedAt,
        profile: JSON.stringify(lead.profile, null, 2),
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/** Read every applicant record captured in this browser. */
export function readStoredLeads(): LeadRecord[] {
  try {
    const raw = window.localStorage.getItem(LEADS_STORAGE_KEY);
    const parsed = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? (parsed as LeadRecord[]) : [];
  } catch {
    return [];
  }
}

export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
