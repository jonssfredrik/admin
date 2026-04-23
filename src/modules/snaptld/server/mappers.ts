import { defaultWeightsYaml } from "@/modules/snaptld/data/weights";
import type {
  CurrencyCode,
  DomainAnalysis,
  FeedSchedule,
  FeedSource,
  ImportedDomainRecord,
  RawDomainAnalysis,
  RawFeedSource,
  RawImportedDomainRecord,
  RawReport,
  Report,
  SnapTldSettings,
  SnapTldUserState,
} from "@/modules/snaptld/types";

function normalizeDateTime(value: string) {
  return value.includes("T") ? value : `${value.replace(" ", "T")}:00`;
}

function parseMoneyValueRange(value: string) {
  const matches = [...value.matchAll(/\d[\d\s]*/g)].map((match) =>
    Number.parseInt(match[0].replace(/\s/g, ""), 10),
  );
  const currency: CurrencyCode = value.includes("$") ? "USD" : "SEK";
  return {
    min: matches[0] ?? 0,
    max: matches[1] ?? matches[0] ?? 0,
    currency,
  };
}

function parseSchedule(value: string): FeedSchedule {
  if (/^Varje timme$/i.test(value)) return { type: "hourly", label: value, intervalHours: 1 };
  const intervalMatch = value.match(/Var\s+(\d+):e\s+timme/i);
  if (intervalMatch) {
    return { type: "interval", label: value, intervalHours: Number(intervalMatch[1]) };
  }
  const dailyMatch = value.match(/^Dagligen\s+(\d{2}:\d{2})$/i);
  if (dailyMatch) return { type: "daily", label: value, time: dailyMatch[1] };
  const weeklyMatch = value.match(/^Veckovis(?:\s+\(([^)]+)\))?(?:\s+([^\s]+\s+\d{2}:\d{2}))?$/i);
  if (weeklyMatch) {
    return {
      type: "weekly",
      label: value,
      weekday: weeklyMatch[1]?.trim() ?? "måndag",
      time: weeklyMatch[2]?.trim().split(" ").at(-1),
    };
  }
  return { type: "custom", label: value, cron: value };
}

export function mapRawDomainAnalysis(raw: RawDomainAnalysis): DomainAnalysis {
  return {
    id: raw.slug,
    slug: raw.slug,
    domain: raw.domain,
    tld: raw.tld,
    source: raw.source,
    fetchedAt: normalizeDateTime(raw.fetchedAt),
    expiresAt: raw.expiresAt,
    totalScore: raw.totalScore,
    verdict: raw.verdict,
    status: raw.status,
    categories: raw.categories,
    aiSummary: raw.aiSummary,
    estimatedValue: parseMoneyValueRange(raw.estimatedValue),
    seo: raw.seo,
    wayback: raw.wayback,
  };
}

export function mapRawImportedDomain(raw: RawImportedDomainRecord): ImportedDomainRecord {
  return {
    id: raw.slug,
    slug: raw.slug,
    domain: raw.domain,
    tld: raw.tld,
    source: raw.source,
    sourceLabel: raw.sourceLabel,
    importedAt: normalizeDateTime(raw.importedAt),
    importedBy: raw.importedBy,
    batchId: raw.batchId,
    status: raw.status,
    expiresAt: raw.expiresAt,
    totalScore: raw.totalScore,
    verdict: raw.verdict,
    estimatedValue: parseMoneyValueRange(raw.estimatedValue),
  };
}

export function mapRawFeed(raw: RawFeedSource): FeedSource {
  return {
    id: raw.id,
    name: raw.name,
    url: raw.url,
    type: raw.type,
    tld: raw.tld,
    status: raw.status,
    lastFetchedAt: normalizeDateTime(raw.lastFetched),
    domainsLastRun: raw.domainsLastRun,
    schedule: parseSchedule(raw.cadence),
  };
}

export function mapRawReport(raw: RawReport): Report {
  return {
    id: raw.id,
    title: raw.title,
    generatedAt: normalizeDateTime(raw.generatedAt),
    domains: raw.domains,
    highlight: raw.highlight,
    format: raw.format,
  };
}

export function createDefaultSettings(): SnapTldSettings {
  return {
    apiKeys: {},
    thresholds: {
      scoreAlert: 85,
      expiryAlert: 3,
      costCap: 250,
    },
    notifyEmail: "",
    pushEnabled: true,
  };
}

export function createDefaultUserState(): SnapTldUserState {
  return {
    watchlist: [],
    reviewed: [],
    hidden: [],
    notes: {},
    activeWeightsYaml: defaultWeightsYaml,
    settings: createDefaultSettings(),
  };
}
