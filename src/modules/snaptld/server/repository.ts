import type {
  SnapTldDomainAnalysis as PrismaDomainAnalysisRow,
  SnapTldFeedOverride as PrismaFeedOverrideRow,
  SnapTldImportedDomain as PrismaImportedDomainRow,
  SnapTldReport as PrismaReportRow,
  SnapTldState as PrismaStateRow,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { feedSources as rawFeeds, internetstiftelsenFeeds, reports as rawReports } from "@/modules/snaptld/data/feeds";
import { importedDomains as rawImportedDomains } from "@/modules/snaptld/data/imports";
import { defaultWeightsYaml } from "@/modules/snaptld/data/weights";
import { domainAnalyses as rawDomains, scoreTrend, volumePerDay } from "@/modules/snaptld/data/core";
import {
  addMockListValues,
  appendDomainAnalyses,
  appendImportedDomains,
  appendReport,
  getDomainOverrides,
  getFeedOverride,
  getImportedDomainOverrides,
  getMockUserState,
  getReportOverrides,
  resetMockWeights,
  saveFeedOverride,
  saveMockNote,
  saveMockSettings,
  saveMockWeights,
  toggleMockListValue,
  upsertDomainAnalysis,
  upsertImportedDomain,
} from "@/modules/snaptld/server/mock-state";
import {
  createDefaultUserState,
  mapRawDomainAnalysis,
  mapRawFeed,
  mapRawImportedDomain,
  mapRawReport,
} from "@/modules/snaptld/server/mappers";
import { parseWeightsConfig } from "@/modules/snaptld/selectors/weights";
import { analyzeSwedishDomain, type SwedishDomainProfile } from "@/modules/snaptld/server/swedish-lexicon";
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
  PaginatedResult,
  QueuePageMeta,
  RawDomainAnalysis,
  RawImportedDomainRecord,
  Report,
  RunFeedsResult,
  Signal,
  SnapTldSettings,
  SnapTldUserState,
} from "@/modules/snaptld/types";

