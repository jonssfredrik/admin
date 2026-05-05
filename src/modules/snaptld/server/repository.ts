import type {
  SnapTldDomainAnalysis as PrismaDomainAnalysisRow,
  SnapTldFeedOverride as PrismaFeedOverrideRow,
  SnapTldImportedDomain as PrismaImportedDomainRow,
  SnapTldReport as PrismaReportRow,
  SnapTldState as PrismaStateRow,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { feedSources as rawFeeds, internetstiftelsenFeeds } from "@/modules/snaptld/data/feeds";
import { defaultWeightsYaml } from "@/modules/snaptld/data/weights";
import {
  createDefaultUserState,
  createDefaultSettings,
  mapRawFeed,
} from "@/modules/snaptld/server/mappers";
import { parseWeightsConfig } from "@/modules/snaptld/selectors/weights";
import { analyzeSwedishDomain, type SwedishDomainProfile } from "@/modules/snaptld/server/swedish-lexicon";
import { runOpenAiAnalysis, runOpenAiAnalysisBatch, type AiDomainAnalysis, type AiAnalysisContext, type AiBatchItem } from "@/modules/snaptld/server/openai";
import { fetchWhoisAge, whoisAgeScore, type WhoisAgeResult } from "@/modules/snaptld/server/whois";
import { rankingScore } from "@/modules/snaptld/lib/scoring";
import type {
  AnalysisCategory,
  AnalyzeQueueInput,
  AnalyzeQueueResult,
  AnalysisRunResult,
  CategoryResult,
  CreateReportInput,
  DomainAnalysis,
  DomainNote,
  FeedStatus,
  FeedSource,
  ImportDomainsInput,
  ImportedDomainRecord,
  ImportedDomainsMeta,
  OverviewStats,
  PaginatedResult,
  QueuePageMeta,
  Report,
  RunFeedsResult,
  Signal,
  SnapTldSettings,
  SnapTldUserState,
  SubAnalysisResult,
} from "@/modules/snaptld/types";

type QueueSortKey = "score" | "domain" | "verdict" | "expires" | "source" | "value" | "analysis" | "subanalysis" | "imported";
type SortDir = "asc" | "desc";
type ImportedSortKey = "domain" | "status" | "source" | "importedAt" | "expiresAt" | "score" | "verdict";
type AnalysisStep = AnalyzeQueueInput["steps"][number];
type PrismaDomainAnalysisSummaryRow = Pick<
  PrismaDomainAnalysisRow,
  | "slug"
  | "domain"
  | "tld"
  | "source"
  | "fetchedAt"
  | "importedAt"
  | "expiresAt"
  | "labelLength"
  | "totalScore"
  | "verdict"
  | "status"
  | "analysisStepCount"
  | "subAnalysisCount"
  | "completedSubAnalysisIds"
  | "hasStructure"
  | "hasLexical"
  | "hasBrand"
  | "hasMarket"
  | "hasRisk"
  | "hasSalability"
  | "hasSeo"
  | "hasHistory"
  | "aiSummary"
  | "estimatedValueMin"
  | "estimatedValueMax"
  | "estimatedValueCurrency"
  | "categoriesJson"
>;
type AnalysisConfig = {
  weights: Record<AnalysisCategory, number>;
  thresholds: {
    excellent: number;
    good: number;
    mediocre: number;
  };
};

export interface DomainPageQuery {
  page?: number;
  pageSize?: number;
  query?: string;
  verdict?: "all" | DomainAnalysis["verdict"];
  status?: "all" | DomainAnalysis["status"];
  tld?: "all" | string;
  source?: "all" | DomainAnalysis["source"];
  tagFilter?: string | null;
  onlyWatched?: boolean;
  showHidden?: boolean;
  hideReviewed?: boolean;
  minScore?: number;
  maxScore?: number;
  minDaysUntilExpiry?: number;
  maxDaysUntilExpiry?: number;
  importedAfter?: string;
  importedBefore?: string;
  domainLength?: "short" | "medium" | "long" | "all";
  minDomainLength?: number;
  maxDomainLength?: number;
  minValue?: number;
  maxValue?: number;
  analysisStepMode?: "all" | "none" | "complete" | "has" | "missing";
  analysisStep?: AnalysisCategory | null;
  subAnalysisMode?: "all" | "has" | "missing";
  subAnalysisId?: string | null;
  sortKey?: QueueSortKey;
  sortDir?: SortDir;
  watchedSlugs?: string[];
  hiddenSlugs?: string[];
  reviewedSlugs?: string[];
  notes?: SnapTldUserState["notes"];
}

export interface ImportedPageQuery {
  page?: number;
  pageSize?: number;
  query?: string;
  status?: "all" | ImportedDomainRecord["status"];
  source?: "all" | ImportedDomainRecord["source"];
  tld?: "all" | string;
  sortKey?: ImportedSortKey;
  sortDir?: SortDir;
}

const INTERNETSTIFTELSEN_FEEDS = new Set<string>([
  ...internetstiftelsenFeeds.map((feed) => feed.url),
]);

function emptyCategory(weight: number) {
  return { score: 0, weight, signals: [] };
}

function buildQueuedAnalysis(domain: string, source: DomainAnalysis["source"], expiresAt: string): DomainAnalysis {
  const tld = `.${domain.split(".").pop() ?? ""}`;
  const slug = domain.toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-");
  return {
    id: slug,
    slug,
    domain,
    tld,
    source,
    fetchedAt: new Date().toISOString(),
    importedAt: new Date().toISOString(),
    expiresAt,
    totalScore: 0,
    verdict: "mediocre",
    status: "queued",
    aiSummary: "Importerad och köad för analys.",
    estimatedValue: { min: 0, max: 0, currency: "SEK" },
    categories: {
      structure: emptyCategory(defaultCategoryWeights.structure),
      lexical: emptyCategory(defaultCategoryWeights.lexical),
      brand: emptyCategory(defaultCategoryWeights.brand),
      market: emptyCategory(defaultCategoryWeights.market),
      risk: emptyCategory(defaultCategoryWeights.risk),
      salability: emptyCategory(defaultCategoryWeights.salability),
      seo: emptyCategory(defaultCategoryWeights.seo),
      history: emptyCategory(defaultCategoryWeights.history),
    },
    seo: { domainAuthority: 0, pageAuthority: 0, backlinks: 0, referringDomains: 0, spamScore: 0 },
    wayback: { snapshots: 0, firstSeen: "", lastSeen: "", flags: [] },
  };
}

function sourceFromImportMode(mode: ImportDomainsInput["mode"]): DomainAnalysis["source"] {
  switch (mode) {
    case "text":
      return "manual";
    case "csv":
      return "csv";
    case "json":
      return "url";
    case "url":
    default:
      return "url";
  }
}

function normalizeImportUrl(url: string) {
  const normalized = url.trim();
  const feed = internetstiftelsenFeeds.find((entry) => entry.id === normalized);
  if (feed) return feed.url;
  return normalized;
}

function sourceLabelFromInput(mode: ImportDomainsInput["mode"], url?: string) {
  if (mode === "url" && url && INTERNETSTIFTELSEN_FEEDS.has(normalizeImportUrl(url))) {
    return "Internetstiftelsen";
  }
  if (mode === "csv") return "CSV-import";
  if (mode === "json") return "JSON-import";
  if (mode === "text") return "Manuell import";
  return "URL-import";
}

const defaultCategoryWeights: Record<AnalysisCategory, number> = {
  structure: 12,
  lexical: 12,
  brand: 16,
  market: 14,
  risk: 10,
  salability: 14,
  seo: 12,
  history: 10,
};

const categorySubAnalysisSpecs: Record<AnalysisCategory, Array<{
  id: string;
  label: string;
  maxScore: number;
  provider?: string;
  requiresApiKey?: string;
  runAsync?: boolean;
}>> = {
  structure: [
    { id: "structure-local", label: "Lokal struktur", maxScore: 100 },
  ],
  lexical: [
    { id: "lexicon-local", label: "Svenskt lexikon", maxScore: 100 },
  ],
  brand: [
    { id: "brand-local", label: "Lokal brandbarhet", maxScore: 70 },
    { id: "brand-ai", label: "AI-varumärkesbedömning", maxScore: 30, provider: "OpenAI", requiresApiKey: "openai" },
  ],
  market: [
    { id: "market-local", label: "Lokal nischmatchning", maxScore: 60 },
    { id: "market-ai", label: "AI-marknadsbedömning", maxScore: 40, provider: "OpenAI", requiresApiKey: "openai" },
  ],
  risk: [
    { id: "risk-local", label: "Språkliga riskflaggor", maxScore: 50 },
    { id: "risk-trademark", label: "Extern varumärkeskontroll", maxScore: 50, provider: "OpenAI", requiresApiKey: "openai" },
  ],
  salability: [
    { id: "salability-local", label: "Lokal säljbarhet", maxScore: 60 },
    { id: "salability-ai", label: "AI-köparanalys", maxScore: 40, provider: "OpenAI", requiresApiKey: "openai" },
  ],
  seo: [
    { id: "seo-keyword-local", label: "Lokal keyword-relevans", maxScore: 35 },
    { id: "seo-moz", label: "Moz DA/PA och backlinks", maxScore: 65, provider: "Moz", requiresApiKey: "moz" },
  ],
  history: [
    { id: "history-whois", label: "WHOIS-ålder (RDAP)", maxScore: 50, runAsync: true },
    { id: "history-wayback", label: "Wayback-snapshots", maxScore: 50, provider: "Wayback", requiresApiKey: "wayback" },
  ],
};

const analysisStepOrder: AnalysisCategory[] = [
  "structure",
  "lexical",
  "brand",
  "market",
  "risk",
  "salability",
  "seo",
  "history",
];

const defaultAnalysisConfig: AnalysisConfig = {
  weights: defaultCategoryWeights,
  thresholds: {
    excellent: 82,
    good: 65,
    mediocre: 45,
  },
};

function isAnalysisCategory(value: string): value is AnalysisCategory {
  return (analysisStepOrder as string[]).includes(value);
}

function normalizeAnalysisSteps(steps: AnalysisStep[] | string[] | undefined): AnalysisStep[] {
  const valid = (steps ?? []).filter((step): step is AnalysisStep => step === "overview" || isAnalysisCategory(step));
  return valid.length > 0 ? valid : ["overview"];
}

function buildAnalysisConfig(activeWeightsYaml: string): AnalysisConfig {
  const parsed = parseWeightsConfig(activeWeightsYaml);
  return {
    weights: analysisStepOrder.reduce<Record<AnalysisCategory, number>>((acc, key) => {
      acc[key] = parsed.weights[key] ?? defaultCategoryWeights[key];
      return acc;
    }, {} as Record<AnalysisCategory, number>),
    thresholds: {
      excellent: parsed.thresholds.excellent ?? defaultAnalysisConfig.thresholds.excellent,
      good: parsed.thresholds.good ?? defaultAnalysisConfig.thresholds.good,
      mediocre: parsed.thresholds.mediocre ?? defaultAnalysisConfig.thresholds.mediocre,
    },
  };
}

function hashValue(value: string) {
  let hash = 0;
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) % 1000003;
  }
  return hash;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function hasApiKey(settings: SnapTldSettings, key?: string) {
  if (!key) return true;
  return Boolean(settings.apiKeys[key]?.trim());
}

function getSelectedSubAnalysisIds(
  category: AnalysisCategory,
  selectedSubAnalyses?: AnalyzeQueueInput["selectedSubAnalyses"],
) {
  const explicit = selectedSubAnalyses?.[category];
  return new Set(explicit ?? categorySubAnalysisSpecs[category].map((spec) => spec.id));
}

function shouldRunSubAnalysis(
  category: AnalysisCategory,
  subAnalysisId: string,
  selectedSubAnalyses?: AnalyzeQueueInput["selectedSubAnalyses"],
) {
  return getSelectedSubAnalysisIds(category, selectedSubAnalyses).has(subAnalysisId);
}

function buildSubAnalyses(
  category: AnalysisCategory,
  localScore: number,
  settings: SnapTldSettings,
  selectedSubAnalyses?: AnalyzeQueueInput["selectedSubAnalyses"],
): SubAnalysisResult[] {
  const selectedIds = getSelectedSubAnalysisIds(category, selectedSubAnalyses);
  return categorySubAnalysisSpecs[category].filter((spec) => selectedIds.has(spec.id)).map((spec) => {
    if (spec.runAsync) {
      return {
        id: spec.id,
        label: spec.label,
        status: "failed",
        score: 0,
        maxScore: spec.maxScore,
        reason: "Väntar på RDAP-svar",
      };
    }

    if (!spec.requiresApiKey) {
      return {
        id: spec.id,
        label: spec.label,
        status: "complete",
        score: Math.round((localScore / 100) * spec.maxScore),
        maxScore: spec.maxScore,
      };
    }

    const missingKey = !hasApiKey(settings, spec.requiresApiKey);
    return {
      id: spec.id,
      label: spec.label,
      status: missingKey ? "blocked" : "failed",
      score: 0,
      maxScore: spec.maxScore,
      provider: spec.provider,
      requiresApiKey: spec.requiresApiKey,
      reason: missingKey
        ? `${spec.provider} API-nyckel saknas`
        : `${spec.provider} API-integration är inte implementerad ännu`,
    };
  });
}

function scoreFromSubAnalyses(subAnalyses: SubAnalysisResult[]) {
  return subAnalyses
    .filter((item) => item.status === "complete")
    .reduce((sum, item) => sum + item.score, 0);
}

function maxFromSubAnalyses(subAnalyses: SubAnalysisResult[]) {
  return subAnalyses
    .filter((item) => item.status === "complete")
    .reduce((sum, item) => sum + item.maxScore, 0);
}

function coverageFromSubAnalyses(subAnalyses: SubAnalysisResult[]) {
  const total = subAnalyses.reduce((sum, item) => sum + item.maxScore, 0);
  const available = maxFromSubAnalyses(subAnalyses);
  return total > 0 ? Math.round((available / total) * 100) : 0;
}

function coverageFromCategory(category: CategoryResult) {
  if (category.subAnalyses?.length) return coverageFromSubAnalyses(category.subAnalyses);
  return Math.max(0, Math.min(100, category.scoreMax ?? 0));
}

