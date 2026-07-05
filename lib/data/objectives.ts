import type { ObjectiveId } from "@/lib/i18n/types";

export interface Objective {
  id: ObjectiveId;
  emoji: string;
  /** Tailwind classes for the icon tile accent. */
  accent: string;
  /**
   * Answer value for Q-OBJ-001 (primary_objective) in the Applicant
   * Intelligence Engine (lib/data/questionnaire). Selecting this card
   * pre-answers that question when the questionnaire flow launches.
   */
  primaryObjective: string;
}

export const OBJECTIVES: Objective[] = [
  {
    id: "start-business",
    emoji: "🚀",
    accent: "from-saffron-400/20 to-saffron-500/5 ring-saffron-400/30",
    primaryObjective: "start_new_business",
  },
  {
    id: "expand-manufacturing",
    emoji: "🏭",
    accent: "from-blue-400/20 to-blue-500/5 ring-blue-400/30",
    primaryObjective: "establish_manufacturing_facility",
  },
  {
    id: "export-products",
    emoji: "🌍",
    accent: "from-emerald-400/20 to-emerald-500/5 ring-emerald-400/30",
    primaryObjective: "increase_exports",
  },
  {
    id: "access-funding",
    emoji: "💰",
    accent: "from-amber-400/20 to-amber-500/5 ring-amber-400/30",
    primaryObjective: "obtain_government_funding",
  },
  {
    id: "go-green",
    emoji: "🌱",
    accent: "from-emerald-400/20 to-emerald-500/5 ring-emerald-400/30",
    primaryObjective: "green_manufacturing",
  },
  {
    id: "adopt-ai",
    emoji: "🤖",
    accent: "from-violet-400/20 to-violet-500/5 ring-violet-400/30",
    primaryObjective: "adopt_digital_technology",
  },
  {
    id: "scale-msme",
    emoji: "📦",
    accent: "from-blue-400/20 to-blue-500/5 ring-blue-400/30",
    primaryObjective: "expand_existing_business",
  },
  {
    id: "women-entrepreneurship",
    emoji: "👩",
    accent: "from-rose-400/20 to-rose-500/5 ring-rose-400/30",
    primaryObjective: "women_entrepreneurship",
  },
  {
    id: "innovate-patent",
    emoji: "🔬",
    accent: "from-cyan-400/20 to-cyan-500/5 ring-cyan-400/30",
    primaryObjective: "innovation_support",
  },
  {
    id: "industrial-infrastructure",
    emoji: "🏗",
    accent: "from-slate-400/20 to-slate-500/5 ring-slate-400/30",
    primaryObjective: "develop_industrial_infrastructure",
  },
];
