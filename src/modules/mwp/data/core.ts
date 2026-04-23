export type SiteStatus = "online" | "maintenance" | "warning" | "offline";
export type Plan = "Starter" | "Business" | "Scale" | "Enterprise";

export interface Site {
  id: string;
  name: string;
  domain: string;
  plan: Plan;
  wp: string;
  wpLatest: string;
  wpUpdateAvailable: boolean;
  php: string;
  visits30d: number;
  storageGB: number;
  storageLimitGB: number;
  sslDays: number;
  lastBackup: string;
  updatesAvailable: number;
  environment: "production" | "staging";
  activeTheme: string;
  themeVersion: string;
  themeUpdateAvailable: boolean;
  screenshot: string;
  server: string;
  wpPath: string;
}

export interface SiteRuntime {
  siteId: string;
  agentVersion: string;
  lastHeartbeat: string;
  heartbeatStale: boolean;
  pendingJobs: number;
  failingJobs: number;
  cpuPct: number;
  ramPct: number;
  diskIoPct: number;
  bandwidthPct: number;
}

export interface SiteHealthSnapshot {
  siteId: string;
  status: SiteStatus;
  healthScore: number;
  securityUpdates: number;
}

export interface SiteRecord extends Site, SiteRuntime, Omit<SiteHealthSnapshot, "siteId"> {}

const siteInventory: Site[] = [
  {
    id: "site-1",
    name: "Nordisk Kaffebryggeri",
    domain: "nordiskkaffe.se",
    plan: "Business",
    wp: "6.5.3",
    php: "8.2",
    visits30d: 128432,
    storageGB: 4.2,
    storageLimitGB: 20,
    sslDays: 72,
    lastBackup: "2 tim sedan",
    updatesAvailable: 0,
    environment: "production",
    activeTheme: "Kadence",
    themeVersion: "1.1.14",
    themeUpdateAvailable: false,
    screenshot: "linear-gradient(135deg, #78350f 0%, #b45309 45%, #fbbf24 100%)",
    wpLatest: "6.5.3",
    wpUpdateAvailable: false,
    server: "sto-web-01",
    wpPath: "/var/www/nordiskkaffe/public",
  },
  {
    id: "site-2",
    name: "Lagom Interiör",
    domain: "lagominterior.se",
    plan: "Starter",
    wp: "6.4.2",
    php: "8.1",
    visits30d: 42810,
    storageGB: 9.1,
    storageLimitGB: 10,
    sslDays: 12,
    lastBackup: "igår 03:12",
    updatesAvailable: 7,
    environment: "production",
    activeTheme: "Astra",
    themeVersion: "4.6.8",
    themeUpdateAvailable: true,
    screenshot: "linear-gradient(135deg, #fde68a 0%, #fca5a5 50%, #c4b5fd 100%)",
    wpLatest: "6.5.3",
    wpUpdateAvailable: true,
    server: "sto-web-02",
    wpPath: "/var/www/lagom/public",
  },
  {
    id: "site-3",
    name: "Svensk Cykelklubb",
    domain: "svenskcykel.se",
    plan: "Scale",
    wp: "6.5.3",
    php: "8.3",
    visits30d: 284940,
    storageGB: 18.4,
    storageLimitGB: 50,
    sslDays: 184,
    lastBackup: "1 tim sedan",
    updatesAvailable: 2,
    environment: "production",
    activeTheme: "GeneratePress",
    themeVersion: "3.4.0",
    themeUpdateAvailable: true,
    screenshot: "linear-gradient(135deg, #064e3b 0%, #10b981 50%, #0ea5e9 100%)",
    wpLatest: "6.5.3",
    wpUpdateAvailable: false,
    server: "got-web-01",
    wpPath: "/var/www/svenskcykel/public",
  },
  {
    id: "site-4",
    name: "Fjällkliniken",
    domain: "fjallkliniken.se",
    plan: "Business",
    wp: "6.5.3",
    php: "8.2",
    visits30d: 18230,
    storageGB: 2.8,
    storageLimitGB: 20,
    sslDays: 98,
    lastBackup: "30 min sedan",
    updatesAvailable: 0,
    environment: "staging",
    activeTheme: "Twenty Twenty-Four",
    themeVersion: "1.2",
    themeUpdateAvailable: false,
    screenshot: "linear-gradient(135deg, #0f172a 0%, #334155 50%, #94a3b8 100%)",
    wpLatest: "6.5.3",
    wpUpdateAvailable: false,
    server: "sto-web-01",
    wpPath: "/var/www/fjallkliniken-staging/public",
  },
  {
    id: "site-5",
    name: "Arctic Outdoor Co.",
    domain: "arcticoutdoor.com",
    plan: "Enterprise",
    wp: "6.5.3",
    php: "8.3",
    visits30d: 491200,
    storageGB: 42.1,
    storageLimitGB: 100,
    sslDays: 245,
    lastBackup: "6 tim sedan",
    updatesAvailable: 3,
    environment: "production",
    activeTheme: "Blocksy",
    themeVersion: "2.0.42",
    themeUpdateAvailable: true,
    screenshot: "linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 55%, #e0f2fe 100%)",
    wpLatest: "6.5.3",
    wpUpdateAvailable: false,
    server: "fra-web-01",
    wpPath: "/var/www/arctic/public",
  },
];

