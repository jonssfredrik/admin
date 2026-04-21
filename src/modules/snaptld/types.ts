export type AnalysisCategory =
  | "structure"
  | "lexical"
  | "brand"
  | "market"
  | "risk"
  | "salability"
  | "seo"
  | "history";

export type Tone = "success" | "warning" | "danger" | "neutral";

export type Verdict = "excellent" | "good" | "mediocre" | "skip";

export interface Signal {
  label: string;
  value: string;
  tone: Tone;
}

export interface CategoryResult {
  score: number;
  weight: number;
  signals: Signal[];
  verdict?: string;
}

export interface WaybackInfo {
  snapshots: number;
  firstSeen: string;
  lastSeen: string;
  flags: string[];
}

export interface SeoInfo {
  domainAuthority: number;
  pageAuthority: number;
  backlinks: number;
  referringDomains: number;
  spamScore: number;
}

export interface DomainAnalysis {
  slug: string;
  domain: string;
  tld: string;
  source: "internetstiftelsen" | "manual" | "csv" | "url";
  fetchedAt: string;
  expiresAt: string;
  totalScore: number;
  verdict: Verdict;
  status: "analyzed" | "queued" | "running" | "failed";
  categories: Record<AnalysisCategory, CategoryResult>;
  aiSummary: string;
  estimatedValue: string;
  seo: SeoInfo;
  wayback: WaybackInfo;
}

export interface DomainRecord {
  slug: string;
  domain: string;
  tld: string;
  source: DomainAnalysis["source"];
  importedAt: string;
  importedBy: string;
  batchId: string;
  status: DomainAnalysis["status"];
  expiresAt: string;
}

export interface ImportedDomainRecord extends DomainRecord {
  sourceLabel: string;
  totalScore: number;
  verdict: Verdict;
  estimatedValue: string;
}

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  type: "json" | "csv" | "rss";
  tld: string;
  status: "active" | "paused" | "error";
  lastFetched: string;
  domainsLastRun: number;
  cadence: string;
}

export interface Report {
  id: string;
  title: string;
  generatedAt: string;
  domains: number;
  highlight: string;
  format: "pdf" | "csv" | "json";
}

export interface WeightsConfig {
  weights: Partial<Record<AnalysisCategory, number>>;
  thresholds: Partial<Record<Verdict, number>>;
  ai: {
    model: string;
    enabledCategories: AnalysisCategory[];
    temperature?: number;
  };
  sources: Array<{
    id: string;
    enabled: boolean;
  }>;
}

export interface SnapTldSettings {
  apiKeys: Record<string, string>;
  thresholds: {
    scoreAlert: number;
    expiryAlert: number;
    costCap: number;
  };
  notifyEmail: string;
  pushEnabled: boolean;
}