function buildCategorySignals(category: AnalysisCategory, domain: string, score: number): Signal[] {
  const label = domain.split(".")[0] ?? domain;
  const length = label.length;

  switch (category) {
    case "structure":
      return [
        { label: "Längd", value: `${length} tecken`, tone: score >= 70 ? "success" : "warning" as const },
        { label: "Bindestreck", value: label.includes("-") ? "Ja" : "Nej", tone: label.includes("-") ? "warning" : "success" as const },
      ];
    case "lexical":
      return [
        { label: "Ordform", value: /^[a-z0-9-]+$/i.test(label) ? "Ren" : "Blandad", tone: "success" as const },
        { label: "Begriplighet", value: score >= 75 ? "Hög" : score >= 55 ? "Medel" : "Låg", tone: score >= 75 ? "success" : score >= 55 ? "warning" : "danger" as const },
      ];
    case "brand":
      return [
        { label: "Minnesvärdhet", value: score >= 75 ? "Stark" : "Medel", tone: score >= 75 ? "success" : "warning" as const },
        { label: "Brand-bar", value: score >= 65 ? "Ja" : "Svag", tone: score >= 65 ? "success" : "warning" as const },
      ];
    case "market":
      return [
        { label: "Köpare", value: score >= 70 ? "Tydliga" : "Osäkra", tone: score >= 70 ? "success" : "warning" as const },
        { label: "Intent", value: score >= 70 ? "Kommersiell" : "Begränsad", tone: score >= 70 ? "success" : "neutral" as const },
      ];
    case "risk":
      return [
        { label: "TM-risk", value: score >= 70 ? "Låg" : score >= 50 ? "Medel" : "Hög", tone: score >= 70 ? "success" : score >= 50 ? "warning" : "danger" as const },
        { label: "Spam-risk", value: score >= 65 ? "Låg" : "Förhöjd", tone: score >= 65 ? "success" : "warning" as const },
      ];
    case "salability":
      return [
        { label: "Likviditet", value: score >= 75 ? "God" : "Begränsad", tone: score >= 75 ? "success" : "warning" as const },
        { label: "Flip-potential", value: score >= 75 ? "Hög" : score >= 55 ? "Medel" : "Låg", tone: score >= 75 ? "success" : score >= 55 ? "warning" : "danger" as const },
      ];
    case "seo":
      return [
        { label: "Backlinks", value: `${Math.max(0, Math.round(score * 7))}`, tone: score >= 65 ? "success" : "neutral" as const },
        { label: "Spam-poäng", value: `${Math.max(0, Math.round((100 - score) / 8))}`, tone: score >= 65 ? "success" : "warning" as const },
      ];
    case "history":
      return [
        { label: "Snapshots", value: `${Math.max(0, Math.round(score / 6))}`, tone: score >= 60 ? "success" : "neutral" as const },
        { label: "Historik", value: score >= 60 ? "Ren" : "Oklar", tone: score >= 60 ? "success" : "warning" as const },
      ];
  }
}

function buildCategoryVerdict(category: AnalysisCategory, score: number, domain: string) {
  const bare = domain.split(".")[0] ?? domain;
  switch (category) {
    case "structure":
      return score >= 70 ? `${bare} har en ren struktur som fungerar bra i listor och annonser.` : `${bare} tappar på struktur och bör granskas manuellt.`;
    case "lexical":
      return score >= 70 ? `${bare} är språkligt tydlig och enkel att förstå i en svensk kontext.` : `${bare} är mindre tydlig lexikalt och kan vara svårare att tolka direkt.`;
    case "brand":
      return score >= 70 ? `${bare} har tydlig varumärkespotential och är lätt att komma ihåg.` : `${bare} fungerar bättre som beskrivande domän än som primärt varumärke.`;
    case "market":
      return score >= 70 ? `${bare} har tydliga kommersiella användningsfall och flera sannolika köpare.` : `${bare} saknar just nu en självklar marknadsvinkel.`;
    case "risk":
      return score >= 70 ? `${bare} ser relativt trygg ut ur ett riskperspektiv i den interna kontrollen.` : `${bare} visar riskindikatorer som bör granskas innan registrering.`;
    case "salability":
      return score >= 70 ? `${bare} ser säljbar ut med rimlig chans till vidareförsäljning.` : `${bare} har svagare likviditet och kan bli svår att avyttra.`;
    case "seo":
      return score >= 70 ? `${bare} visar tillräckliga SEO-signaler för att vara värd att bevaka vidare.` : `${bare} har begränsade SEO-signaler i nuläget.`;
    case "history":
      return score >= 70 ? `${bare} har en lugn historik utan tydliga röda flaggor i mockflödet.` : `${bare} har otillräcklig eller svag historik och bör granskas vidare.`;
  }
}

