import type { SiteRecord } from "@/modules/mwp/data/core";

export const siteDetailTabs = [
  "overview",
  "plugins",
  "themes",
  "domains",
  "logs",
  "settings",
] as const;

export type SiteDetailTabId = (typeof siteDetailTabs)[number];

export function isSiteDetailTab(value: string | null): value is SiteDetailTabId {
  return value !== null && siteDetailTabs.some((tab) => tab === value);
}

export interface SiteOverviewModel {
  visits30d: number;
  updatesAvailable: number;
  storageGB: number;
  storageLimitGB: number;
  storagePct: number;
  status: SiteRecord["status"];
  sslDays: number;
  lastHeartbeat: string;
  heartbeatStale: boolean;
  securityUpdates: number;
  cpuPct: number;
  ramPct: number;
  diskIoPct: number;
  bandwidthPct: number;
}

export function getSiteOverviewModel(site: SiteRecord): SiteOverviewModel {
  return {
    visits30d: site.visits30d,
    updatesAvailable: site.updatesAvailable,
    storageGB: site.storageGB,
    storageLimitGB: site.storageLimitGB,
    storagePct: (site.storageGB / site.storageLimitGB) * 100,
    status: site.status,
    sslDays: site.sslDays,
    lastHeartbeat: site.lastHeartbeat,
    heartbeatStale: site.heartbeatStale,
    securityUpdates: site.securityUpdates,
    cpuPct: site.cpuPct,
    ramPct: site.ramPct,
    diskIoPct: site.diskIoPct,
    bandwidthPct: site.bandwidthPct,
  };
}
