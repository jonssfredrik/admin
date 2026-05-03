import type { AnalysisCategory, Tone, Verdict } from "@/modules/snaptld/types";
export type { AnalysisCategory, CategoryResult, Signal, Tone, Verdict } from "@/modules/snaptld/types";

export const categoryMeta: Record<AnalysisCategory, { label: string; description: string }> = {
  structure: {
    label: "Struktur",
    description: "Längd, tecken, stavning och läsbarhet",
  },
  lexical: {
    label: "Lexikal",
    description: "Svenska ord, vokaler, böjelser, begriplighet",
  },
  brand: {
    label: "Varumärke",
    description: "Minnesvärdhet, byggbar brand, SaaS-känsla",
  },
  market: {
    label: "Marknad",
    description: "Målgrupp, bransch, kommersiell intent",
  },
  risk: {
    label: "Risk",
    description: "Varumärkeskrockar, juridik, associationer",
  },
  salability: {
    label: "Säljbarhet",
    description: "Flip-barhet, realistiska köpare, prisnivå",
  },
  seo: {
    label: "SEO",
    description: "Domain Authority, backlinks, spam-signaler",
  },
  history: {
    label: "Historik",
    description: "Wayback Machine, tidigare innehåll, flaggor",
  },
};

export const verdictMeta: Record<Verdict, { label: string; tone: Tone; description: string }> = {
  excellent: { label: "Utmärkt", tone: "success", description: "Topp-kandidat, återregistrera direkt" },
  good: { label: "Bra", tone: "success", description: "Starkt val med tydlig potential" },
  mediocre: { label: "Medel", tone: "warning", description: "Fungerar för specifik nisch" },
  skip: { label: "Hoppa över", tone: "danger", description: "Svag kandidat, skippa" },
};

export function toneForScore(score: number): Tone {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  if (score >= 40) return "neutral";
  return "danger";
}

export function verdictForScore(score: number): Verdict {
  if (score >= 82) return "excellent";
  if (score >= 65) return "good";
  if (score >= 45) return "mediocre";
  return "skip";
}