function scoreTone(score: number): Signal["tone"] {
  if (score >= 70) return "success";
  if (score >= 50) return "warning";
  return "danger";
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatYesNo(value: boolean) {
  return value ? "Ja" : "Nej";
}

function buildLexiconCategoryScore(category: AnalysisCategory, profile: SwedishDomainProfile) {
  if (!profile.loaded && category !== "history") {
    const seed = hashValue(`${category}:${profile.label}`);
    return clamp(68 + (seed % 21) - 10, 18, 92);
  }

  const weakSegmentationPenalty = profile.segmentationScore < 0.55 ? 28 : profile.segmentationScore < 0.72 ? 14 : 0;
  const unclearMarketPenalty = profile.commercialIntent < 0.35 ? 24 : profile.commercialIntent < 0.6 ? 10 : 0;
  const personPenalty = profile.personNameRisk ? 22 : 0;
  const trademarkPenalty = profile.trademarkRisk ? 28 : 0;
  const shortFragmentPenalty = Math.min(profile.weakSegments.length, 3) * 8;

  switch (category) {
    case "structure":
      return clamp(Math.round(profile.lengthScore * 0.45 + profile.segmentationScore * 35 + profile.pronounceability * 0.2 - shortFragmentPenalty - (profile.hasHyphen ? 6 : 0) - (profile.hasDigits ? 10 : 0)), 20, 98);
    case "lexical":
      return clamp(Math.round(profile.qualityCoverage * 60 + profile.pronounceability * 0.18 + Math.min(profile.strongSegments.length, 3) * 4 - profile.stopwordRatio * 28 - shortFragmentPenalty - personPenalty * 0.3), 10, 98);
    case "brand":
      return clamp(Math.round(profile.lengthScore * 0.32 + profile.pronounceability * 0.32 + (profile.qualityCoverage < 0.75 ? 10 : 2) + profile.commercialIntent * 10 - weakSegmentationPenalty - personPenalty - trademarkPenalty * 0.4 - profile.stopwordRatio * 30 - (profile.hasDigits ? 12 : 0)), 10, 96);
    case "market":
      return clamp(Math.round(18 + profile.commercialIntent * 48 + Math.min(profile.marketCategories.length, 2) * 8 + Math.min(profile.commercialTerms.length, 3) * 8 + profile.qualityCoverage * 8 - unclearMarketPenalty - personPenalty - trademarkPenalty * 0.25 - profile.stopwordRatio * 12), 8, 96);
    case "risk":
      return clamp(Math.round(88 - profile.riskWords.length * 18 - (profile.trademarkRisk ? 38 : 0) - (profile.personNameRisk ? 12 : 0) - profile.stopwordRatio * 12 - (profile.hasDigits ? 5 : 0)), 10, 96);
    case "salability":
      return clamp(Math.round(profile.lengthScore * 0.24 + profile.pronounceability * 0.18 + profile.qualityCoverage * 14 + profile.commercialIntent * 32 + Math.min(profile.marketCategories.length, 2) * 5 - unclearMarketPenalty - personPenalty - trademarkPenalty * 0.35 - profile.stopwordRatio * 22), 8, 97);
    case "seo":
      return clamp(Math.round(18 + profile.commercialIntent * 32 + profile.qualityCoverage * 14 + Math.min(profile.marketCategories.length, 2) * 7 + Math.min(profile.commercialTerms.length, 3) * 4 - unclearMarketPenalty - personPenalty * 0.5), 5, 90);
    case "history": {
      const seed = hashValue(`history:${profile.label}`);
      return clamp(66 + (seed % 25) - 12, 18, 98);
    }
  }
}

function buildLexiconCategorySignals(category: AnalysisCategory, profile: SwedishDomainProfile, score: number): Signal[] {
  switch (category) {
    case "structure":
      return [
        { label: "Längd", value: `${profile.label.length} tecken`, tone: scoreTone(profile.lengthScore) },
        { label: "Segment", value: profile.segments.slice(0, 4).join(" + ") || "Okända", tone: profile.segmentationScore >= 0.72 ? "success" : profile.segmentationScore >= 0.5 ? "warning" : "danger" },
        { label: "Bindestreck", value: formatYesNo(profile.hasHyphen), tone: profile.hasHyphen ? "warning" : "success" },
      ];
    case "lexical":
      return [
        { label: "Ord-kvalitet", value: formatPercent(profile.qualityCoverage), tone: profile.qualityCoverage >= 0.7 ? "success" : profile.qualityCoverage >= 0.35 ? "warning" : "danger" },
        { label: "Starka ord", value: profile.strongSegments.slice(0, 4).join(", ") || "Saknas", tone: profile.strongSegments.length > 0 ? "success" : "warning" },
        { label: "Stoppord", value: profile.stopwords.length ? profile.stopwords.join(", ") : "Inga", tone: profile.stopwordRatio > 0.35 ? "warning" : "success" },
      ];
    case "brand":
      return [
        { label: "Minnesvärdhet", value: score >= 75 ? "Stark" : score >= 55 ? "Medel" : "Svag", tone: scoreTone(score) },
        { label: "Uttalbarhet", value: `${profile.pronounceability}/100`, tone: scoreTone(profile.pronounceability) },
        { label: "Namn/brand-risk", value: profile.personNameRisk ? "Personnamn" : profile.trademarkRisk ? "Möjlig brandkrock" : "Låg", tone: profile.personNameRisk || profile.trademarkRisk ? "warning" : "success" },
      ];
    case "market":
      return [
        { label: "Nisch", value: profile.marketCategories.join(", ") || "Oklar", tone: profile.marketCategories.length > 0 ? "success" : "warning" },
        { label: "Kommersiella ord", value: profile.commercialTerms.join(", ") || "Inga", tone: profile.commercialTerms.length > 0 ? "success" : "warning" },
      ];
    case "risk":
      return [
        { label: "Språklig risk", value: profile.riskWords.join(", ") || "Inga träffar", tone: profile.riskWords.length > 0 ? "warning" : "success" },
        { label: "Brand/person", value: profile.trademarkRisk ? "Möjlig krock" : profile.personNameRisk ? "Personnamn" : "Inga träffar", tone: profile.trademarkRisk ? "danger" : profile.personNameRisk ? "warning" : "success" },
        { label: "Siffror", value: formatYesNo(profile.hasDigits), tone: profile.hasDigits ? "warning" : "success" },
      ];
    case "salability":
      return [
        { label: "Likviditet", value: score >= 75 ? "God" : score >= 55 ? "Medel" : "Begränsad", tone: scoreTone(score) },
        { label: "Marknadsstöd", value: profile.marketCategories.length ? profile.marketCategories.join(", ") : "Svagt", tone: profile.marketCategories.length > 0 ? "success" : "warning" },
      ];
    case "seo":
      return [
        { label: "Keyword-relevans", value: formatPercent(profile.coverage), tone: profile.coverage >= 0.6 ? "success" : "neutral" },
        { label: "Sökintent", value: profile.commercialTerms.join(", ") || profile.marketCategories.join(", ") || "Oklar", tone: profile.commercialIntent >= 0.5 ? "success" : "warning" },
      ];
    case "history":
      return [
        { label: "WHOIS-ålder", value: "Hämtar RDAP...", tone: "neutral" as const },
      ];
  }
}

function buildLexiconCategoryVerdict(category: AnalysisCategory, score: number, domain: string, profile: SwedishDomainProfile) {
  const bare = domain.split(".")[0] ?? domain;
  const market = profile.marketCategories.length ? ` Nischträffar: ${profile.marketCategories.join(", ")}.` : "";
  switch (category) {
    case "structure":
      return score >= 70 ? `${bare} har en tydlig struktur och kan segmenteras till rimliga ord.` : `${bare} tappar på struktur och bör granskas manuellt.`;
    case "lexical":
      return score >= 70 ? `${bare} har stark svensk ordträff och god begriplighet.` : `${bare} har svagare lexikal träff och kan vara svårare att tolka direkt.`;
    case "brand":
      return score >= 70 ? `${bare} är relativt lätt att minnas och fungerar som varumärkesnamn.` : `${bare} är mindre brandbart baserat på längd, uttal och generiskhet.`;
    case "market":
      return score >= 70 ? `${bare} visar kommersiell intent genom svenska ord och synonymkluster.${market}` : `${bare} saknar tydlig marknadsvinkel i lexikonanalysen.`;
    case "risk":
      return score >= 70 ? `${bare} har inga tydliga språkliga riskflaggor.` : `${bare} innehåller språkliga riskindikatorer som bör granskas.`;
    case "salability":
      return score >= 70 ? `${bare} ser säljbar ut genom begriplighet, marknadsstöd och rimlig längd.` : `${bare} har svagare säljbarhet i den språkliga analysen.`;
    case "seo":
      return score >= 70 ? `${bare} har relevanta svenska keyword-signaler.${market}` : `${bare} har begränsade keyword-signaler i lexikonanalysen.`;
    case "history":
      return `${domain.split(".")[0] ?? domain} — registreringsdatum hämtas via RDAP.`;
  }
}

function analyzeCategory(
  category: AnalysisCategory,
  domain: string,
  config: AnalysisConfig,
  settings: SnapTldSettings,
  selectedSubAnalyses?: AnalyzeQueueInput["selectedSubAnalyses"],
): CategoryResult {
  const profile = analyzeSwedishDomain(domain);
  const localScore = buildLexiconCategoryScore(category, profile);
  const subAnalyses = buildSubAnalyses(category, localScore, settings, selectedSubAnalyses);
  if (subAnalyses.length === 0) {
    return {
      score: 0,
      scoreMax: 0,
      weight: config.weights[category],
      signals: [],
      verdict: "",
      subAnalyses: [],
    };
  }
  const score = scoreFromSubAnalyses(subAnalyses);
  const scoreMax = maxFromSubAnalyses(subAnalyses);
  const selectedLocalSpecs = categorySubAnalysisSpecs[category].filter((spec) =>
    subAnalyses.some((sub) => sub.id === spec.id) && !spec.requiresApiKey && !spec.runAsync
  );
  return {
    score,
    scoreMax,
    weight: config.weights[category],
    signals: [
      ...(selectedLocalSpecs.length > 0 ? buildLexiconCategorySignals(category, profile, localScore) : []),
      ...subAnalyses
        .filter((item) => item.status !== "complete")
        .map((item): Signal => ({
          label: item.label,
          value: item.reason ?? "Ej körd",
          tone: item.status === "failed" ? "danger" : "warning",
        })),
    ],
    verdict: selectedLocalSpecs.length > 0 ? buildLexiconCategoryVerdict(category, localScore, domain, profile) : "",
    subAnalyses,
  };
}

interface NormalizeCategoryOptions {
  expandLegacySubAnalyses?: boolean;
}

function normalizeCategoryResult(
  category: AnalysisCategory,
  result: CategoryResult,
  options: NormalizeCategoryOptions = { expandLegacySubAnalyses: true },
): CategoryResult {
  if (result.subAnalyses?.length) {
    return {
      ...result,
      score: scoreFromSubAnalyses(result.subAnalyses),
      scoreMax: maxFromSubAnalyses(result.subAnalyses),
    };
  }

  if (result.score <= 0 && result.signals.length === 0 && !result.verdict) {
    return { ...result, score: 0, scoreMax: 0, subAnalyses: [] };
  }

  const specs = categorySubAnalysisSpecs[category];
  const localMax = specs.filter((spec) => !spec.requiresApiKey).reduce((sum, spec) => sum + spec.maxScore, 0);
  if (!options.expandLegacySubAnalyses) {
    return {
      ...result,
      score: Math.min(Math.round((clamp(result.score, 0, 100) / 100) * localMax), localMax),
      scoreMax: localMax,
      subAnalyses: [],
    };
  }

  const subAnalyses: SubAnalysisResult[] = specs.map((spec) => {
    if (!spec.requiresApiKey) {
      return {
        id: spec.id,
        label: spec.label,
        status: "complete",
        score: Math.round((clamp(result.score, 0, 100) / 100) * spec.maxScore),
        maxScore: spec.maxScore,
      };
    }
    return {
      id: spec.id,
      label: spec.label,
      status: "blocked",
      score: 0,
      maxScore: spec.maxScore,
      provider: spec.provider,
      requiresApiKey: spec.requiresApiKey,
      reason: "Legacyanalys saknar verifierad API-körning",
    };
  });

  return {
    ...result,
    score: Math.min(scoreFromSubAnalyses(subAnalyses), localMax),
    scoreMax: localMax,
    subAnalyses,
  };
}

function normalizeCategories(categories: DomainAnalysis["categories"], options?: NormalizeCategoryOptions) {
  return analysisStepOrder.reduce<Record<AnalysisCategory, CategoryResult>>((acc, key) => {
    acc[key] = normalizeCategoryResult(key, categories[key], options);
    return acc;
  }, {} as Record<AnalysisCategory, CategoryResult>);
}

function scoreDomainFromCategories(categories: DomainAnalysis["categories"]) {
  let weightedQuality = 0;
  let qualityWeight = 0;
  let weightedCoverage = 0;
  let totalWeight = 0;

  for (const key of analysisStepOrder) {
    const result = categories[key];
    totalWeight += result.weight;
    if (hasCategoryResult(result) && (result.scoreMax ?? 0) > 0) {
      weightedQuality += Math.min(100, Math.round((result.score / Math.max(1, result.scoreMax ?? 1)) * 100)) * result.weight;
      qualityWeight += result.weight;
      weightedCoverage += Math.min(100, result.scoreMax ?? 0) * result.weight;
    }
  }

  const coverage = totalWeight > 0 ? Math.round(weightedCoverage / totalWeight) : 0;
  const quality = qualityWeight > 0 ? Math.round(weightedQuality / qualityWeight) : 0;
  const confidenceFactor = coverage >= 80 ? 1 : coverage >= 55 ? 0.82 : coverage >= 35 ? 0.62 : coverage > 0 ? 0.35 : 0;
  return {
    totalScore: Math.round(quality * confidenceFactor),
    scoreMax: coverage,
  };
}

function withScoreEnvelope(domain: DomainAnalysis): DomainAnalysis {
  const categories = normalizeCategories(domain.categories);
  const { totalScore, scoreMax } = scoreDomainFromCategories(categories);
  const rankScore = rankingScore({ totalScore, scoreMax });
  return {
    ...domain,
    categories,
    totalScore,
    scoreMax,
    coverage: scoreMax,
    verdict: scoreToVerdict(rankScore, defaultAnalysisConfig),
  };
}

function compactDomainAnalysis(domain: DomainAnalysis): DomainAnalysis {
  return {
    ...domain,
    categories: analysisStepOrder.reduce<Record<AnalysisCategory, CategoryResult>>((acc, key) => {
      const category = domain.categories[key];
      acc[key] = {
        score: category.score,
        scoreMax: category.scoreMax,
        weight: category.weight,
        signals: [],
        verdict: category.verdict,
        subAnalyses: [],
      };
      return acc;
    }, {} as Record<AnalysisCategory, CategoryResult>),
    seo: { domainAuthority: 0, pageAuthority: 0, backlinks: 0, referringDomains: 0, spamScore: 0 },
    wayback: { snapshots: 0, firstSeen: "", lastSeen: "", flags: [] },
  };
}

function summarizeDomain(domain: DomainAnalysis) {
  if (domain.totalScore >= 82) return `${domain.domain} ser stark ut efter senaste genomkörningen och bör följas upp direkt.`;
  if (domain.totalScore >= 65) return `${domain.domain} är en stabil kandidat med flera positiva signaler efter senaste analysen.`;
  if (domain.totalScore >= 45) return `${domain.domain} har blandad kvalitet och passar bäst för selektiv uppföljning.`;
  return `${domain.domain} visar svagare signaler efter senaste analysen och bör prioriteras lägre.`;
}

function scoreToVerdict(score: number, config: AnalysisConfig) {
  if (score >= config.thresholds.excellent) return "excellent";
  if (score >= config.thresholds.good) return "good";
  if (score >= config.thresholds.mediocre) return "mediocre";
  return "skip";
}

function domainQualityScoreCap(domain: string) {
  const profile = analyzeSwedishDomain(domain);
  if (profile.trademarkRisk) return 42;
  if (profile.personNameRisk && profile.commercialIntent < 0.55) return 38;
  if (profile.segmentationScore < 0.45 && profile.commercialIntent < 0.35) return 35;
  if (profile.commercialIntent < 0.25 && profile.genericWordIntent < 0.6 && profile.marketCategories.length === 0) return 55;
  return 100;
}

function hasCategoryResult(result: CategoryResult) {
  return result.score > 0 || (result.scoreMax ?? 0) > 0 || result.signals.length > 0 || Boolean(result.verdict);
}

type AiCategory = keyof Omit<AiDomainAnalysis, "summary">;
const AI_CATEGORY_SPEC_IDS: Record<AiCategory, string> = {
  brand: "brand-ai",
  market: "market-ai",
  risk: "risk-trademark",
  salability: "salability-ai",
};
const AI_CATEGORIES = Object.keys(AI_CATEGORY_SPEC_IDS) as AiCategory[];

function applyAiCategoryResult(
  result: CategoryResult,
  subAnalysisId: string,
  ai: AiDomainAnalysis[AiCategory],
): CategoryResult {
  const subAnalyses = (result.subAnalyses ?? []).map((sub) =>
    sub.id === subAnalysisId ? { ...sub, status: "complete" as const, score: ai.score, reason: undefined } : sub,
  );
  const aiSubLabel = result.subAnalyses?.find((sub) => sub.id === subAnalysisId)?.label ?? "";
  const filteredSignals = result.signals.filter((sig) => sig.label !== aiSubLabel);
  return {
    ...result,
    score: scoreFromSubAnalyses(subAnalyses),
    scoreMax: maxFromSubAnalyses(subAnalyses),
    signals: [...filteredSignals, ...ai.signals],
    verdict: ai.verdict || result.verdict,
    subAnalyses,
  };
}

function applyWhoisResult(
  result: CategoryResult,
  whois: WhoisAgeResult,
): CategoryResult {
  const { createdAt, ageYears } = whois;
  const score = whoisAgeScore(ageYears);
  const subAnalyses = (result.subAnalyses ?? []).map((sub) =>
    sub.id === "history-whois" ? { ...sub, status: "complete" as const, score } : sub,
  );
  const ageLabel =
    ageYears >= 1 ? `${Math.floor(ageYears)} år` : `${Math.floor(ageYears * 12)} mån`;
  const ageTone: Signal["tone"] =
    ageYears >= 10 ? "success" : ageYears >= 3 ? "warning" : "danger";
  const year = createdAt.slice(0, 4);
  const verdict =
    ageYears >= 10
      ? `Domänen registrerades ${year} och är ${Math.floor(ageYears)} år gammal — stark ålderssignal.`
      : ageYears >= 3
        ? `Domänen registrerades ${year} — acceptabel ålder men inte veteran.`
        : `Domänen är relativt ny (registrerad ${createdAt}) — begränsad ålderssignal.`;
  return {
    ...result,
    score: scoreFromSubAnalyses(subAnalyses),
    scoreMax: maxFromSubAnalyses(subAnalyses),
    signals: [{ label: "Registrerat", value: `${createdAt} (${ageLabel})`, tone: ageTone }],
    verdict,
    subAnalyses,
  };
}

function runLocalCategories(
  domain: DomainAnalysis,
  steps: AnalysisCategory[],
  config: AnalysisConfig,
  settings: SnapTldSettings,
  selectedSubAnalyses?: AnalyzeQueueInput["selectedSubAnalyses"],
): Record<AnalysisCategory, CategoryResult> {
  const categories = normalizeCategories(domain.categories);
  for (const step of steps) {
    categories[step] = analyzeCategory(step, domain.domain, config, settings, selectedSubAnalyses);
  }
  return categories;
}

function buildAiContext(domain: DomainAnalysis, categories: Record<AnalysisCategory, CategoryResult>): AiAnalysisContext {
  const whoisSub = categories["history"]?.subAnalyses?.find((s) => s.id === "history-whois" && s.status === "complete");
  const registeredSignal = categories["history"]?.signals?.find((s) => s.label === "Registrerat");
  const registeredAt = registeredSignal?.value.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  const domainAgeYears = whoisSub && whoisSub.score > 0
    ? whoisSub.score >= 50 ? 15
      : whoisSub.score >= 43 ? 10
      : whoisSub.score >= 35 ? 5
      : whoisSub.score >= 25 ? 2
      : whoisSub.score >= 15 ? 1
      : 0.5
    : undefined;
  return {
    tld: domain.tld,
    expiresAt: domain.expiresAt,
    source: domain.source,
    localBrandScore: categories["brand"].score,
    localMarketScore: categories["market"].score,
    localRiskScore: categories["risk"].score,
    localSalabilityScore: categories["salability"].score,
    registeredAt,
    domainAgeYears,
  };
}

function applyAiResults(
  categories: Record<AnalysisCategory, CategoryResult>,
  aiSteps: AiCategory[],
  aiResult: AiDomainAnalysis,
): Record<AnalysisCategory, CategoryResult> {
  for (const cat of aiSteps) {
    categories[cat] = applyAiCategoryResult(categories[cat], AI_CATEGORY_SPEC_IDS[cat], aiResult[cat]);
  }
  return categories;
}

function finalizeDomain(
  domain: DomainAnalysis,
  categories: Record<AnalysisCategory, CategoryResult>,
  config: AnalysisConfig,
  aiSummaryText: string | null,
): DomainAnalysis {
  const now = new Date().toISOString();
  const { totalScore, scoreMax } = scoreDomainFromCategories(categories);
  const cappedTotalScore = Math.min(totalScore, domainQualityScoreCap(domain.domain));
  const rankScore = rankingScore({ totalScore: cappedTotalScore, scoreMax });
  const next: DomainAnalysis = {
    ...domain,
    fetchedAt: now,
    status: "analyzed",
    categories,
    totalScore: cappedTotalScore,
    scoreMax,
    coverage: scoreMax,
    verdict: scoreToVerdict(rankScore, config),
    aiSummary: "",
    estimatedValue: {
      min: Math.max(0, cappedTotalScore * 120),
      max: Math.max(0, cappedTotalScore * 240),
      currency: "SEK",
    },
    seo: domain.seo,
    wayback: domain.wayback,
  };
  next.aiSummary = aiSummaryText ?? summarizeDomain(next);
  return next;
}

function normalizeSteps(requestedSteps: AnalysisStep[]): AnalysisCategory[] {
  const normalized = normalizeAnalysisSteps(requestedSteps);
  return normalized.includes("overview")
    ? [...analysisStepOrder]
    : normalized.filter((s): s is AnalysisCategory => s !== "overview");
}

// Single domain — used for rerunAnalysis
async function analyzeDomainAsync(
  domain: DomainAnalysis,
  requestedSteps: AnalysisStep[],
  config = defaultAnalysisConfig,
  settings = createDefaultSettings(),
  selectedSubAnalyses?: AnalyzeQueueInput["selectedSubAnalyses"],
): Promise<DomainAnalysis> {
  const steps = normalizeSteps(requestedSteps);
  const categories = runLocalCategories(domain, steps, config, settings, selectedSubAnalyses);

  // WHOIS age (history step, no API key needed)
  if (steps.includes("history") && shouldRunSubAnalysis("history", "history-whois", selectedSubAnalyses)) {
    const whoisResult = await fetchWhoisAge(domain.domain);
    if (whoisResult) categories["history"] = applyWhoisResult(categories["history"], whoisResult);
  }

  const openaiKey = settings.apiKeys["openai"]?.trim();
  const aiSteps = steps.filter((s): s is AiCategory =>
    AI_CATEGORIES.includes(s as AiCategory)
    && shouldRunSubAnalysis(s as AnalysisCategory, AI_CATEGORY_SPEC_IDS[s as AiCategory], selectedSubAnalyses)
  );
  let aiSummaryText: string | null = null;

  if (openaiKey && aiSteps.length > 0) {
    const profile = analyzeSwedishDomain(domain.domain);
    const aiResult = await runOpenAiAnalysis(domain.domain, profile, openaiKey, buildAiContext(domain, categories));
    if (aiResult) {
      applyAiResults(categories, aiSteps, aiResult);
      if (aiResult.summary) aiSummaryText = aiResult.summary;
    }
  }

  return finalizeDomain(domain, categories, config, aiSummaryText);
}

// Multiple domains with batched AI calls (max 10 per request) — used for analyzeQueue and importDomains
async function analyzeDomainsAsync(
  domains: DomainAnalysis[],
  requestedSteps: AnalysisStep[],
  config = defaultAnalysisConfig,
  settings = createDefaultSettings(),
  selectedSubAnalyses?: AnalyzeQueueInput["selectedSubAnalyses"],
): Promise<DomainAnalysis[]> {
  if (domains.length === 0) return [];

  const steps = normalizeSteps(requestedSteps);
  const aiSteps = steps.filter((s): s is AiCategory =>
    AI_CATEGORIES.includes(s as AiCategory)
    && shouldRunSubAnalysis(s as AnalysisCategory, AI_CATEGORY_SPEC_IDS[s as AiCategory], selectedSubAnalyses)
  );
  const openaiKey = settings.apiKeys["openai"]?.trim();

  // 1. Local analysis for all domains
  const localResults = domains.map((domain) => ({
    domain,
    categories: runLocalCategories(domain, steps, config, settings, selectedSubAnalyses),
  }));

  // 2. WHOIS age fetches (history step, parallel, no API key needed)
  if (steps.includes("history") && shouldRunSubAnalysis("history", "history-whois", selectedSubAnalyses)) {
    const whoisResults = await Promise.all(
      localResults.map(async ({ domain }) => ({
        domainName: domain.domain,
        result: await fetchWhoisAge(domain.domain),
      })),
    );
    for (const { domainName, result } of whoisResults) {
      if (!result) continue;
      const entry = localResults.find((r) => r.domain.domain === domainName);
      if (entry) entry.categories["history"] = applyWhoisResult(entry.categories["history"], result);
    }
  }

  // 3. Batch AI calls (max 10 per request)
  const aiResultMap = new Map<string, AiDomainAnalysis>();
  if (openaiKey && aiSteps.length > 0) {
    const batchItems: AiBatchItem[] = localResults.map(({ domain, categories }) => ({
      domain: domain.domain,
      profile: analyzeSwedishDomain(domain.domain),
      ctx: buildAiContext(domain, categories),
    }));

    for (let i = 0; i < batchItems.length; i += 10) {
      const batch = batchItems.slice(i, i + 10);
      const batchResults = await runOpenAiAnalysisBatch(batch, openaiKey);
      batchResults.forEach((result, domainName) => aiResultMap.set(domainName, result));
    }
  }

  // 4. Apply AI results and finalize
  return localResults.map(({ domain, categories }) => {
    const aiResult = aiResultMap.get(domain.domain) ?? null;
    let aiSummaryText: string | null = null;
    if (aiResult) {
      applyAiResults(categories, aiSteps, aiResult);
      if (aiResult.summary) aiSummaryText = aiResult.summary;
    }
    return finalizeDomain(domain, categories, config, aiSummaryText);
  });
}

function parseLooseDateTime(value: string, fallback = new Date()) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (!match) return fallback;
  const [, year, month, day, hour = "00", minute = "00", second = "00"] = match;
  return new Date(
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    ),
  );
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapStateRow(row: PrismaStateRow): SnapTldUserState {
  const fallback = createDefaultUserState();
  return {
    watchlist: parseJson(row.watchlistJson, fallback.watchlist),
    reviewed: parseJson(row.reviewedJson, fallback.reviewed),
    hidden: parseJson(row.hiddenJson, fallback.hidden),
    notes: parseJson(row.notesJson, fallback.notes),
    activeWeightsYaml: row.activeWeightsYaml,
    settings: parseJson(row.settingsJson, fallback.settings),
  };
}

