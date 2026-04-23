import { feedSources as rawFeeds, reports as rawReports } from "@/modules/snaptld/data/feeds";
import { importedDomains as rawImportedDomains } from "@/modules/snaptld/data/imports";
import { defaultWeightsYaml } from "@/modules/snaptld/data/weights";
import { domainAnalyses as rawDomains, scoreTrend, volumePerDay } from "@/modules/snaptld/data/core";
import {
  addMockListValues,
  appendReport,
  getFeedOverride,
  getMockUserState,
  getReportOverrides,
  resetMockWeights,
  saveFeedOverride,
  saveMockNote,
  saveMockSettings,
  saveMockWeights,
  toggleMockListValue,
} from "@/modules/snaptld/server/mock-state";
import {
  createDefaultUserState,
  mapRawDomainAnalysis,
  mapRawFeed,
  mapRawImportedDomain,
  mapRawReport,
} from "@/modules/snaptld/server/mappers";
import type {
  CreateReportInput,
  DomainAnalysis,
  DomainNote,
  FeedStatus,
  FeedSource,
  ImportDomainsInput,
  ImportedDomainRecord,
  Report,
  SnapTldSettings,
  SnapTldUserState,
} from "@/modules/snaptld/types";

export interface SnapTldRepository {
  listDomains(): Promise<DomainAnalysis[]>;
  getDomainBySlug(slug: string): Promise<DomainAnalysis | null>;
  listImportedDomains(): Promise<ImportedDomainRecord[]>;
  listFeeds(): Promise<FeedSource[]>;
  listReports(): Promise<Report[]>;
  getReportById(reportId: string): Promise<Report | null>;
  getOverviewSeries(): Promise<{ scoreTrend: typeof scoreTrend; volumePerDay: typeof volumePerDay }>;
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
  rerunAnalysis(slug: string, step?: string): Promise<{ queued: boolean }>;
  updateFeedSchedule(feedId: string, schedule: FeedSource["schedule"]): Promise<FeedSource>;
  toggleFeedStatus(feedId: string): Promise<FeedSource>;
  createReport(input: CreateReportInput): Promise<Report>;
}

class MockSnapTldRepository implements SnapTldRepository {
  async listDomains() {
    return rawDomains.map(mapRawDomainAnalysis);
  }

  async getDomainBySlug(slug: string) {
    return (await this.listDomains()).find((entry) => entry.slug === slug) ?? null;
  }

  async listImportedDomains() {
    return rawImportedDomains.map(mapRawImportedDomain);
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
    return {
      imported: input.mode === "url" ? 1 : input.validDomains.length,
      duplicates: input.duplicates.length,
    };
  }

  async rerunAnalysis() {
    return { queued: true };
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

  async createReport(input: CreateReportInput) {
    const report: Report = {
      id: `r-${Date.now()}`,
      title: input.title || "Ny rapport",
      generatedAt: new Date().toISOString(),
      domains: 0,
      highlight: input.cadence === "once" ? "Genererad manuellt" : "Schemalagd rapport",
      format: input.format,
    };
    appendReport(report);
    return report;
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

  async listDomains() { return this.request<DomainAnalysis[]>("/domains"); }
  async getDomainBySlug(slug: string) { return this.request<DomainAnalysis | null>(`/domains/${slug}`); }
  async listImportedDomains() { return this.request<ImportedDomainRecord[]>("/imports"); }
  async listFeeds() { return this.request<FeedSource[]>("/feeds"); }
  async listReports() { return this.request<Report[]>("/reports"); }
  async getReportById(reportId: string) { return this.request<Report | null>(`/reports/${reportId}`); }
  async getOverviewSeries() { return this.request<{ scoreTrend: typeof scoreTrend; volumePerDay: typeof volumePerDay }>("/overview/series"); }
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
  async rerunAnalysis(slug: string, step?: string) { return this.request<{ queued: boolean }>(`/domains/${slug}/rerun`, { method: "POST", body: JSON.stringify({ step }) }); }
  async updateFeedSchedule(feedId: string, schedule: FeedSource["schedule"]) { return this.request<FeedSource>(`/feeds/${feedId}/schedule`, { method: "PUT", body: JSON.stringify({ schedule }) }); }
  async toggleFeedStatus(feedId: string) { return this.request<FeedSource>(`/feeds/${feedId}/toggle`, { method: "POST" }); }
  async createReport(input: CreateReportInput) { return this.request<Report>("/reports", { method: "POST", body: JSON.stringify(input) }); }
}

let repository: SnapTldRepository | null = null;

export function getSnapTldRepository(): SnapTldRepository {
  if (repository) return repository;
  const baseUrl = process.env.SNAPTLD_API_BASE_URL?.trim();
  const nextRepository: SnapTldRepository = baseUrl
    ? new HttpSnapTldRepository(baseUrl)
    : new MockSnapTldRepository();
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
