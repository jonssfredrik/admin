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
export type CurrencyCode = "SEK" | "USD";
export type DomainSource = "internetstiftelsen" | "manual" | "csv" | "url";
export type AnalysisStatus = "analyzed" | "queued" | "running" | "failed";
export type FeedStatus = "active" | "paused" | "error";
export type FeedType = "json" | "csv" | "rss";
export type ReportFormat = "pdf" | "csv" | "json";

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

export interface MoneyValueRange {
  min: number;
  max: number;
  currency: CurrencyCode;
}

export interface DomainAnalysis {
  id: string;
  slug: string;
  domain: string;
  tld: string;
  source: DomainSource;
  fetchedAt: string;
  expiresAt: string;
  totalScore: number;
  verdict: Verdict;
  status: AnalysisStatus;
  categories: Record<AnalysisCategory, CategoryResult>;
  aiSummary: string;
  estimatedValue: MoneyValueRange;
  seo: SeoInfo;
  wayback: WaybackInfo;
}

export interface DomainRecord {
  id: string;
  slug: string;
  domain: string;
  tld: string;
  source: DomainSource;
  importedAt: string;
  importedBy: string;
  batchId: string;
  status: AnalysisStatus;
  expiresAt: string;
}

export interface ImportedDomainRecord extends DomainRecord {
  sourceLabel: string;
  totalScore: number;
  verdict: Verdict;
  estimatedValue: MoneyValueRange;
  analysisSteps?: AnalysisCategory[];
}

export interface FeedSchedule {
  type: "hourly" | "interval" | "daily" | "weekly" | "custom";
  label: string;
  intervalHours?: number;
  cron?: string;
  weekday?: string;
  time?: string;
}

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  type: FeedType;
  tld: string;
  status: FeedStatus;
  lastFetchedAt: string;
  domainsLastRun: number;
  schedule: FeedSchedule;
}

export interface Report {
  id: string;
  title: string;
  generatedAt: string;
  domains: number;
  highlight: string;
  format: ReportFormat;
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

export interface DomainNote {
  text: string;
  tags: string[];
  updatedAt: string;
}

export interface SnapTldUserState {
  watchlist: string[];
  reviewed: string[];
  hidden: string[];
  notes: Record<string, DomainNote>;
  activeWeightsYaml: string;
  settings: SnapTldSettings;
}

export interface RawDomainAnalysis {
  slug: string;
  domain: string;
  tld: string;
  source: DomainSource;
  fetchedAt: string;
  expiresAt: string;
  totalScore: number;
  verdict: Verdict;
  status: AnalysisStatus;
  categories: Record<AnalysisCategory, CategoryResult>;
  aiSummary: string;
  estimatedValue: string;
  seo: SeoInfo;
  wayback: WaybackInfo;
}

export interface RawImportedDomainRecord {
  slug: string;
  domain: string;
  tld: string;
  source: DomainSource;
  sourceLabel: string;
  importedAt: string;
  importedBy: string;
  batchId: string;
  status: AnalysisStatus;
  expiresAt: string;
  totalScore: number;
  verdict: Verdict;
  estimatedValue: string;
}

export interface RawFeedSource {
  id: string;
  name: string;
  url: string;
  type: FeedType;
  tld: string;
  status: FeedStatus;
  lastFetched: string;
  domainsLastRun: number;
  cadence: string;
}

export interface RawReport {
  id: string;
  title: string;
  generatedAt: string;
  domains: number;
  highlight: string;
  format: ReportFormat;
}

export interface ImportDomainsInput {
  mode: "url" | "text" | "csv" | "json";
  url?: string;
  validDomains: string[];
  duplicates: string[];
  selectedSteps: Array<"overview" | AnalysisCategory>;
}

export interface CreateReportInput {
  title: string;
  templateId: string;
  cadence: string;
  format: ReportFormat;
  recipients: string;
}

export interface RunFeedsResult {
  feeds: number;
  imported: number;
  duplicates: number;
}

export interface AnalyzeQueueInput {
  limit?: number | "all";
  steps: Array<"overview" | AnalysisCategory>;
  scope: "queued" | "not-analyzed" | "all" | "missing-step" | "selected";
  slugs?: string[];
  dateFilter?: {
    direction: "before" | "after";
    date: string;
  } | null;
  missingStep?: AnalysisCategory | null;
  sortBy?: "oldest-imported" | "newest-imported" | "expires-soon" | "highest-score" | "lowest-score" | "domain";
}

export interface AnalyzeQueueResult {
  analyzed: number;
  remaining: number;
  failed: number;
}

export interface AnalysisRunResult {
  analyzed: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface QueuePageMeta {
  totalDomains: number;
  uniqueTlds: string[];
}

export interface ImportedDomainsMeta {
  totalDomains: number;
  importedToday: number;
  analyzed: number;
  running: number;
  uniqueBatches: number;
  uniqueTlds: string[];
  uniqueSources: Array<{ id: DomainSource; label: string }>;
}