function mapPrismaDomainAnalysis(row: PrismaDomainAnalysisRow, options?: NormalizeCategoryOptions): DomainAnalysis {
  const fallback = buildQueuedAnalysis(row.domain, row.source as DomainAnalysis["source"], row.expiresAt);
  const categories = normalizeCategories(parseJson(row.categoriesJson, fallback.categories), options);
  const { totalScore, scoreMax } = scoreDomainFromCategories(categories);
  const rankScore = rankingScore({ totalScore, scoreMax });
  const status = normalizeAnalysisStatus(row.status as DomainAnalysis["status"], categories);
  return {
    id: row.slug,
    slug: row.slug,
    domain: row.domain,
    tld: row.tld,
    source: row.source as DomainAnalysis["source"],
    fetchedAt: row.fetchedAt.toISOString(),
    importedAt: row.importedAt.toISOString(),
    expiresAt: row.expiresAt,
    totalScore,
    scoreMax,
    coverage: scoreMax,
    subAnalysisCount: row.subAnalysisCount,
    completedSubAnalysisIds: row.completedSubAnalysisIds.split("|").filter(Boolean),
    verdict: status === "analyzed" ? scoreToVerdict(rankScore, defaultAnalysisConfig) : (row.verdict as DomainAnalysis["verdict"]),
    status,
    aiSummary: row.aiSummary,
    estimatedValue: {
      min: row.estimatedValueMin,
      max: row.estimatedValueMax,
      currency: row.estimatedValueCurrency as DomainAnalysis["estimatedValue"]["currency"],
    },
    categories,
    seo: parseJson(row.seoJson, fallback.seo),
    wayback: parseJson(row.waybackJson, fallback.wayback),
  };
}

function mapPrismaDomainAnalysisSummary(row: PrismaDomainAnalysisSummaryRow, options?: NormalizeCategoryOptions): DomainAnalysis {
  const fallback = buildQueuedAnalysis(row.domain, row.source as DomainAnalysis["source"], row.expiresAt);
  const categories = normalizeCategories(parseJson(row.categoriesJson, fallback.categories), options);
  const { totalScore, scoreMax } = scoreDomainFromCategories(categories);
  const rankScore = rankingScore({ totalScore, scoreMax });
  return {
    id: row.slug,
    slug: row.slug,
    domain: row.domain,
    tld: row.tld,
    source: row.source as DomainAnalysis["source"],
    fetchedAt: row.fetchedAt.toISOString(),
    importedAt: row.importedAt.toISOString(),
    expiresAt: row.expiresAt,
    totalScore,
    scoreMax,
    coverage: scoreMax,
    subAnalysisCount: row.subAnalysisCount,
    completedSubAnalysisIds: row.completedSubAnalysisIds.split("|").filter(Boolean),
    verdict: scoreToVerdict(rankScore, defaultAnalysisConfig),
    status: normalizeAnalysisStatus(row.status as DomainAnalysis["status"], categories),
    aiSummary: row.aiSummary,
    estimatedValue: {
      min: row.estimatedValueMin,
      max: row.estimatedValueMax,
      currency: row.estimatedValueCurrency as DomainAnalysis["estimatedValue"]["currency"],
    },
    categories,
    seo: fallback.seo,
    wayback: fallback.wayback,
  };
}

function mapPrismaImportedDomain(row: PrismaImportedDomainRow): ImportedDomainRecord {
  return {
    id: row.slug,
    slug: row.slug,
    domain: row.domain,
    tld: row.tld,
    source: row.source as ImportedDomainRecord["source"],
    sourceLabel: row.sourceLabel,
    importedAt: row.importedAt.toISOString(),
    importedBy: row.importedBy,
    batchId: row.batchId,
    status: row.status as ImportedDomainRecord["status"],
    expiresAt: row.expiresAt,
    totalScore: row.totalScore,
    verdict: row.verdict as ImportedDomainRecord["verdict"],
    estimatedValue: {
      min: row.estimatedValueMin,
      max: row.estimatedValueMax,
      currency: row.estimatedValueCurrency as ImportedDomainRecord["estimatedValue"]["currency"],
    },
  };
}

function mapPrismaReport(row: PrismaReportRow): Report {
  return {
    id: row.id,
    title: row.title,
    generatedAt: row.generatedAt.toISOString(),
    domains: row.domains,
    highlight: row.highlight,
    format: row.format as Report["format"],
  };
}

function getAnalysisSteps(categories: DomainAnalysis["categories"]) {
  return analysisStepOrder.filter((key) => {
    const category = categories[key];
    return category.score > 0 || category.signals.length > 0 || Boolean(category.verdict);
  });
}

function getCompletedSubAnalysisIds(categories: DomainAnalysis["categories"]) {
  return analysisStepOrder.flatMap((key) =>
    (categories[key].subAnalyses ?? [])
      .filter((subAnalysis) => subAnalysis.status === "complete")
      .map((subAnalysis) => subAnalysis.id),
  );
}

function getLabelLength(domain: string) {
  return (domain.split(".")[0] ?? domain).length;
}

function buildDomainAnalysisIndex(domain: Pick<DomainAnalysis, "domain" | "categories">) {
  const steps = getAnalysisSteps(domain.categories);
  const stepSet = new Set(steps);
  const completedSubAnalysisIds = getCompletedSubAnalysisIds(domain.categories);
  return {
    labelLength: getLabelLength(domain.domain),
    analysisStepCount: steps.length,
    subAnalysisCount: completedSubAnalysisIds.length,
    completedSubAnalysisIds: completedSubAnalysisIds.length ? `|${completedSubAnalysisIds.join("|")}|` : "",
    hasStructure: stepSet.has("structure"),
    hasLexical: stepSet.has("lexical"),
    hasBrand: stepSet.has("brand"),
    hasMarket: stepSet.has("market"),
    hasRisk: stepSet.has("risk"),
    hasSalability: stepSet.has("salability"),
    hasSeo: stepSet.has("seo"),
    hasHistory: stepSet.has("history"),
  };
}

const analysisStepColumn: Record<AnalysisCategory, string> = {
  structure: "hasStructure",
  lexical: "hasLexical",
  brand: "hasBrand",
  market: "hasMarket",
  risk: "hasRisk",
  salability: "hasSalability",
  seo: "hasSeo",
  history: "hasHistory",
};

function hasAnalysisSteps(categories: DomainAnalysis["categories"]) {
  return getAnalysisSteps(categories).length > 0;
}

function normalizeAnalysisStatus(status: DomainAnalysis["status"], categories: DomainAnalysis["categories"]): DomainAnalysis["status"] {
  return status === "analyzed" && !hasAnalysisSteps(categories) ? "queued" : status;
}

function reconcileImportedStatus(
  recordStatus: ImportedDomainRecord["status"],
  analysisStatus?: DomainAnalysis["status"],
): ImportedDomainRecord["status"] {
  if (recordStatus === "analyzed") return analysisStatus ?? "queued";
  if (recordStatus === "queued" && analysisStatus === "analyzed") return "analyzed";
  return recordStatus;
}

function withAnalysisSteps(
  records: ImportedDomainRecord[],
  analyses: Array<Pick<DomainAnalysis, "slug" | "status" | "categories" | "totalScore" | "scoreMax" | "coverage" | "verdict" | "estimatedValue">>,
) {
  const analysisBySlug = new Map(analyses.map((analysis) => [analysis.slug, analysis] as const));
  return records.map((record) => {
    const analysis = analysisBySlug.get(record.slug);
    const analysisSteps = analysis ? getAnalysisSteps(analysis.categories) : [];
    const analysisCoverage = analysis
      ? analysisStepOrder.reduce<NonNullable<ImportedDomainRecord["analysisCoverage"]>>((acc, key) => {
          acc[key] = coverageFromCategory(analysis.categories[key]);
          return acc;
        }, {})
      : undefined;
    const analysisStatus = analysis
      ? normalizeAnalysisStatus(analysis.status, analysis.categories)
      : undefined;

    return {
      ...record,
      status: reconcileImportedStatus(record.status, analysisStatus),
      totalScore: analysis?.totalScore ?? record.totalScore,
      scoreMax: analysis?.scoreMax ?? record.scoreMax,
      coverage: analysis?.coverage ?? record.coverage,
      verdict: analysis?.verdict ?? record.verdict,
      estimatedValue: analysis?.estimatedValue ?? record.estimatedValue,
      analysisSteps,
      analysisCoverage,
    };
  });
}

function normalizePage(page?: number) {
  return Math.max(1, Math.floor(Number.isFinite(page ?? NaN) ? page ?? 1 : 1));
}

function normalizePageSize(pageSize?: number, fallback = 50, max = 200) {
  const value = Math.floor(Number.isFinite(pageSize ?? NaN) ? pageSize ?? fallback : fallback);
  return Math.max(1, Math.min(max, value));
}

function paginate<T>(items: T[], page?: number, pageSize?: number, maxPageSize = 200): PaginatedResult<T> {
  const normalizedPage = normalizePage(page);
  const normalizedPageSize = normalizePageSize(pageSize, 50, maxPageSize);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / normalizedPageSize));
  const clampedPage = Math.min(normalizedPage, totalPages);
  const start = (clampedPage - 1) * normalizedPageSize;
  return {
    items: items.slice(start, start + normalizedPageSize),
    total,
    page: clampedPage,
    pageSize: normalizedPageSize,
    totalPages,
  };
}

function sortDomains(domains: DomainAnalysis[], sortKey: QueueSortKey = "score", sortDir: SortDir = "desc") {
  const dir = sortDir === "asc" ? 1 : -1;
  return [...domains].sort((a, b) => {
    switch (sortKey) {
      case "domain":
        return a.domain.localeCompare(b.domain) * dir;
      case "verdict":
        return a.verdict.localeCompare(b.verdict) * dir;
      case "expires":
        return a.expiresAt.localeCompare(b.expiresAt) * dir;
      case "imported":
        return (a.importedAt ?? "").localeCompare(b.importedAt ?? "") * dir;
      case "source":
        return a.source.localeCompare(b.source) * dir;
      case "value":
        return (a.estimatedValue.min - b.estimatedValue.min) * dir;
      case "analysis":
        return (getAnalysisSteps(a.categories).length - getAnalysisSteps(b.categories).length) * dir;
      case "score":
      default:
        return (rankingScore(a) - rankingScore(b)) * dir;
    }
  });
}

