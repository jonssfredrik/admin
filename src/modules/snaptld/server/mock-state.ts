import { defaultWeightsYaml } from "@/modules/snaptld/data/weights";
import type { DomainNote, FeedSource, FeedStatus, Report, SnapTldSettings, SnapTldUserState } from "@/modules/snaptld/types";
import { createDefaultSettings } from "@/modules/snaptld/server/mappers";

const userState: SnapTldUserState = {
  watchlist: [],
  reviewed: [],
  hidden: [],
  notes: {},
  activeWeightsYaml: defaultWeightsYaml,
  settings: createDefaultSettings(),
};

const feedOverrides = new Map<string, { status?: FeedStatus; schedule?: FeedSource["schedule"] }>();
const reportOverrides: Report[] = [];

export function getMockUserState(): SnapTldUserState {
  return {
    watchlist: [...userState.watchlist],
    reviewed: [...userState.reviewed],
    hidden: [...userState.hidden],
    notes: { ...userState.notes },
    activeWeightsYaml: userState.activeWeightsYaml,
    settings: {
      apiKeys: { ...userState.settings.apiKeys },
      thresholds: { ...userState.settings.thresholds },
      notifyEmail: userState.settings.notifyEmail,
      pushEnabled: userState.settings.pushEnabled,
    },
  };
}

export function toggleMockListValue(key: "watchlist" | "reviewed" | "hidden", slug: string) {
  const set = new Set(userState[key]);
  if (set.has(slug)) set.delete(slug);
  else set.add(slug);
  userState[key] = [...set];
  return [...userState[key]];
}

export function addMockListValues(key: "watchlist" | "reviewed" | "hidden", slugs: string[]) {
  const set = new Set(userState[key]);
  slugs.forEach((slug) => set.add(slug));
  userState[key] = [...set];
  return [...userState[key]];
}

export function saveMockNote(slug: string, note: DomainNote | null) {
  if (note) userState.notes[slug] = note;
  else delete userState.notes[slug];
  return { ...userState.notes };
}

export function saveMockWeights(yaml: string) {
  userState.activeWeightsYaml = yaml;
  return userState.activeWeightsYaml;
}

export function resetMockWeights() {
  userState.activeWeightsYaml = defaultWeightsYaml;
  return userState.activeWeightsYaml;
}

export function saveMockSettings(settings: SnapTldSettings) {
  userState.settings = {
    apiKeys: { ...settings.apiKeys },
    thresholds: { ...settings.thresholds },
    notifyEmail: settings.notifyEmail,
    pushEnabled: settings.pushEnabled,
  };
  return getMockUserState().settings;
}

export function getFeedOverride(feedId: string) {
  return feedOverrides.get(feedId);
}

export function saveFeedOverride(feedId: string, next: { status?: FeedStatus; schedule?: FeedSource["schedule"] }) {
  const current = feedOverrides.get(feedId) ?? {};
  feedOverrides.set(feedId, { ...current, ...next });
}

export function appendReport(report: Report) {
  reportOverrides.unshift(report);
}

export function getReportOverrides() {
  return [...reportOverrides];
}
