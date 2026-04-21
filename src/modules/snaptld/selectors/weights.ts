import type { AnalysisCategory, DomainAnalysis, Verdict, WeightsConfig } from "@/modules/snaptld/types";

const ALL_KEYS: AnalysisCategory[] = [
  "structure",
  "lexical",
  "brand",
  "market",
  "risk",
  "salability",
  "seo",
  "history",
];

const VERDICTS: Verdict[] = ["excellent", "good", "mediocre", "skip"];

function matchNumberBlock(input: string, key: string) {
  const match = input.match(new RegExp(`(?:^|\\n)\\s*${key}:\\s*(\\d+(?:\\.\\d+)?)`, "i"));
  return match ? parseFloat(match[1]) : undefined;
}

function matchStringBlock(input: string, key: string) {
  const match = input.match(new RegExp(`(?:^|\\n)\\s*${key}:\\s*([^\\n#]+)`, "i"));
  return match ? match[1].trim() : "";
}

export function parseWeightsConfig(yaml: string): WeightsConfig {
  const weights: Partial<Record<AnalysisCategory, number>> = {};
  const thresholds: Partial<Record<Verdict, number>> = {};

  const weightsBlock = yaml.match(/weights:\s*([\s\S]*?)(?:\n\S|$)/);
  const thresholdsBlock = yaml.match(/thresholds:\s*([\s\S]*?)(?:\n\S|$)/);
  const aiBlock = yaml.match(/ai:\s*([\s\S]*?)(?:\n\S|$)/);

  for (const key of ALL_KEYS) {
    const value = weightsBlock ? matchNumberBlock(weightsBlock[1], key) : undefined;
    if (typeof value === "number") weights[key] = value;
  }

  for (const verdict of VERDICTS) {
    const value = thresholdsBlock ? matchNumberBlock(thresholdsBlock[1], verdict) : undefined;
    if (typeof value === "number") thresholds[verdict] = value;
  }

  const model = aiBlock ? matchStringBlock(aiBlock[1], "model") : "";
  const enabledCategories = aiBlock?.[1].match(/enabledCategories:\s*\[([^\]]*)\]/i)?.[1]
    ?.split(",")
    .map((value) => value.trim())
    .filter((value): value is AnalysisCategory => ALL_KEYS.includes(value as AnalysisCategory)) ?? [];
  const temperature = aiBlock ? matchNumberBlock(aiBlock[1], "temperature") : undefined;

  const sourceMatches = [...yaml.matchAll(/-\s+id:\s*([^\n]+)\s+enabled:\s*(true|false)/gi)];
  const sources = sourceMatches.map((match) => ({
    id: match[1].trim(),
    enabled: match[2].trim().toLowerCase() === "true",
  }));

  return {
    weights,
    thresholds,
    ai: {
      model,
      enabledCategories,
      temperature,
    },
    sources,
  };
}

export function getWeightEntries(weights: Partial<Record<AnalysisCategory, number>>) {
  const total = ALL_KEYS.reduce((sum, key) => sum + (weights[key] ?? 0), 0) || 1;
  return ALL_KEYS.map((key) => {
    const value = weights[key] ?? 0;
    return {
      key,
      value,
      pct: Math.round((value / total) * 100),
    };
  });
}

export function updateWeightInYaml(yaml: string, key: AnalysisCategory, value: number) {
  const normalizedValue = Math.max(0, Math.round(value));
  const linePattern = new RegExp(`(^\\s+${key}:\\s*)\\d+(?:\\.\\d+)?`, "m");

  if (linePattern.test(yaml)) {
    return yaml.replace(linePattern, `$1${normalizedValue}`);
  }

  const weightsHeaderPattern = /weights:\s*\n/;
  if (weightsHeaderPattern.test(yaml)) {
    return yaml.replace(weightsHeaderPattern, (match) => `${match}  ${key}: ${normalizedValue}\n`);
  }

  return `${yaml.trimEnd()}\n\nweights:\n  ${key}: ${normalizedValue}\n`;
}

function weightedScore(domain: DomainAnalysis, weights: Partial<Record<AnalysisCategory, number>>) {
  const sum = ALL_KEYS.reduce((s, key) => s + (weights[key] ?? 0), 0) || 1;
  const acc = ALL_KEYS.reduce((s, key) => s + domain.categories[key].score * (weights[key] ?? 0), 0);
  return Math.round(acc / sum);
}

export interface WeightRankingRow {
  slug: string;
  domain: string;
  currentScore: number;
  nextScore: number;
  currentRank: number;
  nextRank: number;
}

export function buildWeightRanking(
  domains: DomainAnalysis[],
  current: Partial<Record<AnalysisCategory, number>>,
  next: Partial<Record<AnalysisCategory, number>>,
): WeightRankingRow[] {
  const currentScored = domains.map((domain) => ({ domain, score: weightedScore(domain, current) }));
  const nextScored = domains.map((domain) => ({ domain, score: weightedScore(domain, next) }));
  const currentOrder = [...currentScored].sort((a, b) => b.score - a.score).map((row) => row.domain.slug);
  const nextOrder = [...nextScored].sort((a, b) => b.score - a.score).map((row) => row.domain.slug);

  return nextScored
    .map(({ domain, score }) => ({
      slug: domain.slug,
      domain: domain.domain,
      currentScore: currentScored.find((row) => row.domain.slug === domain.slug)?.score ?? 0,
      nextScore: score,
      currentRank: currentOrder.indexOf(domain.slug) + 1,
      nextRank: nextOrder.indexOf(domain.slug) + 1,
    }))
    .sort((a, b) => a.nextRank - b.nextRank);
}

export function getCategoryWeightMap(config: WeightsConfig) {
  return ALL_KEYS.reduce<Record<AnalysisCategory, number>>((acc, key) => {
    acc[key] = config.weights[key] ?? 0;
    return acc;
  }, {} as Record<AnalysisCategory, number>);
}