const siteRuntimeList: SiteRuntime[] = [
  {
    siteId: "site-1",
    agentVersion: "0.8.2",
    lastHeartbeat: "14 sek sedan",
    heartbeatStale: false,
    pendingJobs: 0,
    failingJobs: 0,
    cpuPct: 18,
    ramPct: 52,
    diskIoPct: 12,
    bandwidthPct: 35,
  },
  {
    siteId: "site-2",
    agentVersion: "0.8.2",
    lastHeartbeat: "48 sek sedan",
    heartbeatStale: false,
    pendingJobs: 2,
    failingJobs: 1,
    cpuPct: 64,
    ramPct: 78,
    diskIoPct: 45,
    bandwidthPct: 72,
  },
  {
    siteId: "site-3",
    agentVersion: "0.8.2",
    lastHeartbeat: "22 sek sedan",
    heartbeatStale: false,
    pendingJobs: 1,
    failingJobs: 0,
    cpuPct: 41,
    ramPct: 61,
    diskIoPct: 28,
    bandwidthPct: 58,
  },
  {
    siteId: "site-4",
    agentVersion: "0.8.1",
    lastHeartbeat: "3 min sedan",
    heartbeatStale: false,
    pendingJobs: 0,
    failingJobs: 0,
    cpuPct: 8,
    ramPct: 34,
    diskIoPct: 6,
    bandwidthPct: 15,
  },
  {
    siteId: "site-5",
    agentVersion: "0.7.9",
    lastHeartbeat: "42 min sedan",
    heartbeatStale: true,
    pendingJobs: 3,
    failingJobs: 2,
    cpuPct: 0,
    ramPct: 0,
    diskIoPct: 0,
    bandwidthPct: 0,
  },
];

const siteHealthList: SiteHealthSnapshot[] = [
  { siteId: "site-1", status: "online", healthScore: 98, securityUpdates: 0 },
  { siteId: "site-2", status: "warning", healthScore: 74, securityUpdates: 2 },
  { siteId: "site-3", status: "online", healthScore: 92, securityUpdates: 0 },
  { siteId: "site-4", status: "maintenance", healthScore: 88, securityUpdates: 0 },
  { siteId: "site-5", status: "offline", healthScore: 42, securityUpdates: 1 },
];

function toMap<T extends { siteId: string }>(items: T[]) {
  return Object.fromEntries(items.map((item) => [item.siteId, item])) as Record<string, T>;
}

export const siteCatalog = siteInventory;
export const siteRuntimes = siteRuntimeList;
export const siteHealthSnapshots = siteHealthList;
export const siteRuntimeById = toMap(siteRuntimeList);
export const siteHealthById = toMap(siteHealthList);

export const sites: SiteRecord[] = siteInventory.map((site) => ({
  ...site,
  ...siteRuntimeById[site.id],
  ...siteHealthById[site.id],
}));

export function getSiteRecord(siteId: string) {
  return sites.find((site) => site.id === siteId);
}
