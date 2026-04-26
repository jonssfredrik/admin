import { defaultWeightsYaml } from "@/modules/snaptld/data/weights";
import type {
  DomainNote,
  FeedSource,
  FeedStatus,
  RawDomainAnalysis,
  RawImportedDomainRecord,
  Report,
  SnapTldSettings,
  SnapTldUserState,
} from "@/modules/snaptld/types";
import { createDefaultSettings } from "@/modules/snaptld/server/mappers";

interface PersistedMockState {
  userState: SnapTldUserState;
  feedOverrides: Array<[string, { status?: FeedStatus; schedule?: FeedSource["schedule"] }]>;
  reportOverrides: Report[];
  importedDomainOverrides: RawImportedDomainRecord[];
  domainOverrides: RawDomainAnalysis[];
}

function createInitialState(): PersistedMockState {
  return {
    userState: {
      watchlist: [],
      reviewed: [],
      hidden: [],
      notes: {},
      activeWeightsYaml: defaultWeightsYaml,
      settings: createDefaultSettings(),
    },
    feedOverrides: [],
    reportOverrides: [],
    importedDomainOverrides: [],
    domainOverrides: [],
  };
}

const state = createInitialState();
const feedOverrides = new Map<string, { status?: FeedStatus; schedule?: FeedSource["schedule"] }>();

export function getMockUserState(): SnapTldUserState {
  return {
    watchlist: [...state.userState.watchlist],
    reviewed: [...state.userState.reviewed],
    hidden: [...state.userState.hidden],
    notes: { ...state.userState.notes },
    activeWeightsYaml: state.userState.activeWeightsYaml,
    settings: {
      apiKeys: { ...state.userState.settings.apiKeys },
      thresholds: { ...state.userState.settings.thresholds },
      notifyEmail: state.userState.settings.notifyEmail,
      pushEnabled: state.userState.settings.pushEnabled,
    },
  };
}

export function toggleMockListValue(key: "watchlist" | "reviewed" | "hidden", slug: string) {
  const set = new Set(state.userState[key]);
  if (set.has(slug)) set.delete(slug);
  else set.add(slug);
  state.userState[key] = [...set];
  return [...state.userState[key]];
}

export function addMockListValues(key: "watchlist" | "reviewed" | "hidden", slugs: string[]) {
  const set = new Set(state.userState[key]);
  slugs.forEach((slug) => set.add(slug));
  state.userState[key] = [...set];
  return [...state.userState[key]];
}

export function saveMockNote(slug: string, note: DomainNote | null) {
  if (note) state.userState.notes[slug] = note;
  else delete state.userState.notes[slug];
  return { ...state.userState.notes };
}

export function saveMockWeights(yaml: string) {
  state.userState.activeWeightsYaml = yaml;
  return state.userState.activeWeightsYaml;
}

export function resetMockWeights() {
  state.userState.activeWeightsYaml = defaultWeightsYaml;
  return state.userState.activeWeightsYaml;
}

export function saveMockSettings(settings: SnapTldSettings) {
  state.userState.settings = {
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
  state.reportOverrides.unshift(report);
}

export function getReportOverrides() {
  return [...state.reportOverrides];
}

export function appendImportedDomains(records: RawImportedDomainRecord[]) {
  state.importedDomainOverrides.unshift(...records);
}

export function upsertImportedDomain(record: RawImportedDomainRecord) {
  const next = state.importedDomainOverrides.filter((entry) => entry.slug !== record.slug);
  next.unshift(record);
  state.importedDomainOverrides = next;
}

export function appendDomainAnalyses(records: RawDomainAnalysis[]) {
  state.domainOverrides.unshift(...records);
}

export function upsertDomainAnalysis(record: RawDomainAnalysis) {
  const next = state.domainOverrides.filter((entry) => entry.slug !== record.slug);
  next.unshift(record);
  state.domainOverrides = next;
}

export function getImportedDomainOverrides() {
  return [...state.importedDomainOverrides];
}

export function getDomainOverrides() {
  return [...state.domainOverrides];
}