type QueueSortKey = "score" | "domain" | "verdict" | "expires" | "source" | "value";
type SortDir = "asc" | "desc";
type ImportedSortKey = "domain" | "status" | "source" | "importedAt" | "expiresAt" | "score" | "verdict";
type AnalysisStep = AnalyzeQueueInput["steps"][number];
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
  tld?: "all" | string;
  tagFilter?: string | null;
  onlyWatched?: boolean;
  showHidden?: boolean;
  sortKey?: QueueSortKey;
  sortDir?: SortDir;
  watchedSlugs?: string[];
  hiddenSlugs?: string[];
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

  switch (category) {
    case "structure":
      return clamp(Math.round(profile.lengthScore * 0.45 + profile.coverage * 35 + profile.pronounceability * 0.2 - (profile.hasHyphen ? 6 : 0) - (profile.hasDigits ? 10 : 0)), 20, 98);
    case "lexical":
      return clamp(Math.round(profile.coverage * 58 + profile.pronounceability * 0.24 + Math.min(profile.lemmas.length, 3) * 5 - profile.stopwordRatio * 28), 15, 98);
    case "brand":
      return clamp(Math.round(profile.lengthScore * 0.38 + profile.pronounceability * 0.35 + (profile.coverage < 0.8 ? 12 : 4) - profile.stopwordRatio * 30 - (profile.hasDigits ? 12 : 0)), 15, 96);
    case "market":
      return clamp(Math.round(42 + Math.min(profile.marketCategories.length, 3) * 17 + Math.min(profile.synonymHits.length, 4) * 3 + profile.coverage * 12 - profile.stopwordRatio * 12), 20, 96);
    case "risk":
      return clamp(Math.round(86 - profile.riskWords.length * 18 - profile.stopwordRatio * 12 - (profile.hasDigits ? 5 : 0)), 18, 96);
    case "salability":
      return clamp(Math.round(profile.lengthScore * 0.28 + profile.pronounceability * 0.22 + profile.coverage * 24 + Math.min(profile.marketCategories.length, 2) * 9 - profile.stopwordRatio * 22), 18, 97);
    case "seo":
      return clamp(Math.round(38 + profile.coverage * 24 + Math.min(profile.marketCategories.length, 3) * 10 + Math.min(profile.synonymHits.length, 5) * 2), 18, 90);
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
        { label: "Segment", value: profile.segments.slice(0, 4).join(" + ") || "Okända", tone: profile.coverage >= 0.7 ? "success" : "warning" },
        { label: "Bindestreck", value: formatYesNo(profile.hasHyphen), tone: profile.hasHyphen ? "warning" : "success" },
      ];
    case "lexical":
      return [
        { label: "Svenska ord", value: formatPercent(profile.coverage), tone: profile.coverage >= 0.7 ? "success" : profile.coverage >= 0.35 ? "warning" : "danger" },
        { label: "Lemmor", value: profile.lemmas.slice(0, 4).join(", ") || "Saknas", tone: profile.lemmas.length > 0 ? "success" : "warning" },
        { label: "Stoppord", value: profile.stopwords.length ? profile.stopwords.join(", ") : "Inga", tone: profile.stopwordRatio > 0.35 ? "warning" : "success" },
      ];
    case "brand":
      return [
        { label: "Minnesvärdhet", value: score >= 75 ? "Stark" : score >= 55 ? "Medel" : "Svag", tone: scoreTone(score) },
        { label: "Uttalbarhet", value: `${profile.pronounceability}/100`, tone: scoreTone(profile.pronounceability) },
        { label: "Generiskhet", value: profile.coverage >= 0.9 ? "Hög" : "Lägre", tone: profile.coverage >= 0.9 ? "warning" : "success" },
      ];
    case "market":
      return [
        { label: "Nisch", value: profile.marketCategories.join(", ") || "Oklar", tone: profile.marketCategories.length > 0 ? "success" : "warning" },
        { label: "Synonymer", value: profile.synonymHits.slice(0, 3).join(", ") || "Inga", tone: profile.synonymHits.length > 0 ? "success" : "neutral" },
      ];
    case "risk":
      return [
        { label: "Språklig risk", value: profile.riskWords.join(", ") || "Inga träffar", tone: profile.riskWords.length > 0 ? "warning" : "success" },
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
        { label: "Sökintent", value: profile.marketCategories.join(", ") || "Oklar", tone: profile.marketCategories.length > 0 ? "success" : "neutral" },
      ];
    case "history":
      return buildCategorySignals(category, profile.label, score);
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
      return buildCategoryVerdict(category, score, domain);
  }
}

