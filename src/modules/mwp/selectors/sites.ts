import type { Plan, SiteRecord, SiteStatus } from "@/modules/mwp/data/core";

export type SiteStatusFilter = "all" | SiteStatus | "stale" | "updates";
export type SiteSortKey = "name" | "health" | "heartbeat" | "updates" | "visits";
export type SiteSortDir = "asc" | "desc";

export interface SiteFilters {
  query: string;
  status: SiteStatusFilter;
  plan: "all" | Plan;
}

export function getFilteredSites(
  items: SiteRecord[],
  filters: SiteFilters,
  sortKey: SiteSortKey,
  sortDir: SiteSortDir,
) {
  const normalized = filters.query.trim().toLowerCase();
  const direction = sortDir === "asc" ? 1 : -1;

  return [...items]
    .filter((site) => {
      if (filters.plan !== "all" && site.plan !== filters.plan) return false;
      if (filters.status === "stale" && !site.heartbeatStale) return false;
      if (
        filters.status === "updates" &&
        site.updatesAvailable === 0 &&
        !site.wpUpdateAvailable &&
        !site.themeUpdateAvailable
      ) {
        return false;
      }
      if (
        filters.status !== "all" &&
        filters.status !== "stale" &&
        filters.status !== "updates" &&
        site.status !== filters.status
      ) {
        return false;
      }
      if (!normalized) return true;
      return (
        site.name.toLowerCase().includes(normalized) ||
        site.domain.toLowerCase().includes(normalized) ||
        site.server.toLowerCase().includes(normalized)
      );
    })
    .sort((a, b) => {
      switch (sortKey) {
        case "health":
          return (a.healthScore - b.healthScore) * direction;
        case "heartbeat":
          return ((a.heartbeatStale ? 1 : 0) - (b.heartbeatStale ? 1 : 0)) * direction;
        case "updates":
          return (a.updatesAvailable - b.updatesAvailable) * direction;
        case "visits":
          return (a.visits30d - b.visits30d) * direction;
        case "name":
        default:
          return a.name.localeCompare(b.name, "sv") * direction;
      }
    });
}

export function getSiteListStats(items: SiteRecord[]) {
  return {
    total: items.length,
    online: items.filter((site) => site.status === "online").length,
    stale: items.filter((site) => site.heartbeatStale).length,
    totalUpdates: items.reduce((sum, site) => sum + site.updatesAvailable, 0),
  };
}
