import type { InventoryItem, Alert, Job } from "@/modules/jetwp/fleet/core";
import type { SiteRecord } from "@/modules/jetwp/data/core";

export interface OverviewInventoryHighlight {
  id: string;
  label: string;
  updates: number;
  total: number;
  latestVersion: string | null;
}

export function getOverviewStats(
  sites: SiteRecord[],
  jobs: Job[],
  alerts: Alert[],
  coreInventory: InventoryItem[],
  pluginInventory: InventoryItem[],
  themeInventory: InventoryItem[],
) {
  const total = sites.length;
  const online = sites.filter((site) => site.status === "online").length;
  const offline = sites.filter((site) => site.status === "offline").length;
  const staleHeartbeats = sites.filter((site) => site.heartbeatStale).length;
  const pendingJobs = jobs.filter((job) => job.status === "pending").length;
  const runningJobs = jobs.filter((job) => job.status === "running" || job.status === "claimed").length;
  const failedJobs = jobs.filter((job) => job.status === "failed").length;
  const openAlerts = alerts.filter((alert) => alert.status === "open");
  const criticalAlerts = openAlerts.filter((alert) => alert.severity === "critical").length;
  const coreUpdates = coreInventory.reduce((sum, item) => sum + item.sitesWithUpdate, 0);
  const pluginUpdates = pluginInventory.reduce((sum, item) => sum + item.sitesWithUpdate, 0);
  const themeUpdates = themeInventory.reduce((sum, item) => sum + item.sitesWithUpdate, 0);

  return {
    total,
    online,
    offline,
    staleHeartbeats,
    pendingJobs,
    runningJobs,
    failedJobs,
    openAlerts,
    criticalAlerts,
    coreUpdates,
    pluginUpdates,
    themeUpdates,
  };
}

export function getOverviewInventoryHighlights(
  coreInventory: InventoryItem[],
  pluginInventory: InventoryItem[],
  themeInventory: InventoryItem[],
  siteTotal: number,
): OverviewInventoryHighlight[] {
  const coreHighlights =
    coreInventory.length > 0
      ? coreInventory.map((item) => ({
          id: `core-${item.slug}`,
          label: item.slug === "wordpress" ? "WordPress-kärna" : item.name,
          updates: item.sitesWithUpdate,
          total: item.installed.length,
          latestVersion: item.latestVersion || null,
        }))
      : [
          {
            id: "core-wordpress",
            label: "WordPress-kärna",
            updates: 0,
            total: siteTotal,
            latestVersion: null,
          },
        ];

  const pluginHighlights = pluginInventory
    .filter((plugin) => plugin.sitesWithUpdate > 0)
    .slice(0, 3)
    .map((plugin) => ({
      id: `plugin-${plugin.slug}`,
      label: plugin.name,
      updates: plugin.sitesWithUpdate,
      total: plugin.installed.length,
      latestVersion: plugin.latestVersion || null,
    }));

  const themeHighlights = themeInventory
    .filter((theme) => theme.sitesWithUpdate > 0)
    .slice(0, 2)
    .map((theme) => ({
      id: `theme-${theme.slug}`,
      label: `Tema · ${theme.name}`,
      updates: theme.sitesWithUpdate,
      total: theme.installed.length,
      latestVersion: theme.latestVersion || null,
    }));

  return [...coreHighlights, ...pluginHighlights, ...themeHighlights];
}
