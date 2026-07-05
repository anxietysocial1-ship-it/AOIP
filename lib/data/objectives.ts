import type { ObjectiveId } from "@/lib/i18n/types";

export interface Objective {
  id: ObjectiveId;
  emoji: string;
  /** Tailwind classes for the icon tile accent. */
  accent: string;
}

export const OBJECTIVES: Objective[] = [
  {
    id: "start-business",
    emoji: "🚀",
    accent: "from-saffron-400/20 to-saffron-500/5 ring-saffron-400/30",
  },
  {
    id: "expand-manufacturing",
    emoji: "🏭",
    accent: "from-blue-400/20 to-blue-500/5 ring-blue-400/30",
  },
  {
    id: "export-products",
    emoji: "🌍",
    accent: "from-emerald-400/20 to-emerald-500/5 ring-emerald-400/30",
  },
  {
    id: "access-funding",
    emoji: "💰",
    accent: "from-amber-400/20 to-amber-500/5 ring-amber-400/30",
  },
  {
    id: "go-green",
    emoji: "🌱",
    accent: "from-emerald-400/20 to-emerald-500/5 ring-emerald-400/30",
  },
  {
    id: "adopt-ai",
    emoji: "🤖",
    accent: "from-violet-400/20 to-violet-500/5 ring-violet-400/30",
  },
  {
    id: "scale-msme",
    emoji: "📦",
    accent: "from-blue-400/20 to-blue-500/5 ring-blue-400/30",
  },
  {
    id: "women-entrepreneurship",
    emoji: "👩",
    accent: "from-rose-400/20 to-rose-500/5 ring-rose-400/30",
  },
  {
    id: "innovate-patent",
    emoji: "🔬",
    accent: "from-cyan-400/20 to-cyan-500/5 ring-cyan-400/30",
  },
  {
    id: "industrial-infrastructure",
    emoji: "🏗",
    accent: "from-slate-400/20 to-slate-500/5 ring-slate-400/30",
  },
];
