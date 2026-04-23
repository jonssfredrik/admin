import type { SiteRecord } from "@/modules/jetwp/data/core";
import type { Alert, AlertSeverity } from "@/modules/jetwp/fleet/core";

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
  unresolvedAlerts: SiteOverviewAlert[];
}

export interface SiteOverviewAlert {
  id: string;
  severity: Extract<AlertSeverity, "critical" | "warning">;
  title: string;
  description: string;
  createdAt: string;
  source: string;
}

export function getSiteOverviewModel(site: SiteRecord, alerts: Alert[] = []): SiteOverviewModel {
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
    unresolvedAlerts: getSiteOverviewAlerts(site.id, alerts),
  };
}

export function getSiteOverviewAlerts(siteId: string, alerts: Alert[]): SiteOverviewAlert[] {
  return alerts
    .filter((alert): alert is Alert & { severity: SiteOverviewAlert["severity"] } =>
      alert.siteId === siteId &&
      alert.status !== "resolved" &&
      isBlockingAlertSeverity(alert.severity)
    )
    .map((alert) => ({
      id: alert.id,
      severity: alert.severity,
      title: alert.title,
      description: alert.description,
      createdAt: alert.createdAt,
      source: alert.source,
    }));
}

function isBlockingAlertSeverity(severity: AlertSeverity): severity is SiteOverviewAlert["severity"] {
  return severity === "critical" || severity === "warning";
}
