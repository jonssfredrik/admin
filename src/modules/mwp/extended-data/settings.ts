export interface SiteRuntimeSettings {
  maintenanceMode: boolean;
  wpCronMode: "wp-cron" | "system-cron";
  cronExpression: string;
  debugMode: boolean;
  debugLog: boolean;
  pageCache: boolean;
  objectCache: boolean;
  edgeCacheTtl: string;
  wpConfig: { key: string; value: string; masked?: boolean }[];
}

export const siteSettings: Record<string, SiteRuntimeSettings> = {
  "site-1": {
    maintenanceMode: false,
    wpCronMode: "system-cron",
    cronExpression: "*/5 * * * *",
    debugMode: false,
    debugLog: false,
    pageCache: true,
    objectCache: true,
    edgeCacheTtl: "30m",
    wpConfig: [
      { key: "WP_ENVIRONMENT_TYPE", value: "production" },
      { key: "DISABLE_WP_CRON", value: "true" },
      { key: "WP_DEBUG", value: "false" },
      { key: "WP_CACHE", value: "true" },
      { key: "AUTH_KEY", value: "••••••••••••", masked: true },
    ],
  },
  "site-2": {
    maintenanceMode: true,
    wpCronMode: "wp-cron",
    cronExpression: "every request",
    debugMode: true,
    debugLog: true,
    pageCache: true,
    objectCache: false,
    edgeCacheTtl: "10m",
    wpConfig: [
      { key: "WP_ENVIRONMENT_TYPE", value: "production" },
      { key: "WP_DEBUG", value: "true" },
      { key: "WP_DEBUG_LOG", value: "true" },
      { key: "JETWP_AGENT_TOKEN", value: "••••••••••••", masked: true },
    ],
  },
};