function filterDomains(domains: DomainAnalysis[], input: DomainPageQuery) {
  const query = input.query?.trim().toLowerCase() ?? "";
  const watched = new Set(input.watchedSlugs ?? []);
  const hidden = new Set(input.hiddenSlugs ?? []);
  const reviewed = new Set(input.reviewedSlugs ?? []);
  const tagged =
    input.tagFilter && input.notes
      ? new Set(Object.entries(input.notes).filter(([, note]) => note.tags.includes(input.tagFilter as string)).map(([slug]) => slug))
      : null;

  return domains.filter((domain) => {
    if (input.verdict && input.verdict !== "all" && domain.verdict !== input.verdict) return false;
    if (input.status && input.status !== "all" && domain.status !== input.status) return false;
    if (input.tld && input.tld !== "all" && domain.tld !== input.tld) return false;
    if (input.source && input.source !== "all" && domain.source !== input.source) return false;
    if (tagged && !tagged.has(domain.slug)) return false;
    if (input.onlyWatched && !watched.has(domain.slug)) return false;
    if (input.hideReviewed && reviewed.has(domain.slug)) return false;

    const isHidden = hidden.has(domain.slug);
    if (isHidden && !input.showHidden) return false;
    if (!isHidden && input.showHidden) return false;

    const score = rankingScore(domain);
    if (input.minScore !== undefined && input.minScore > 0 && score < input.minScore) return false;
    if (input.maxScore !== undefined && input.maxScore > 0 && score > input.maxScore) return false;

    if (input.minDaysUntilExpiry !== undefined || input.maxDaysUntilExpiry !== undefined) {
      const daysUntil = Math.ceil((new Date(domain.expiresAt).getTime() - Date.now()) / 86_400_000);
      if (input.minDaysUntilExpiry !== undefined && input.minDaysUntilExpiry >= 0 && daysUntil < input.minDaysUntilExpiry) return false;
      if (input.maxDaysUntilExpiry !== undefined && input.maxDaysUntilExpiry >= 0 && daysUntil > input.maxDaysUntilExpiry) return false;
    }
    if (input.importedAfter && (!domain.importedAt || domain.importedAt.slice(0, 10) < input.importedAfter)) return false;
    if (input.importedBefore && (!domain.importedAt || domain.importedAt.slice(0, 10) > input.importedBefore)) return false;

    const labelLen = (domain.domain.split(".")[0] ?? domain.domain).length;
    if (input.domainLength && input.domainLength !== "all") {
      if (input.domainLength === "short" && labelLen > 7) return false;
      if (input.domainLength === "medium" && (labelLen < 8 || labelLen > 12)) return false;
      if (input.domainLength === "long" && labelLen < 13) return false;
    }
    if (input.minDomainLength !== undefined && input.minDomainLength > 0 && labelLen < input.minDomainLength) return false;
    if (input.maxDomainLength !== undefined && input.maxDomainLength > 0 && labelLen > input.maxDomainLength) return false;

    if (input.minValue !== undefined && input.minValue > 0 && domain.estimatedValue.max < input.minValue) return false;
    if (input.maxValue !== undefined && input.maxValue > 0 && domain.estimatedValue.min > input.maxValue) return false;

    const analysisSteps = getAnalysisSteps(domain.categories);
    const analysisStepSet = new Set(analysisSteps);
    if (input.analysisStepMode === "none" && analysisSteps.length > 0) return false;
    if (input.analysisStepMode === "complete" && analysisSteps.length < analysisStepOrder.length) return false;
    if (input.analysisStepMode === "has" && (!input.analysisStep || !analysisStepSet.has(input.analysisStep))) return false;
    if (input.analysisStepMode === "missing" && (!input.analysisStep || analysisStepSet.has(input.analysisStep))) return false;
    const completedSubAnalysisIds = new Set(domain.completedSubAnalysisIds ?? getCompletedSubAnalysisIds(domain.categories));
    if (input.subAnalysisMode === "has" && (!input.subAnalysisId || !completedSubAnalysisIds.has(input.subAnalysisId))) return false;
    if (input.subAnalysisMode === "missing" && (!input.subAnalysisId || completedSubAnalysisIds.has(input.subAnalysisId))) return false;

    if (query && !domain.domain.toLowerCase().includes(query) && !domain.source.toLowerCase().includes(query)) return false;
    return true;
  });
}

function getQueueMeta(domains: DomainAnalysis[]): QueuePageMeta {
  const scores = domains.map((domain) => rankingScore(domain));
  const lengths = domains.map((domain) => (domain.domain.split(".")[0] ?? domain.domain).length);
  const values = domains.flatMap((domain) => [domain.estimatedValue.min, domain.estimatedValue.max]);
  const minScore = scores.length > 0 ? Math.min(...scores) : 0;
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const scoreStep = Math.max(1, Math.ceil((maxScore - minScore + 1) / 5));
  const scoreBuckets = maxScore <= minScore
    ? [{ label: `${minScore}`, min: minScore, max: maxScore }]
    : Array.from({ length: Math.ceil((maxScore - minScore + 1) / scoreStep) }, (_, index) => {
        const min = minScore + index * scoreStep;
        const max = Math.min(maxScore, min + scoreStep - 1);
        return { label: min === max ? `${min}` : `${min}-${max}`, min, max };
      });
  return {
    totalDomains: domains.length,
    uniqueTlds: Array.from(new Set(domains.map((domain) => domain.tld))).sort(),
    uniqueSources: Array.from(new Set(domains.map((domain) => domain.source))).sort() as DomainAnalysis["source"][],
    scoreRange: {
      min: minScore,
      max: maxScore,
    },
    scoreBuckets,
    labelLengthRange: {
      min: lengths.length > 0 ? Math.min(...lengths) : 0,
      max: lengths.length > 0 ? Math.max(...lengths) : 0,
    },
    valueRange: {
      min: values.length > 0 ? Math.min(...values) : 0,
      max: values.length > 0 ? Math.max(...values) : 0,
    },
  };
}

function sortImportedDomains(
  domains: ImportedDomainRecord[],
  sortKey: ImportedSortKey = "importedAt",
  sortDir: SortDir = "desc",
) {
  const dir = sortDir === "asc" ? 1 : -1;
  return [...domains].sort((a, b) => {
    switch (sortKey) {
      case "domain":
        return a.domain.localeCompare(b.domain) * dir;
      case "status":
        return a.status.localeCompare(b.status) * dir;
      case "source":
        return a.sourceLabel.localeCompare(b.sourceLabel) * dir;
      case "expiresAt":
        return a.expiresAt.localeCompare(b.expiresAt) * dir;
      case "score":
        return (rankingScore(a) - rankingScore(b)) * dir;
      case "verdict":
        return a.verdict.localeCompare(b.verdict) * dir;
      case "importedAt":
      default:
        return a.importedAt.localeCompare(b.importedAt) * dir;
    }
  });
}

