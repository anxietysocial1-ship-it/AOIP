import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * The questionnaire artifacts (questions/rules/flow JSON) predate the
 * rebrand and still say "AOIP". Apply to any engine-sourced text before
 * displaying it so the whole experience reads "GOP".
 */
export function brandText(text: string): string {
  return text
    .replace(/Artificial Opportunity Intelligence Platform/g, "Government Opportunity Platform")
    .replace(/AOIP/g, "GOP");
}
