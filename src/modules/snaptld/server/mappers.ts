import { defaultWeightsYaml } from "@/modules/snaptld/data/weights";
import type {
  FeedSchedule,
  FeedSource,
  RawFeedSource,
  SnapTldSettings,
  SnapTldUserState,
} from "@/modules/snaptld/types";

function normalizeDateTime(value: string) {
  if (!value.trim()) return "";
  return value.includes("T") ? value : `${value.replace(" ", "T")}:00`;
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
