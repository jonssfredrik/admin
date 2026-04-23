import type { InventoryItem, Alert, Job } from "@/modules/mwp/fleet/core";
import type { SiteRecord } from "@/modules/mwp/data/core";

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