function analyzeCategory(category: AnalysisCategory, domain: string, config: AnalysisConfig): CategoryResult {
  const profile = analyzeSwedishDomain(domain);
  const score = buildLexiconCategoryScore(category, profile);
  return {
    score,
    weight: config.weights[category],
    signals: buildLexiconCategorySignals(category, profile, score),
    verdict: buildLexiconCategoryVerdict(category, score, domain, profile),
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

function hasCategoryResult(result: CategoryResult) {
  return result.score > 0 || result.signals.length > 0 || Boolean(result.verdict);
}

function analyzeDomain(domain: DomainAnalysis, requestedSteps: AnalysisStep[], config = defaultAnalysisConfig) {
  const now = new Date().toISOString();
  const normalizedSteps = normalizeAnalysisSteps(requestedSteps);
  const steps = normalizedSteps.includes("overview")
    ? (Object.keys(domain.categories) as AnalysisCategory[])
    : normalizedSteps.filter((step): step is AnalysisCategory => step !== "overview");

  const categories = { ...domain.categories };
  for (const step of steps) {
    categories[step] = analyzeCategory(step, domain.domain, config);
  }

  const scoredCategories = (Object.values(categories) as CategoryResult[]).filter(hasCategoryResult);
  const weightedTotal = scoredCategories.reduce((sum, result) => sum + result.score * result.weight, 0);
  const totalWeight = scoredCategories.reduce((sum, result) => sum + result.weight, 0);
  const totalScore = totalWeight > 0 ? Math.round(weightedTotal / totalWeight) : 0;

  const next: DomainAnalysis = {
    ...domain,
    fetchedAt: now,
    status: "analyzed",
    categories,
    totalScore,
    verdict: scoreToVerdict(totalScore, config),
    aiSummary: summarizeDomain({ ...domain, categories, totalScore, verdict: domain.verdict, fetchedAt: now, status: "analyzed" }),
    estimatedValue: {
      min: Math.max(0, totalScore * 120),
      max: Math.max(0, totalScore * 240),
      currency: "SEK",
    },
    seo: steps.includes("seo")
      ? {
          domainAuthority: clamp(Math.round(totalScore / 3), 0, 100),
          pageAuthority: clamp(Math.round(totalScore / 2.7), 0, 100),
          backlinks: Math.max(0, totalScore * 8),
          referringDomains: Math.max(0, Math.round(totalScore / 1.8)),
          spamScore: clamp(Math.round((100 - totalScore) / 6), 0, 50),
        }
      : domain.seo,
    wayback: steps.includes("history")
      ? {
          snapshots: Math.max(0, Math.round(totalScore / 5)),
          firstSeen: domain.wayback.firstSeen || now.slice(0, 10),
          lastSeen: now.slice(0, 10),
          flags: totalScore >= 60 ? [] : ["kontrollera historik manuellt"],
        }
      : domain.wayback,
  };

  next.aiSummary = summarizeDomain(next);
  return next;
}

function toRawDomainAnalysis(domain: DomainAnalysis): RawDomainAnalysis {
  return {
    ...domain,
    fetchedAt: domain.fetchedAt.replace("T", " ").replace(/:\d{2}(?:\.\d+)?Z$/, ""),
    estimatedValue: `${domain.estimatedValue.min} – ${domain.estimatedValue.max} ${domain.estimatedValue.currency === "SEK" ? "kr" : "$"}`,
  };
}

function toRawImportedDomain(domain: ImportedDomainRecord): RawImportedDomainRecord {
  return {
    ...domain,
    importedAt: domain.importedAt.replace("T", " ").replace(/:\d{2}(?:\.\d+)?Z$/, ""),
    estimatedValue: `${domain.estimatedValue.min} – ${domain.estimatedValue.max} ${domain.estimatedValue.currency === "SEK" ? "kr" : "$"}`,
  };
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

function mapPrismaDomainAnalysis(row: PrismaDomainAnalysisRow): DomainAnalysis {
  const fallback = buildQueuedAnalysis(row.domain, row.source as DomainAnalysis["source"], row.expiresAt);
  return {
    id: row.slug,
    slug: row.slug,
    domain: row.domain,
    tld: row.tld,
    source: row.source as DomainAnalysis["source"],
    fetchedAt: row.fetchedAt.toISOString(),
    expiresAt: row.expiresAt,
    totalScore: row.totalScore,
    verdict: row.verdict as DomainAnalysis["verdict"],
    status: row.status as DomainAnalysis["status"],
    aiSummary: row.aiSummary,
    estimatedValue: {
      min: row.estimatedValueMin,
      max: row.estimatedValueMax,
      currency: row.estimatedValueCurrency as DomainAnalysis["estimatedValue"]["currency"],
    },
    categories: parseJson(row.categoriesJson, fallback.categories),
    seo: parseJson(row.seoJson, fallback.seo),
    wayback: parseJson(row.waybackJson, fallback.wayback),
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

function withAnalysisSteps(
  records: ImportedDomainRecord[],
  analyses: Array<Pick<DomainAnalysis, "slug" | "categories">>,
) {
  const stepsBySlug = new Map(analyses.map((analysis) => [analysis.slug, getAnalysisSteps(analysis.categories)] as const));
  return records.map((record) => ({
    ...record,
    analysisSteps: stepsBySlug.get(record.slug) ?? [],
  }));
}

function normalizePage(page?: number) {
  return Math.max(1, Math.floor(Number.isFinite(page ?? NaN) ? page ?? 1 : 1));
}

function normalizePageSize(pageSize?: number, fallback = 50, max = 200) {
  const value = Math.floor(Number.isFinite(pageSize ?? NaN) ? pageSize ?? fallback : fallback);
  return Math.max(1, Math.min(max, value));
}

function paginate<T>(items: T[], page?: number, pageSize?: number): PaginatedResult<T> {
  const normalizedPage = normalizePage(page);
  const normalizedPageSize = normalizePageSize(pageSize);
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
      case "source":
        return a.source.localeCompare(b.source) * dir;
      case "value":
        return (a.estimatedValue.min - b.estimatedValue.min) * dir;
      case "score":
      default:
        return (a.totalScore - b.totalScore) * dir;
    }
  });
}

function filterDomains(domains: DomainAnalysis[], input: DomainPageQuery) {
  const query = input.query?.trim().toLowerCase() ?? "";
  const watched = new Set(input.watchedSlugs ?? []);
  const hidden = new Set(input.hiddenSlugs ?? []);
  const tagged =
    input.tagFilter && input.notes
      ? new Set(Object.entries(input.notes).filter(([, note]) => note.tags.includes(input.tagFilter as string)).map(([slug]) => slug))
      : null;

  return domains.filter((domain) => {
    if (input.verdict && input.verdict !== "all" && domain.verdict !== input.verdict) return false;
    if (input.tld && input.tld !== "all" && domain.tld !== input.tld) return false;
    if (tagged && !tagged.has(domain.slug)) return false;
    if (input.onlyWatched && !watched.has(domain.slug)) return false;

    const isHidden = hidden.has(domain.slug);
    if (isHidden && !input.showHidden) return false;
    if (!isHidden && input.showHidden) return false;

    if (query && !domain.domain.toLowerCase().includes(query) && !domain.source.toLowerCase().includes(query)) return false;
    return true;
  });
}

function getQueueMeta(domains: DomainAnalysis[]): QueuePageMeta {
  return {
    totalDomains: domains.length,
    uniqueTlds: Array.from(new Set(domains.map((domain) => domain.tld))).sort(),
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
        return (a.totalScore - b.totalScore) * dir;
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

function buildOverviewSeries(rows: { totalScore: number; updatedAt: Date }[]) {
  if (rows.length === 0) return { scoreTrend: [], volumePerDay: [] };

  const formatter = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short" });
  const today = new Date();
  const days = Array.from({ length: 8 }, (_, index) => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (7 - index));
    const key = date.toISOString().slice(0, 10);
    return { key, label: formatter.format(date).replace(".", ""), scores: [] as number[] };
  });
  const byKey = new Map(days.map((day) => [day.key, day]));

  rows.forEach((row) => {
    const key = row.updatedAt.toISOString().slice(0, 10);
    byKey.get(key)?.scores.push(row.totalScore);
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
  };
}

function normalizeAnalyzeQueueInput(input: AnalyzeQueueInput) {
  const steps = input.steps.length > 0 ? input.steps : (["overview"] as AnalysisStep[]);
  return {
    ...input,
    steps,
    scope: input.scope ?? "queued",
    sortBy: input.sortBy ?? "oldest-imported",
  };
}

function sortQueueCandidates<T extends { domain: string; importedAt?: string; expiresAt: string; totalScore: number }>(
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
        return (a.totalScore - b.totalScore) * direction;
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
  getOverviewSeries(): Promise<{ scoreTrend: { label: string; value: number }[]; volumePerDay: { label: string; value: number }[] }>;
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

class MockSnapTldRepository implements SnapTldRepository {
  async listDomains() {
    const bySlug = new Map(rawDomains.map((entry) => [entry.slug, entry]));
    getDomainOverrides().forEach((entry) => bySlug.set(entry.slug, entry));
    return [...bySlug.values()].map(mapRawDomainAnalysis);
  }

  async listDomainPage(query: DomainPageQuery = {}) {
    const domains = await this.listDomains();
    return {
      ...paginate(sortDomains(filterDomains(domains, query), query.sortKey, query.sortDir), query.page, query.pageSize),
      meta: getQueueMeta(domains),
    };
  }

  async getDomainBySlug(slug: string) {
    return (await this.listDomains()).find((entry) => entry.slug === slug) ?? null;
  }

  async listImportedDomains() {
    const bySlug = new Map(rawImportedDomains.map((entry) => [entry.slug, entry]));
    getImportedDomainOverrides().forEach((entry) => bySlug.set(entry.slug, entry));
    return withAnalysisSteps([...bySlug.values()].map(mapRawImportedDomain), await this.listDomains());
  }

  async listImportedDomainPage(query: ImportedPageQuery = {}) {
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
    return rawFeeds.map(mapRawFeed).map((feed) => {
      const override = getFeedOverride(feed.id);
      if (!override) return feed;
      return {
        ...feed,
        status: override.status ?? feed.status,
        schedule: override.schedule ?? feed.schedule,
      };
    });
  }

  async listReports() {
    return [...getReportOverrides(), ...rawReports.map(mapRawReport)];
  }

  async getReportById(reportId: string) {
    return (await this.listReports()).find((report) => report.id === reportId) ?? null;
  }

  async getOverviewSeries() {
    return { scoreTrend, volumePerDay };
  }

  async getUserState() {
    return getMockUserState();
  }

  async toggleWatch(slug: string) {
    return toggleMockListValue("watchlist", slug);
  }

  async addWatchMany(slugs: string[]) {
    return addMockListValues("watchlist", slugs);
  }

  async toggleReviewed(slug: string) {
    return toggleMockListValue("reviewed", slug);
  }

  async addReviewedMany(slugs: string[]) {
    return addMockListValues("reviewed", slugs);
  }

  async toggleHidden(slug: string) {
    return toggleMockListValue("hidden", slug);
  }

  async addHiddenMany(slugs: string[]) {
    return addMockListValues("hidden", slugs);
  }

  async saveNote(slug: string, note: DomainNote | null) {
    return saveMockNote(slug, note);
  }

  async saveWeights(yaml: string) {
    return saveMockWeights(yaml);
  }

  async resetWeights() {
    return resetMockWeights();
  }

  async saveSettings(settings: SnapTldSettings) {
    return saveMockSettings(settings);
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

    const config = buildAnalysisConfig((await this.getUserState()).activeWeightsYaml);
    const domainAnalyses =
      input.selectedSteps.length > 0
        ? newImportedDomains.map((entry) =>
            analyzeDomain(
              buildQueuedAnalysis(entry.domain, entry.source, entry.expiresAt),
              input.selectedSteps,
              config,
            ),
          )
        : newImportedDomains
            .filter((entry) => !existingAnalysisSlugs.has(entry.slug))
            .map((entry) => buildQueuedAnalysis(entry.domain, entry.source, entry.expiresAt));

    const importedDomainRecords = newImportedDomains.map((entry) => ({
      ...entry,
      status: input.selectedSteps.length > 0 ? ("analyzed" as const) : entry.status,
      totalScore: domainAnalyses.find((analysis) => analysis.slug === entry.slug)?.totalScore ?? entry.totalScore,
      verdict: domainAnalyses.find((analysis) => analysis.slug === entry.slug)?.verdict ?? entry.verdict,
      estimatedValue: domainAnalyses.find((analysis) => analysis.slug === entry.slug)?.estimatedValue ?? entry.estimatedValue,
    }));

    if (importedDomainRecords.length > 0) {
      appendImportedDomains(importedDomainRecords.map(toRawImportedDomain));
    }
    if (domainAnalyses.length > 0) {
      appendDomainAnalyses(domainAnalyses.map(toRawDomainAnalysis));
    }

    return {
      imported: newImportedDomains.length,
      duplicates: duplicateCount,
    };
  }

  async rerunAnalysis(slug: string, step = "overview") {
    const domain = await this.getDomainBySlug(slug);
    if (!domain) throw new Error("Domän hittades inte");

    if (step !== "overview" && !isAnalysisCategory(step)) throw new Error("Ogiltigt analyssteg");
    const config = buildAnalysisConfig((await this.getUserState()).activeWeightsYaml);
    const next = analyzeDomain(domain, [step as AnalysisStep], config);
    upsertDomainAnalysis(toRawDomainAnalysis(next));

    const imported = (await this.listImportedDomains()).find((entry) => entry.slug === slug);
    if (imported) {
      upsertImportedDomain(
        toRawImportedDomain({
          ...imported,
          status: next.status,
          totalScore: next.totalScore,
          verdict: next.verdict,
          estimatedValue: next.estimatedValue,
        }),
      );
    }

    return { analyzed: true };
  }

  async analyzeQueue(input: AnalyzeQueueInput) {
    const options = normalizeAnalyzeQueueInput(input);
    const config = buildAnalysisConfig((await this.getUserState()).activeWeightsYaml);
    const domains = await this.listDomains();
    const importedBySlug = new Map((await this.listImportedDomains()).map((entry) => [entry.slug, entry] as const));
    const candidates = domains.filter((domain) => {
      const imported = importedBySlug.get(domain.slug);
      if (options.scope === "selected" && !(options.slugs ?? []).includes(domain.slug)) return false;
      if (options.scope === "queued" && domain.status !== "queued") return false;
      if (options.scope === "not-analyzed" && domain.status === "analyzed") return false;
      if (options.scope === "missing-step" && (!options.missingStep || getAnalysisSteps(domain.categories).includes(options.missingStep))) return false;
      if (options.dateFilter && imported) {
        const importedDate = imported.importedAt.slice(0, 10);
        if (options.dateFilter.direction === "before" && importedDate >= options.dateFilter.date) return false;
        if (options.dateFilter.direction === "after" && importedDate <= options.dateFilter.date) return false;
      }
      return true;
    });
    const limited = sortQueueCandidates(
      candidates.map((domain) => ({ ...domain, importedAt: importedBySlug.get(domain.slug)?.importedAt })),
      options.sortBy,
    ).slice(0, options.limit === "all" ? undefined : Math.max(1, Math.min(options.limit ?? 25, 1000)));
    const analyzed = limited.map((domain) => analyzeDomain(domain, options.steps, config));

    analyzed.forEach((domain) => upsertDomainAnalysis(toRawDomainAnalysis(domain)));

    analyzed.forEach((domain) => {
      const imported = importedBySlug.get(domain.slug);
      if (!imported) return;
      upsertImportedDomain(
        toRawImportedDomain({
          ...imported,
          status: domain.status,
          totalScore: domain.totalScore,
          verdict: domain.verdict,
          estimatedValue: domain.estimatedValue,
        }),
      );
    });

    const remaining = (await this.listDomains()).filter((domain) => domain.status === "queued").length;
    return { analyzed: analyzed.length, remaining, failed: 0 };
  }

  async updateFeedSchedule(feedId: string, schedule: FeedSource["schedule"]) {
    const feed = (await this.listFeeds()).find((entry) => entry.id === feedId);
    if (!feed) throw new Error("Feed hittades inte");
    saveFeedOverride(feedId, { schedule });
    return { ...feed, schedule };
  }

  async toggleFeedStatus(feedId: string) {
    const feed = (await this.listFeeds()).find((entry) => entry.id === feedId);
    if (!feed) throw new Error("Feed hittades inte");
    const nextStatus: FeedStatus = feed.status === "paused" ? "active" : "paused";
    saveFeedOverride(feedId, { status: nextStatus });
    return { ...feed, status: nextStatus };
  }

  async runFeed(feedId: string) {
    return runFeeds(this, [feedId]);
  }

  async runActiveFeeds() {
    return runFeeds(this);
  }

  async createReport(input: CreateReportInput) {
    const domainCount = (await this.listDomains()).length;
    const report: Report = {
      id: `r-${Date.now()}`,
      title: input.title || "Ny rapport",
      generatedAt: new Date().toISOString(),
      domains: domainCount,
      highlight: input.cadence === "once" ? "Genererad manuellt" : "Schemalagd rapport",
      format: input.format,
    };
    appendReport(report);
    return report;
  }
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
    const dbRows = await prisma.snapTldDomainAnalysis.findMany();
    return dbRows.map(mapPrismaDomainAnalysis);
  }

  async listDomainPage(query: DomainPageQuery = {}) {
    const domains = await this.listDomains();
    return {
      ...paginate(sortDomains(filterDomains(domains, query), query.sortKey, query.sortDir), query.page, query.pageSize),
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
    const analysisRows = await prisma.snapTldDomainAnalysis.findMany({
      select: { slug: true, domain: true, source: true, expiresAt: true, categoriesJson: true },
    });
    const dbAnalyses = analysisRows.map((row) => ({
      slug: row.slug,
      categories: parseJson(
        row.categoriesJson,
        buildQueuedAnalysis(row.domain, row.source as DomainAnalysis["source"], row.expiresAt).categories,
      ),
    }));
    return withAnalysisSteps(dbRows.map(mapPrismaImportedDomain), dbAnalyses);
  }

  async listImportedDomainPage(query: ImportedPageQuery = {}) {
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
    const overrides = await prisma.snapTldFeedOverride.findMany();
    const overrideMap = new Map(overrides.map((row) => [row.feedId, row] as const));
    return rawFeeds.map(mapRawFeed).map((feed) => {
      const override = overrideMap.get(feed.id);
      if (!override) return feed;
      return {
        ...feed,
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

  async getOverviewSeries() {
    const rows = await prisma.snapTldDomainAnalysis.findMany({
      where: { status: "analyzed" },
      select: { totalScore: true, updatedAt: true },
    });
    return buildOverviewSeries(rows);
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

    const config = buildAnalysisConfig((await this.getUserState()).activeWeightsYaml);
    const domainAnalyses =
      input.selectedSteps.length > 0
        ? newImportedDomains.map((entry) => analyzeDomain(buildQueuedAnalysis(entry.domain, entry.source, entry.expiresAt), input.selectedSteps, config))
        : newImportedDomains
            .filter((entry) => !existingAnalysisSlugs.has(entry.slug))
            .map((entry) => buildQueuedAnalysis(entry.domain, entry.source, entry.expiresAt));

    const analysisBySlug = new Map(domainAnalyses.map((analysis) => [analysis.slug, analysis] as const));
    const importedDomainRecords = newImportedDomains.map((entry) => {
      const analysis = analysisBySlug.get(entry.slug);
      return {
        ...entry,
        status: analysis ? ("analyzed" as const) : entry.status,
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
            expiresAt: analysis.expiresAt,
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
            expiresAt: analysis.expiresAt,
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

    return {
      imported: newImportedDomains.length,
      duplicates: duplicateCount,
    };
  }

  async rerunAnalysis(slug: string, step = "overview") {
    const domain = await this.getDomainBySlug(slug);
    if (!domain) throw new Error("Domän hittades inte");

    if (step !== "overview" && !isAnalysisCategory(step)) throw new Error("Ogiltigt analyssteg");
    const config = buildAnalysisConfig((await this.getUserState()).activeWeightsYaml);
    const next = analyzeDomain(domain, [step as AnalysisStep], config);

    await prisma.snapTldDomainAnalysis.upsert({
      where: { slug },
      create: {
        slug: next.slug,
        domain: next.domain,
        tld: next.tld,
        source: next.source,
        fetchedAt: parseLooseDateTime(next.fetchedAt),
        expiresAt: next.expiresAt,
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
        expiresAt: next.expiresAt,
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

    return { analyzed: true };
  }

  async analyzeQueue(input: AnalyzeQueueInput) {
    const options = normalizeAnalyzeQueueInput(input);
    const config = buildAnalysisConfig((await this.getUserState()).activeWeightsYaml);
    const [analysisRows, importedRows] = await Promise.all([
      prisma.snapTldDomainAnalysis.findMany(),
      prisma.snapTldImportedDomain.findMany({ select: { slug: true, importedAt: true } }),
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

    const analyzed = limited.map((domain) => analyzeDomain(domain, options.steps, config));

    await prisma.$transaction([
      ...analyzed.map((domain) =>
        prisma.snapTldDomainAnalysis.update({
          where: { slug: domain.slug },
          data: {
            fetchedAt: parseLooseDateTime(domain.fetchedAt),
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
  async getOverviewSeries() { return this.request<{ scoreTrend: { label: string; value: number }[]; volumePerDay: { label: string; value: number }[] }>("/overview/series"); }
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

export function createMockSnapTldRepository(): SnapTldRepository {
  return new MockSnapTldRepository();
}

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