function filterImportedDomains(domains: ImportedDomainRecord[], input: ImportedPageQuery) {
  const query = input.query?.trim().toLowerCase() ?? "";
  return domains.filter((domain) => {
    if (input.status && input.status !== "all" && domain.status !== input.status) return false;
    if (input.source && input.source !== "all" && domain.source !== input.source) return false;
    if (input.tld && input.tld !== "all" && domain.tld !== input.tld) return false;
    if (
      query &&
      !domain.domain.toLowerCase().includes(query) &&
      !domain.batchId.toLowerCase().includes(query) &&
      !domain.importedBy.toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });
}

function getImportedMeta(domains: ImportedDomainRecord[]): ImportedDomainsMeta {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return {
    totalDomains: domains.length,
    importedToday: domains.filter((domain) => domain.importedAt.startsWith(todayKey)).length,
    analyzed: domains.filter((domain) => domain.status === "analyzed").length,
    running: domains.filter((domain) => domain.status === "running").length,
    uniqueBatches: new Set(domains.map((domain) => domain.batchId)).size,
    uniqueTlds: Array.from(new Set(domains.map((domain) => domain.tld))).sort(),
    uniqueSources: Array.from(new Map(domains.map((domain) => [domain.source, domain.sourceLabel] as const)).entries()).map(
      ([id, label]) => ({ id, label }),
    ),
  };
}

async function getPrismaImportedMeta(): Promise<ImportedDomainsMeta> {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const [totalDomains, importedToday, analyses, batchRows, tldRows, sourceRows] = await Promise.all([
    prisma.snapTldImportedDomain.count(),
    prisma.snapTldImportedDomain.count({ where: { importedAt: { gte: start, lt: end } } }),
    getPrismaDomainSummaries(),
    prisma.$queryRawUnsafe<Array<{ count: bigint | number }>>("select count(distinct batchId) as count from SnapTldImportedDomain"),
    prisma.snapTldImportedDomain.findMany({ distinct: ["tld"], select: { tld: true }, orderBy: { tld: "asc" } }),
    prisma.snapTldImportedDomain.findMany({
      distinct: ["source", "sourceLabel"],
      select: { source: true, sourceLabel: true },
      orderBy: { sourceLabel: "asc" },
    }),
  ]);

  const uniqueBatches = Number(batchRows[0]?.count ?? 0);
  return {
    totalDomains,
    importedToday,
    analyzed: analyses.filter((domain) => domain.status === "analyzed").length,
    running: analyses.filter((domain) => domain.status === "running").length,
    uniqueBatches,
    uniqueTlds: tldRows.map((row) => row.tld),
    uniqueSources: sourceRows.map((row) => ({ id: row.source as ImportedDomainRecord["source"], label: row.sourceLabel })),
  };
}

function canUseFastImportedPage(query: ImportedPageQuery) {
  const hasQuery = Boolean(query.query?.trim());
  const hasStatus = Boolean(query.status && query.status !== "all");
  const hasSource = Boolean(query.source && query.source !== "all");
  const hasTld = Boolean(query.tld && query.tld !== "all");
  const sortKey = query.sortKey ?? "importedAt";
  return !hasQuery && !hasStatus && !hasSource && !hasTld && sortKey === "importedAt";
}

function canUseFastDomainPage(query: DomainPageQuery) {
  return true;
}

function buildPrismaDomainWhere(query: DomainPageQuery) {
  const where: Record<string, unknown> = {};
  const text = query.query?.trim();
  if (text) {
    where.OR = [
      { domain: { contains: text } },
      { source: { contains: text } },
    ];
  }
  if (query.verdict && query.verdict !== "all") where.verdict = query.verdict;
  if (query.status && query.status !== "all") where.status = query.status;
  if (query.tld && query.tld !== "all") where.tld = query.tld;
  if (query.source && query.source !== "all") where.source = query.source;
  let slugInclude: string[] | null = null;
  const intersectSlugInclude = (slugs: string[]) => {
    slugInclude = slugInclude === null ? slugs : slugInclude.filter((slug) => slugs.includes(slug));
  };
  if (query.onlyWatched) intersectSlugInclude(query.watchedSlugs ?? []);
  if (query.tagFilter && query.notes) {
    const tagged = Object.entries(query.notes)
      .filter(([, note]) => note.tags.includes(query.tagFilter as string))
      .map(([slug]) => slug);
    intersectSlugInclude(tagged);
  }
  if (query.showHidden) intersectSlugInclude(query.hiddenSlugs ?? []);
  const notIn = [
    ...(!query.showHidden ? query.hiddenSlugs ?? [] : []),
    ...(query.hideReviewed ? query.reviewedSlugs ?? [] : []),
  ];
  if (slugInclude !== null || notIn.length > 0) {
    where.slug = {
      ...(slugInclude !== null ? { in: slugInclude } : {}),
      ...(notIn.length > 0 ? { notIn } : {}),
    };
  }
  const totalScore: Record<string, number> = {};
  if (query.minScore !== undefined && query.minScore > 0) totalScore.gte = query.minScore;
  if (query.maxScore !== undefined && query.maxScore > 0) totalScore.lte = query.maxScore;
  if (Object.keys(totalScore).length > 0) where.totalScore = totalScore;
  if (query.minDaysUntilExpiry !== undefined || query.maxDaysUntilExpiry !== undefined) {
    const expiresAt: Record<string, string> = {};
    if (query.minDaysUntilExpiry !== undefined && query.minDaysUntilExpiry >= 0) {
      const minDate = new Date(Date.now() + query.minDaysUntilExpiry * 86_400_000).toISOString().slice(0, 10);
      expiresAt.gte = minDate;
    }
    if (query.maxDaysUntilExpiry !== undefined && query.maxDaysUntilExpiry >= 0) {
      const maxDate = new Date(Date.now() + query.maxDaysUntilExpiry * 86_400_000).toISOString().slice(0, 10);
      expiresAt.lte = maxDate;
    }
    where.expiresAt = expiresAt;
  }
  if (query.importedAfter || query.importedBefore) {
    const importedAt: Record<string, Date> = {};
    if (query.importedAfter) importedAt.gte = parseLooseDateTime(query.importedAfter);
    if (query.importedBefore) {
      const end = parseLooseDateTime(query.importedBefore);
      end.setUTCDate(end.getUTCDate() + 1);
      importedAt.lt = end;
    }
    where.importedAt = importedAt;
  }
  if (query.domainLength && query.domainLength !== "all") {
    if (query.domainLength === "short") where.labelLength = { lte: 7 };
    if (query.domainLength === "medium") where.labelLength = { gte: 8, lte: 12 };
    if (query.domainLength === "long") where.labelLength = { gte: 13 };
  }
  const labelLength = { ...((where.labelLength as Record<string, number> | undefined) ?? {}) };
  if (query.minDomainLength !== undefined && query.minDomainLength > 0) labelLength.gte = query.minDomainLength;
  if (query.maxDomainLength !== undefined && query.maxDomainLength > 0) labelLength.lte = query.maxDomainLength;
  if (Object.keys(labelLength).length > 0) where.labelLength = labelLength;
  if (query.minValue !== undefined && query.minValue > 0) where.estimatedValueMax = { gte: query.minValue };
  if (query.maxValue !== undefined && query.maxValue > 0) where.estimatedValueMin = { lte: query.maxValue };
  if (query.analysisStepMode && query.analysisStepMode !== "all") {
    if (query.analysisStepMode === "none") where.analysisStepCount = 0;
    if (query.analysisStepMode === "complete") where.analysisStepCount = analysisStepOrder.length;
    if ((query.analysisStepMode === "has" || query.analysisStepMode === "missing") && query.analysisStep) {
      where[analysisStepColumn[query.analysisStep]] = query.analysisStepMode === "has";
    }
  }
  if (query.subAnalysisMode && query.subAnalysisMode !== "all" && query.subAnalysisId) {
    const token = `|${query.subAnalysisId}|`;
    where.completedSubAnalysisIds = query.subAnalysisMode === "has"
      ? { contains: token }
      : { not: { contains: token } };
  }
  return where;
}

function buildPrismaDomainOrderBy(query: DomainPageQuery) {
  const direction = query.sortDir === "asc" ? "asc" : "desc";
  switch (query.sortKey ?? "score") {
    case "domain":
      return { domain: direction } as const;
    case "verdict":
      return { verdict: direction } as const;
    case "expires":
      return { expiresAt: direction } as const;
    case "source":
      return { source: direction } as const;
    case "imported":
      return { importedAt: direction } as const;
    case "value":
      return { estimatedValueMin: direction } as const;
    case "analysis":
      return { analysisStepCount: direction } as const;
    case "subanalysis":
      return { subAnalysisCount: direction } as const;
    case "score":
    default:
      return { totalScore: direction } as const;
  }
}

async function getPrismaQueueMeta(): Promise<QueuePageMeta> {
  const now = Date.now();
  if (queueMetaCache && queueMetaCache.expiresAt > now) return queueMetaCache.meta;
  const [totalDomains, tldRows, sourceRows, scoreAgg, valueAgg, lengthAgg] = await Promise.all([
    prisma.snapTldDomainAnalysis.count(),
    prisma.snapTldDomainAnalysis.findMany({ distinct: ["tld"], select: { tld: true }, orderBy: { tld: "asc" } }),
    prisma.snapTldDomainAnalysis.findMany({ distinct: ["source"], select: { source: true }, orderBy: { source: "asc" } }),
    prisma.snapTldDomainAnalysis.aggregate({ _min: { totalScore: true }, _max: { totalScore: true } }),
    prisma.snapTldDomainAnalysis.aggregate({
      _min: { estimatedValueMin: true },
      _max: { estimatedValueMax: true },
    }),
    prisma.snapTldDomainAnalysis.aggregate({ _min: { labelLength: true }, _max: { labelLength: true } }),
  ]);
  const minScore = scoreAgg._min.totalScore ?? 0;
  const maxScore = scoreAgg._max.totalScore ?? 0;
  const scoreStep = Math.max(1, Math.ceil((maxScore - minScore + 1) / 5));
  const scoreBuckets = maxScore <= minScore
    ? [{ label: `${minScore}`, min: minScore, max: maxScore }]
    : Array.from({ length: Math.ceil((maxScore - minScore + 1) / scoreStep) }, (_, index) => {
        const min = minScore + index * scoreStep;
        const max = Math.min(maxScore, min + scoreStep - 1);
        return { label: min === max ? `${min}` : `${min}-${max}`, min, max };
      });
  const meta = {
    totalDomains,
    uniqueTlds: tldRows.map((row) => row.tld),
    uniqueSources: sourceRows.map((row) => row.source as DomainAnalysis["source"]),
    scoreRange: { min: minScore, max: maxScore },
    scoreBuckets,
    labelLengthRange: {
      min: lengthAgg._min.labelLength ?? 0,
      max: lengthAgg._max.labelLength ?? 0,
    },
    valueRange: {
      min: valueAgg._min.estimatedValueMin ?? 0,
      max: valueAgg._max.estimatedValueMax ?? 0,
    },
  };
  queueMetaCache = { expiresAt: now + 60_000, meta };
  return meta;
}

const domainAnalysisSummarySelect = {
  slug: true,
  domain: true,
  tld: true,
  source: true,
  fetchedAt: true,
  importedAt: true,
  expiresAt: true,
  labelLength: true,
  totalScore: true,
  verdict: true,
  status: true,
  analysisStepCount: true,
  subAnalysisCount: true,
  completedSubAnalysisIds: true,
  hasStructure: true,
  hasLexical: true,
  hasBrand: true,
  hasMarket: true,
  hasRisk: true,
  hasSalability: true,
  hasSeo: true,
  hasHistory: true,
  aiSummary: true,
  estimatedValueMin: true,
  estimatedValueMax: true,
  estimatedValueCurrency: true,
  categoriesJson: true,
} as const;

let domainSummaryCache: { expiresAt: number; domains: DomainAnalysis[] } | null = null;
let domainSummaryCachePromise: Promise<DomainAnalysis[]> | null = null;
let queueMetaCache: { expiresAt: number; meta: QueuePageMeta } | null = null;

function clearDomainSummaryCache() {
  domainSummaryCache = null;
  domainSummaryCachePromise = null;
  queueMetaCache = null;
}

async function getPrismaDomainSummaries() {
  const now = Date.now();
  if (domainSummaryCache && domainSummaryCache.expiresAt > now) return domainSummaryCache.domains;
  if (domainSummaryCachePromise) return domainSummaryCachePromise;

  domainSummaryCachePromise = prisma.snapTldDomainAnalysis.findMany({ select: domainAnalysisSummarySelect })
    .then((dbRows) => {
      const domains = dbRows.map((row) => mapPrismaDomainAnalysisSummary(row, { expandLegacySubAnalyses: false }));
      domainSummaryCache = { expiresAt: Date.now() + 5_000, domains };
      return domains;
    })
    .finally(() => {
      domainSummaryCachePromise = null;
    });
  return domainSummaryCachePromise;
}

async function runFeeds(repository: Pick<SnapTldRepository, "listFeeds" | "importDomains">, feedIds?: string[]): Promise<RunFeedsResult> {
  const feeds = (await repository.listFeeds()).filter((feed) => {
    if (feedIds && !feedIds.includes(feed.id)) return false;
    return feed.status === "active";
  });

  let imported = 0;
  let duplicates = 0;
  for (const feed of feeds) {
    const result = await repository.importDomains({
      mode: "url",
      url: feed.url,
      validDomains: [],
      duplicates: [],
      selectedSteps: [],
    });
    imported += result.imported;
    duplicates += result.duplicates;
  }

  return { feeds: feeds.length, imported, duplicates };
}

function buildOverviewSeries(
  analysisRows: { totalScore: number; updatedAt: Date }[],
  importedRows: { importedAt: Date }[],
) {
  const formatter = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short" });
  const today = new Date();
  const days = Array.from({ length: 8 }, (_, index) => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (7 - index));
    const key = date.toISOString().slice(0, 10);
    return { key, label: formatter.format(date).replace(".", ""), scores: [] as number[], imported: 0 };
  });
  const byKey = new Map(days.map((day) => [day.key, day]));

  analysisRows.forEach((row) => {
    const key = row.updatedAt.toISOString().slice(0, 10);
    byKey.get(key)?.scores.push(row.totalScore);
  });

  importedRows.forEach((row) => {
    const key = row.importedAt.toISOString().slice(0, 10);
    const day = byKey.get(key);
    if (day) day.imported++;
  });

  const scoredDays = days.filter((day) => day.scores.length > 0);
  return {
    scoreTrend: scoredDays.map((day) => ({
      label: day.label,
      value: Math.round(day.scores.reduce((sum, score) => sum + score, 0) / day.scores.length),
    })),
    volumePerDay: scoredDays.map((day) => ({
      label: day.label,
      value: day.scores.length,
    })),
    importedPerDay: days.map((day) => ({
      label: day.label,
      value: day.imported,
    })),
  };
}

function normalizeAnalyzeQueueInput(input: AnalyzeQueueInput) {
  const steps = input.steps.length > 0 ? input.steps : (["overview"] as AnalysisStep[]);
  const selectedSubAnalyses = analysisStepOrder.reduce<Partial<Record<AnalysisCategory, string[]>>>((acc, category) => {
    const validIds = new Set(categorySubAnalysisSpecs[category].map((spec) => spec.id));
    const selected = input.selectedSubAnalyses?.[category];
    if (Array.isArray(selected)) {
      acc[category] = selected.filter((id) => validIds.has(id));
    }
    return acc;
  }, {});
  return {
    ...input,
    steps,
    selectedSubAnalyses,
    scope: input.scope ?? "queued",
    sortBy: input.sortBy ?? "oldest-imported",
  };
}

function sortQueueCandidates<T extends { domain: string; importedAt?: string; expiresAt: string; totalScore: number; scoreMax?: number }>(
  candidates: T[],
  sortBy: AnalyzeQueueInput["sortBy"] = "oldest-imported",
) {
  const direction = sortBy === "newest-imported" || sortBy === "highest-score" ? -1 : 1;
  return [...candidates].sort((a, b) => {
    switch (sortBy) {
      case "newest-imported":
      case "oldest-imported":
        return (a.importedAt ?? "").localeCompare(b.importedAt ?? "") * direction;
      case "expires-soon":
        return a.expiresAt.localeCompare(b.expiresAt);
      case "highest-score":
      case "lowest-score":
        return (rankingScore(a) - rankingScore(b)) * direction;
      case "domain":
        return a.domain.localeCompare(b.domain, "sv");
      default:
        return 0;
    }
  });
}

export interface SnapTldRepository {
  listDomains(): Promise<DomainAnalysis[]>;
  listDomainPage(query?: DomainPageQuery): Promise<PaginatedResult<DomainAnalysis> & { meta: QueuePageMeta }>;
  getDomainBySlug(slug: string): Promise<DomainAnalysis | null>;
  listImportedDomains(): Promise<ImportedDomainRecord[]>;
  listImportedDomainPage(query?: ImportedPageQuery): Promise<PaginatedResult<ImportedDomainRecord> & { meta: ImportedDomainsMeta }>;
  listFeeds(): Promise<FeedSource[]>;
  listReports(): Promise<Report[]>;
  getReportById(reportId: string): Promise<Report | null>;
  getOverviewStats(): Promise<OverviewStats>;
  getOverviewSeries(): Promise<{ scoreTrend: { label: string; value: number }[]; volumePerDay: { label: string; value: number }[]; importedPerDay: { label: string; value: number }[] }>;
  getUserState(): Promise<SnapTldUserState>;
  toggleWatch(slug: string): Promise<string[]>;
  addWatchMany(slugs: string[]): Promise<string[]>;
  toggleReviewed(slug: string): Promise<string[]>;
  addReviewedMany(slugs: string[]): Promise<string[]>;
  toggleHidden(slug: string): Promise<string[]>;
  addHiddenMany(slugs: string[]): Promise<string[]>;
  saveNote(slug: string, note: DomainNote | null): Promise<Record<string, DomainNote>>;
  saveWeights(yaml: string): Promise<string>;
  resetWeights(): Promise<string>;
  saveSettings(settings: SnapTldSettings): Promise<SnapTldSettings>;
  importDomains(input: ImportDomainsInput): Promise<{ imported: number; duplicates: number }>;
  rerunAnalysis(slug: string, step?: string): Promise<AnalysisRunResult>;
  analyzeQueue(input: AnalyzeQueueInput): Promise<AnalyzeQueueResult>;
  updateFeedSchedule(feedId: string, schedule: FeedSource["schedule"]): Promise<FeedSource>;
  toggleFeedStatus(feedId: string): Promise<FeedSource>;
  runFeed(feedId: string): Promise<RunFeedsResult>;
  runActiveFeeds(): Promise<RunFeedsResult>;
  createReport(input: CreateReportInput): Promise<Report>;
}

class PrismaSnapTldRepository implements SnapTldRepository {
  private async getStateRow() {
    const existing = await prisma.snapTldState.findUnique({ where: { id: "default" } });
    if (existing) return existing;
    const fallback = createDefaultUserState();
    return prisma.snapTldState.create({
      data: {
        id: "default",
        watchlistJson: JSON.stringify(fallback.watchlist),
        reviewedJson: JSON.stringify(fallback.reviewed),
        hiddenJson: JSON.stringify(fallback.hidden),
        notesJson: JSON.stringify(fallback.notes),
        activeWeightsYaml: fallback.activeWeightsYaml,
        settingsJson: JSON.stringify(fallback.settings),
      },
    });
  }

  private async saveState(state: SnapTldUserState) {
    await prisma.snapTldState.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        watchlistJson: JSON.stringify(state.watchlist),
        reviewedJson: JSON.stringify(state.reviewed),
        hiddenJson: JSON.stringify(state.hidden),
        notesJson: JSON.stringify(state.notes),
        activeWeightsYaml: state.activeWeightsYaml,
        settingsJson: JSON.stringify(state.settings),
      },
      update: {
        watchlistJson: JSON.stringify(state.watchlist),
        reviewedJson: JSON.stringify(state.reviewed),
        hiddenJson: JSON.stringify(state.hidden),
        notesJson: JSON.stringify(state.notes),
        activeWeightsYaml: state.activeWeightsYaml,
        settingsJson: JSON.stringify(state.settings),
      },
    });
  }

  async listDomains() {
    return getPrismaDomainSummaries();
  }

  async listDomainPage(query: DomainPageQuery = {}) {
    if (canUseFastDomainPage(query)) {
      const page = normalizePage(query.page);
      const pageSize = normalizePageSize(query.pageSize, 50, 1000);
      const where = buildPrismaDomainWhere(query);
      const [total, dbRows, meta] = await Promise.all([
        prisma.snapTldDomainAnalysis.count({ where }),
        prisma.snapTldDomainAnalysis.findMany({
          where,
          orderBy: buildPrismaDomainOrderBy(query),
          skip: (page - 1) * pageSize,
          take: pageSize,
          select: domainAnalysisSummarySelect,
        }),
        getPrismaQueueMeta(),
      ]);
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const clampedPage = Math.min(page, totalPages);
      const items = clampedPage === page
        ? dbRows
        : await prisma.snapTldDomainAnalysis.findMany({
            where,
            orderBy: buildPrismaDomainOrderBy(query),
            skip: (clampedPage - 1) * pageSize,
            take: pageSize,
            select: domainAnalysisSummarySelect,
          });
      return {
        items: items.map((row) => compactDomainAnalysis(mapPrismaDomainAnalysisSummary(row, { expandLegacySubAnalyses: false }))),
        total,
        page: clampedPage,
        pageSize,
        totalPages,
        meta,
      };
    }

    const domains = await this.listDomains();
    const page = paginate(sortDomains(filterDomains(domains, query), query.sortKey, query.sortDir), query.page, query.pageSize, 1000);
    return {
      ...page,
      items: page.items.map(compactDomainAnalysis),
      meta: getQueueMeta(domains),
    };
  }

  async getDomainBySlug(slug: string) {
    const dbRow = await prisma.snapTldDomainAnalysis.findUnique({ where: { slug } });
    if (dbRow) return mapPrismaDomainAnalysis(dbRow);
    return null;
  }

  async listImportedDomains() {
    const dbRows = await prisma.snapTldImportedDomain.findMany({ orderBy: { importedAt: "desc" } });
    return withAnalysisSteps(dbRows.map(mapPrismaImportedDomain), await getPrismaDomainSummaries());
  }

  async listImportedDomainPage(query: ImportedPageQuery = {}) {
    if (canUseFastImportedPage(query)) {
      const page = normalizePage(query.page);
      const pageSize = normalizePageSize(query.pageSize);
      const [dbRows, meta] = await Promise.all([
        prisma.snapTldImportedDomain.findMany({
          orderBy: { importedAt: query.sortDir === "asc" ? "asc" : "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        getPrismaImportedMeta(),
      ]);
      const analysisRows = dbRows.length > 0
        ? await prisma.snapTldDomainAnalysis.findMany({
            where: { slug: { in: dbRows.map((row) => row.slug) } },
            select: domainAnalysisSummarySelect,
          })
        : [];
      const items = withAnalysisSteps(
        dbRows.map(mapPrismaImportedDomain),
        analysisRows.map((row) => mapPrismaDomainAnalysisSummary(row, { expandLegacySubAnalyses: false })),
      );
      const totalPages = Math.max(1, Math.ceil(meta.totalDomains / pageSize));
      return {
        items,
        total: meta.totalDomains,
        page: Math.min(page, totalPages),
        pageSize,
        totalPages,
        meta,
      };
    }

    const domains = await this.listImportedDomains();
    return {
      ...paginate(
        sortImportedDomains(filterImportedDomains(domains, query), query.sortKey, query.sortDir),
        query.page,
        query.pageSize,
      ),
      meta: getImportedMeta(domains),
    };
  }

  async listFeeds() {
    const [overrides, feedStats] = await Promise.all([
      prisma.snapTldFeedOverride.findMany(),
      Promise.all(
        rawFeeds.map(async (rawFeed) => {
          const latest = await prisma.snapTldImportedDomain.findFirst({
            where: { source: "internetstiftelsen", tld: rawFeed.tld },
            orderBy: { importedAt: "desc" },
            select: { importedAt: true, batchId: true },
          });
          if (!latest) return [rawFeed.id, { lastFetchedAt: "", domainsLastRun: 0 }] as const;
          const domainsLastRun = await prisma.snapTldImportedDomain.count({
            where: { source: "internetstiftelsen", tld: rawFeed.tld, batchId: latest.batchId },
          });
          return [rawFeed.id, { lastFetchedAt: latest.importedAt.toISOString(), domainsLastRun }] as const;
        }),
      ),
    ]);
    const overrideMap = new Map(overrides.map((row) => [row.feedId, row] as const));
    const feedStatsMap = new Map(feedStats);
    return rawFeeds.map(mapRawFeed).map((feed) => {
      const override = overrideMap.get(feed.id);
      const stats = feedStatsMap.get(feed.id);
      const feedWithStats = stats ? { ...feed, ...stats } : feed;
      if (!override) return feedWithStats;
      return {
        ...feedWithStats,
        status: (override.status as FeedStatus | null) ?? feed.status,
        schedule: override.scheduleJson ? parseJson(override.scheduleJson, feed.schedule) : feed.schedule,
      };
    });
  }

  async listReports() {
    const dbRows = await prisma.snapTldReport.findMany({ orderBy: { generatedAt: "desc" } });
    return dbRows.map(mapPrismaReport);
  }

  async getReportById(reportId: string) {
    const dbRow = await prisma.snapTldReport.findUnique({ where: { id: reportId } });
    if (dbRow) return mapPrismaReport(dbRow);
    return null;
  }

  async getOverviewStats() {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const [totalDomains, importedToday, total, analyzedToday, excellent, good, mediocre, skip, avgScore] = await Promise.all([
      prisma.snapTldImportedDomain.count(),
      prisma.snapTldImportedDomain.count({ where: { importedAt: { gte: start, lt: end } } }),
      prisma.snapTldDomainAnalysis.count({ where: { status: "analyzed" } }),
      prisma.snapTldDomainAnalysis.count({ where: { status: "analyzed", updatedAt: { gte: start, lt: end } } }),
      prisma.snapTldDomainAnalysis.count({ where: { status: "analyzed", verdict: "excellent" } }),
      prisma.snapTldDomainAnalysis.count({ where: { status: "analyzed", verdict: "good" } }),
      prisma.snapTldDomainAnalysis.count({ where: { status: "analyzed", verdict: "mediocre" } }),
      prisma.snapTldDomainAnalysis.count({ where: { status: "analyzed", verdict: "skip" } }),
      prisma.snapTldDomainAnalysis.aggregate({ where: { status: "analyzed" }, _avg: { totalScore: true } }),
    ]);

    return {
      total,
      totalDomains,
      importedToday,
      analyzedToday,
      excellent,
      good,
      mediocre,
      skip,
      avg: Math.round(avgScore._avg.totalScore ?? 0),
    };
  }

  async getOverviewSeries() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    cutoff.setHours(0, 0, 0, 0);
    const [analysisRows, importedRows] = await Promise.all([
      prisma.snapTldDomainAnalysis.findMany({
        where: { status: "analyzed" },
        select: { totalScore: true, updatedAt: true },
      }),
      prisma.snapTldImportedDomain.findMany({
        where: { importedAt: { gte: cutoff } },
        select: { importedAt: true },
      }),
    ]);
    return buildOverviewSeries(
      analysisRows.map((row) => ({ totalScore: row.totalScore, updatedAt: row.updatedAt })),
      importedRows,
    );
  }

  async getUserState() {
    return mapStateRow(await this.getStateRow());
  }

  async toggleWatch(slug: string) {
    const state = await this.getUserState();
    const set = new Set(state.watchlist);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    state.watchlist = [...set];
    await this.saveState(state);
    return state.watchlist;
  }

  async addWatchMany(slugs: string[]) {
    const state = await this.getUserState();
    const set = new Set(state.watchlist);
    slugs.forEach((slug) => set.add(slug));
    state.watchlist = [...set];
    await this.saveState(state);
    return state.watchlist;
  }

  async toggleReviewed(slug: string) {
    const state = await this.getUserState();
    const set = new Set(state.reviewed);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    state.reviewed = [...set];
    await this.saveState(state);
    return state.reviewed;
  }

  async addReviewedMany(slugs: string[]) {
    const state = await this.getUserState();
    const set = new Set(state.reviewed);
    slugs.forEach((slug) => set.add(slug));
    state.reviewed = [...set];
    await this.saveState(state);
    return state.reviewed;
  }

  async toggleHidden(slug: string) {
    const state = await this.getUserState();
    const set = new Set(state.hidden);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    state.hidden = [...set];
    await this.saveState(state);
    return state.hidden;
  }

  async addHiddenMany(slugs: string[]) {
    const state = await this.getUserState();
    const set = new Set(state.hidden);
    slugs.forEach((slug) => set.add(slug));
    state.hidden = [...set];
    await this.saveState(state);
    return state.hidden;
  }

  async saveNote(slug: string, note: DomainNote | null) {
    const state = await this.getUserState();
    if (note) state.notes[slug] = note;
    else delete state.notes[slug];
    await this.saveState(state);
    return state.notes;
  }

  async saveWeights(yaml: string) {
    const state = await this.getUserState();
    state.activeWeightsYaml = yaml;
    await this.saveState(state);
    return state.activeWeightsYaml;
  }

  async resetWeights() {
    const state = await this.getUserState();
    state.activeWeightsYaml = defaultWeightsYaml;
    await this.saveState(state);
    return state.activeWeightsYaml;
  }

  async saveSettings(settings: SnapTldSettings) {
    const state = await this.getUserState();
    state.settings = settings;
    await this.saveState(state);
    return state.settings;
  }

  async importDomains(input: ImportDomainsInput) {
    const batchId = `imp-${new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)}`;
    let importedDomains: ImportedDomainRecord[] = [];
    const existingImportedSlugs = new Set((await this.listImportedDomains()).map((entry) => entry.slug));
    const existingAnalysisSlugs = new Set((await this.listDomains()).map((entry) => entry.slug));
    let duplicateCount = input.duplicates.length;

    if (input.mode === "url" && input.url) {
      const feedUrl = normalizeImportUrl(input.url);
      const response = await fetch(feedUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`Kunde inte hämta feed (${response.status})`);
      const payload = (await response.json()) as { data?: Array<{ name?: string; release_at?: string }> };
      importedDomains = (payload.data ?? [])
        .filter((entry): entry is { name: string; release_at: string } => !!entry.name && !!entry.release_at)
        .map((entry) => {
          const domain = buildQueuedAnalysis(entry.name.toLowerCase(), "internetstiftelsen", entry.release_at);
          return {
            id: domain.id,
            slug: domain.slug,
            domain: domain.domain,
            tld: domain.tld,
            source: domain.source,
            sourceLabel: sourceLabelFromInput("url", feedUrl),
            importedAt: new Date().toISOString(),
            importedBy: "URL-import",
            batchId,
            status: "queued",
            expiresAt: entry.release_at,
            totalScore: 0,
            verdict: "mediocre",
            estimatedValue: { min: 0, max: 0, currency: "SEK" },
          };
        });
    } else {
      importedDomains = input.validDomains.map((domainName) => {
        const source = sourceFromImportMode(input.mode);
        const domain = buildQueuedAnalysis(domainName.toLowerCase(), source, new Date().toISOString().slice(0, 10));
        return {
          id: domain.id,
          slug: domain.slug,
          domain: domain.domain,
          tld: domain.tld,
          source,
          sourceLabel: sourceLabelFromInput(input.mode),
          importedAt: new Date().toISOString(),
          importedBy: "SnapTLD Admin",
          batchId,
          status: "queued",
          expiresAt: domain.expiresAt,
          totalScore: 0,
          verdict: "mediocre",
          estimatedValue: { min: 0, max: 0, currency: "SEK" },
        };
      });
    }

    const newImportedDomains = importedDomains.filter((entry) => {
      if (existingImportedSlugs.has(entry.slug)) {
        duplicateCount += 1;
        return false;
      }
      existingImportedSlugs.add(entry.slug);
      return true;
    });

    const userState = await this.getUserState();
    const config = buildAnalysisConfig(userState.activeWeightsYaml);
    const domainAnalyses =
      input.selectedSteps.length > 0
        ? await analyzeDomainsAsync(newImportedDomains.map((entry) => buildQueuedAnalysis(entry.domain, entry.source, entry.expiresAt)), input.selectedSteps, config, userState.settings)
        : newImportedDomains
            .filter((entry) => !existingAnalysisSlugs.has(entry.slug))
            .map((entry) => buildQueuedAnalysis(entry.domain, entry.source, entry.expiresAt));

    const analysisBySlug = new Map(domainAnalyses.map((analysis) => [analysis.slug, analysis] as const));
    const importedDomainRecords = newImportedDomains.map((entry) => {
      const analysis = analysisBySlug.get(entry.slug);
      return {
        ...entry,
        status: analysis?.status ?? entry.status,
        totalScore: analysis?.totalScore ?? entry.totalScore,
        verdict: analysis?.verdict ?? entry.verdict,
        estimatedValue: analysis?.estimatedValue ?? entry.estimatedValue,
      };
    });

    await prisma.$transaction([
      ...importedDomainRecords.map((entry) =>
        prisma.snapTldImportedDomain.create({
          data: {
            slug: entry.slug,
            domain: entry.domain,
            tld: entry.tld,
            source: entry.source,
            sourceLabel: entry.sourceLabel,
            importedAt: parseLooseDateTime(entry.importedAt),
            importedBy: entry.importedBy,
            batchId: entry.batchId,
            status: entry.status,
            expiresAt: entry.expiresAt,
            totalScore: entry.totalScore,
            verdict: entry.verdict,
            estimatedValueMin: entry.estimatedValue.min,
            estimatedValueMax: entry.estimatedValue.max,
            estimatedValueCurrency: entry.estimatedValue.currency,
          },
        }),
      ),
      ...domainAnalyses.map((analysis) =>
        prisma.snapTldDomainAnalysis.upsert({
          where: { slug: analysis.slug },
          create: {
            slug: analysis.slug,
            domain: analysis.domain,
            tld: analysis.tld,
            source: analysis.source,
            fetchedAt: parseLooseDateTime(analysis.fetchedAt),
            importedAt: parseLooseDateTime(analysis.importedAt ?? importedDomainRecords.find((entry) => entry.slug === analysis.slug)?.importedAt ?? analysis.fetchedAt),
            expiresAt: analysis.expiresAt,
            ...buildDomainAnalysisIndex(analysis),
            totalScore: analysis.totalScore,
            verdict: analysis.verdict,
            status: analysis.status,
            aiSummary: analysis.aiSummary,
            estimatedValueMin: analysis.estimatedValue.min,
            estimatedValueMax: analysis.estimatedValue.max,
            estimatedValueCurrency: analysis.estimatedValue.currency,
            categoriesJson: JSON.stringify(analysis.categories),
            seoJson: JSON.stringify(analysis.seo),
            waybackJson: JSON.stringify(analysis.wayback),
          },
          update: {
            fetchedAt: parseLooseDateTime(analysis.fetchedAt),
            importedAt: parseLooseDateTime(analysis.importedAt ?? importedDomainRecords.find((entry) => entry.slug === analysis.slug)?.importedAt ?? analysis.fetchedAt),
            expiresAt: analysis.expiresAt,
            ...buildDomainAnalysisIndex(analysis),
            totalScore: analysis.totalScore,
            verdict: analysis.verdict,
            status: analysis.status,
            aiSummary: analysis.aiSummary,
            estimatedValueMin: analysis.estimatedValue.min,
            estimatedValueMax: analysis.estimatedValue.max,
            estimatedValueCurrency: analysis.estimatedValue.currency,
            categoriesJson: JSON.stringify(analysis.categories),
            seoJson: JSON.stringify(analysis.seo),
            waybackJson: JSON.stringify(analysis.wayback),
          },
        }),
      ),
    ]);
    clearDomainSummaryCache();

    return {
      imported: newImportedDomains.length,
      duplicates: duplicateCount,
    };
  }

  async rerunAnalysis(slug: string, step = "overview") {
    const domain = await this.getDomainBySlug(slug);
    if (!domain) throw new Error("Domän hittades inte");

    if (step !== "overview" && !isAnalysisCategory(step)) throw new Error("Ogiltigt analyssteg");
    const userState = await this.getUserState();
    const config = buildAnalysisConfig(userState.activeWeightsYaml);
    const next = await analyzeDomainAsync(domain, [step as AnalysisStep], config, userState.settings);

    await prisma.snapTldDomainAnalysis.upsert({
      where: { slug },
      create: {
        slug: next.slug,
        domain: next.domain,
        tld: next.tld,
        source: next.source,
        fetchedAt: parseLooseDateTime(next.fetchedAt),
        importedAt: parseLooseDateTime(next.importedAt ?? next.fetchedAt),
        expiresAt: next.expiresAt,
        ...buildDomainAnalysisIndex(next),
        totalScore: next.totalScore,
        verdict: next.verdict,
        status: next.status,
        aiSummary: next.aiSummary,
        estimatedValueMin: next.estimatedValue.min,
        estimatedValueMax: next.estimatedValue.max,
        estimatedValueCurrency: next.estimatedValue.currency,
        categoriesJson: JSON.stringify(next.categories),
        seoJson: JSON.stringify(next.seo),
        waybackJson: JSON.stringify(next.wayback),
      },
      update: {
        fetchedAt: parseLooseDateTime(next.fetchedAt),
        importedAt: parseLooseDateTime(next.importedAt ?? next.fetchedAt),
        expiresAt: next.expiresAt,
        ...buildDomainAnalysisIndex(next),
        totalScore: next.totalScore,
        verdict: next.verdict,
        status: next.status,
        aiSummary: next.aiSummary,
        estimatedValueMin: next.estimatedValue.min,
        estimatedValueMax: next.estimatedValue.max,
        estimatedValueCurrency: next.estimatedValue.currency,
        categoriesJson: JSON.stringify(next.categories),
        seoJson: JSON.stringify(next.seo),
        waybackJson: JSON.stringify(next.wayback),
      },
    });

    const imported = (await this.listImportedDomains()).find((entry) => entry.slug === slug);
    if (imported) {
      await prisma.snapTldImportedDomain.upsert({
        where: { slug },
        create: {
          slug: imported.slug,
          domain: imported.domain,
          tld: imported.tld,
          source: imported.source,
          sourceLabel: imported.sourceLabel,
          importedAt: parseLooseDateTime(imported.importedAt),
          importedBy: imported.importedBy,
          batchId: imported.batchId,
          status: next.status,
          expiresAt: imported.expiresAt,
          totalScore: next.totalScore,
          verdict: next.verdict,
          estimatedValueMin: next.estimatedValue.min,
          estimatedValueMax: next.estimatedValue.max,
          estimatedValueCurrency: next.estimatedValue.currency,
        },
        update: {
          status: next.status,
          totalScore: next.totalScore,
          verdict: next.verdict,
          estimatedValueMin: next.estimatedValue.min,
          estimatedValueMax: next.estimatedValue.max,
          estimatedValueCurrency: next.estimatedValue.currency,
        },
      });
    }
    clearDomainSummaryCache();

    return { analyzed: true };
  }

  async analyzeQueue(input: AnalyzeQueueInput) {
    const options = normalizeAnalyzeQueueInput(input);
    const userState = await this.getUserState();
    const config = buildAnalysisConfig(userState.activeWeightsYaml);
    const selectedSlugFilter = options.scope === "selected" && (options.slugs?.length ?? 0) > 0
      ? { slug: { in: options.slugs } }
      : undefined;
    const [analysisRows, importedRows] = await Promise.all([
      prisma.snapTldDomainAnalysis.findMany({ where: selectedSlugFilter }),
      prisma.snapTldImportedDomain.findMany({ where: selectedSlugFilter, select: { slug: true, importedAt: true } }),
    ]);
    const importedBySlug = new Map(importedRows.map((row) => [row.slug, row.importedAt.toISOString()] as const));
    const candidates = analysisRows
      .map((row) => ({ row, domain: mapPrismaDomainAnalysis(row), importedAt: importedBySlug.get(row.slug) }))
      .filter(({ domain, importedAt }) => {
        if (options.scope === "selected" && !(options.slugs ?? []).includes(domain.slug)) return false;
        if (options.scope === "queued" && domain.status !== "queued") return false;
        if (options.scope === "not-analyzed" && domain.status === "analyzed") return false;
        if (options.scope === "missing-step" && (!options.missingStep || getAnalysisSteps(domain.categories).includes(options.missingStep))) return false;
        if (options.dateFilter && importedAt) {
          const importedDate = importedAt.slice(0, 10);
          if (options.dateFilter.direction === "before" && importedDate >= options.dateFilter.date) return false;
          if (options.dateFilter.direction === "after" && importedDate <= options.dateFilter.date) return false;
        }
        return true;
      });
    const limited = sortQueueCandidates(
      candidates.map((candidate) => ({ ...candidate.domain, importedAt: candidate.importedAt })),
      options.sortBy,
    ).slice(0, options.limit === "all" ? undefined : Math.max(1, Math.min(options.limit ?? 25, 1000)));

    if (limited.length === 0) {
      return {
        analyzed: 0,
        failed: 0,
        remaining: await prisma.snapTldDomainAnalysis.count({ where: { status: "queued" } }),
      };
    }

    const analyzed = await analyzeDomainsAsync(limited, options.steps, config, userState.settings, options.selectedSubAnalyses);

    await prisma.$transaction([
      ...analyzed.map((domain) =>
        prisma.snapTldDomainAnalysis.update({
          where: { slug: domain.slug },
          data: {
            fetchedAt: parseLooseDateTime(domain.fetchedAt),
            ...buildDomainAnalysisIndex(domain),
            totalScore: domain.totalScore,
            verdict: domain.verdict,
            status: domain.status,
            aiSummary: domain.aiSummary,
            estimatedValueMin: domain.estimatedValue.min,
            estimatedValueMax: domain.estimatedValue.max,
            estimatedValueCurrency: domain.estimatedValue.currency,
            categoriesJson: JSON.stringify(domain.categories),
            seoJson: JSON.stringify(domain.seo),
            waybackJson: JSON.stringify(domain.wayback),
          },
        }),
      ),
      ...analyzed.map((domain) =>
        prisma.snapTldImportedDomain.updateMany({
          where: { slug: domain.slug },
          data: {
            status: domain.status,
            totalScore: domain.totalScore,
            verdict: domain.verdict,
            estimatedValueMin: domain.estimatedValue.min,
            estimatedValueMax: domain.estimatedValue.max,
            estimatedValueCurrency: domain.estimatedValue.currency,
          },
        }),
      ),
    ]);
    clearDomainSummaryCache();

    return {
      analyzed: analyzed.length,
      failed: 0,
      remaining: await prisma.snapTldDomainAnalysis.count({ where: { status: "queued" } }),
    };
  }

  async updateFeedSchedule(feedId: string, schedule: FeedSource["schedule"]) {
    const feed = (await this.listFeeds()).find((entry) => entry.id === feedId);
    if (!feed) throw new Error("Feed hittades inte");
    await prisma.snapTldFeedOverride.upsert({
      where: { feedId },
      create: { feedId, scheduleJson: JSON.stringify(schedule), status: null },
      update: { scheduleJson: JSON.stringify(schedule) },
    });
    return { ...feed, schedule };
  }

  async toggleFeedStatus(feedId: string) {
    const feed = (await this.listFeeds()).find((entry) => entry.id === feedId);
    if (!feed) throw new Error("Feed hittades inte");
    const nextStatus: FeedStatus = feed.status === "paused" ? "active" : "paused";
    await prisma.snapTldFeedOverride.upsert({
      where: { feedId },
      create: { feedId, status: nextStatus, scheduleJson: JSON.stringify(feed.schedule) },
      update: { status: nextStatus },
    });
    return { ...feed, status: nextStatus };
  }

  async runFeed(feedId: string) {
    return runFeeds(this, [feedId]);
  }

  async runActiveFeeds() {
    return runFeeds(this);
  }

  async createReport(input: CreateReportInput) {
    const domainCount = await prisma.snapTldDomainAnalysis.count();
    const report = await prisma.snapTldReport.create({
      data: {
        id: `r-${Date.now()}`,
        title: input.title || "Ny rapport",
        generatedAt: new Date(),
        domains: domainCount,
        highlight: input.cadence === "once" ? "Genererad manuellt" : "Schemalagd rapport",
        format: input.format,
      },
    });
    return mapPrismaReport(report);
  }
}

class HttpSnapTldRepository implements SnapTldRepository {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`SnapTLD API-fel (${response.status})`);
    }
    return response.json() as Promise<T>;
  }

  async listDomains() { return this.request<DomainAnalysis[]>("/domains?all=1"); }
  async listDomainPage(query: DomainPageQuery = {}) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || Array.isArray(value) || typeof value === "object") return;
      params.set(key, String(value));
    });
    return this.request<PaginatedResult<DomainAnalysis> & { meta: QueuePageMeta }>(`/domains?${params.toString()}`);
  }
  async getDomainBySlug(slug: string) { return this.request<DomainAnalysis | null>(`/domains/${slug}`); }
  async listImportedDomains() { return this.request<ImportedDomainRecord[]>("/imports?all=1"); }
  async listImportedDomainPage(query: ImportedPageQuery = {}) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || Array.isArray(value) || typeof value === "object") return;
      params.set(key, String(value));
    });
    return this.request<PaginatedResult<ImportedDomainRecord> & { meta: ImportedDomainsMeta }>(`/imports?${params.toString()}`);
  }
  async listFeeds() { return this.request<FeedSource[]>("/feeds"); }
  async listReports() { return this.request<Report[]>("/reports"); }
  async getReportById(reportId: string) { return this.request<Report | null>(`/reports/${reportId}`); }
  async getOverviewStats() { return this.request<OverviewStats>("/overview/stats"); }
  async getOverviewSeries() { return this.request<{ scoreTrend: { label: string; value: number }[]; volumePerDay: { label: string; value: number }[]; importedPerDay: { label: string; value: number }[] }>("/overview/series"); }
  async getUserState() { return this.request<SnapTldUserState>("/user-state"); }
  async toggleWatch(slug: string) { return this.request<string[]>(`/user-state/watchlist/${slug}`, { method: "POST" }); }
  async addWatchMany(slugs: string[]) { return this.request<string[]>("/user-state/watchlist", { method: "POST", body: JSON.stringify({ slugs }) }); }
  async toggleReviewed(slug: string) { return this.request<string[]>(`/user-state/reviewed/${slug}`, { method: "POST" }); }
  async addReviewedMany(slugs: string[]) { return this.request<string[]>("/user-state/reviewed", { method: "POST", body: JSON.stringify({ slugs }) }); }
  async toggleHidden(slug: string) { return this.request<string[]>(`/user-state/hidden/${slug}`, { method: "POST" }); }
  async addHiddenMany(slugs: string[]) { return this.request<string[]>("/user-state/hidden", { method: "POST", body: JSON.stringify({ slugs }) }); }
  async saveNote(slug: string, note: DomainNote | null) { return this.request<Record<string, DomainNote>>(`/user-state/notes/${slug}`, { method: "PUT", body: JSON.stringify({ note }) }); }
  async saveWeights(yaml: string) { return this.request<string>("/user-state/weights", { method: "PUT", body: JSON.stringify({ yaml }) }); }
  async resetWeights() { return this.request<string>("/user-state/weights/reset", { method: "POST" }); }
  async saveSettings(settings: SnapTldSettings) { return this.request<SnapTldSettings>("/user-state/settings", { method: "PUT", body: JSON.stringify(settings) }); }
  async importDomains(input: ImportDomainsInput) { return this.request<{ imported: number; duplicates: number }>("/imports", { method: "POST", body: JSON.stringify(input) }); }
  async rerunAnalysis(slug: string, step?: string) { return this.request<AnalysisRunResult>(`/domains/${slug}/rerun`, { method: "POST", body: JSON.stringify({ step }) }); }
  async analyzeQueue(input: AnalyzeQueueInput) { return this.request<AnalyzeQueueResult>("/domains/analyze-queue", { method: "POST", body: JSON.stringify(input) }); }
  async updateFeedSchedule(feedId: string, schedule: FeedSource["schedule"]) { return this.request<FeedSource>(`/feeds/${feedId}/schedule`, { method: "PUT", body: JSON.stringify({ schedule }) }); }
  async toggleFeedStatus(feedId: string) { return this.request<FeedSource>(`/feeds/${feedId}/toggle`, { method: "POST" }); }
  async runFeed(feedId: string) { return this.request<RunFeedsResult>(`/feeds/${feedId}/run`, { method: "POST" }); }
  async runActiveFeeds() { return this.request<RunFeedsResult>("/feeds/run", { method: "POST" }); }
  async createReport(input: CreateReportInput) { return this.request<Report>("/reports", { method: "POST", body: JSON.stringify(input) }); }
}

let repository: SnapTldRepository | null = null;

export function createLocalSnapTldRepository(): SnapTldRepository {
  return new PrismaSnapTldRepository();
}

export function createHttpSnapTldRepository(baseUrl: string): SnapTldRepository {
  return new HttpSnapTldRepository(baseUrl);
}

export function getSnapTldRepository(): SnapTldRepository {
  if (repository) return repository;
  const baseUrl = process.env.SNAPTLD_API_BASE_URL?.trim();
  const nextRepository: SnapTldRepository = baseUrl
    ? createHttpSnapTldRepository(baseUrl)
    : createLocalSnapTldRepository();
  repository = nextRepository;
  return nextRepository;
}

export async function getInitialSnapTldUserState() {
  try {
    return await getSnapTldRepository().getUserState();
  } catch {
    return createDefaultUserState();
  }
}
