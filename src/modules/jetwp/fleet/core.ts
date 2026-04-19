import { sites } from "@/modules/jetwp/data/core";

export type JobStatus = "pending" | "claimed" | "running" | "completed" | "failed" | "cancelled";
export type JobType =
  | "core.update"
  | "plugin.update"
  | "theme.update"
  | "plugin.install"
  | "backup.create"
  | "backup.restore"
  | "cache.flush"
  | "db.optimize"
  | "integrity.check"
  | "rollback"
  | "ssl.renew"
  | "agent.upgrade";

export type JobPriority = "low" | "normal" | "high" | "urgent";

export interface Job {
  id: string;
  siteId: string;
  type: JobType;
  status: JobStatus;
  priority: JobPriority;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  duration?: string;
  attempts: number;
  maxAttempts: number;
  createdBy: string;
  strategy: "immediate" | "serial" | "canary" | "scheduled";
  params?: { label: string; value: string }[];
  output?: string;
  error?: string;
  workflow?: { id: string; name: string; step: number };
}

const jobTypeLabel: Record<JobType, string> = {
  "core.update": "WP-kärnuppdatering",
  "plugin.update": "Plugin-uppdatering",
  "theme.update": "Tema-uppdatering",
  "plugin.install": "Installera plugin",
  "backup.create": "Skapa backup",
  "backup.restore": "Återställ backup",
  "cache.flush": "Rensa cache",
  "db.optimize": "Optimera databas",
  "integrity.check": "Integritetskontroll",
  rollback: "Rollback",
  "ssl.renew": "Förnya SSL",
  "agent.upgrade": "Uppgradera agent",
};

export const JOB_TYPE_LABEL = jobTypeLabel;

export const jobs: Job[] = [
  {
    id: "job-1045",
    siteId: "site-5",
    type: "plugin.update",
    status: "failed",
    priority: "high",
    createdAt: "14:22:08",
    startedAt: "14:22:11",
    finishedAt: "14:27:42",
    duration: "5m 31s",
    attempts: 3,
    maxAttempts: 3,
    createdBy: "workflow:plugin-updates",
    strategy: "canary",
    params: [{ label: "Plugins", value: "woocommerce, elementor" }],
    error: "Fatal error i wp-content/plugins/elementor after update - rollback triggered",
    workflow: { id: "plugin-updates", name: "Auto-uppdatering av plugins", step: 4 },
  },
  {
    id: "job-1044",
    siteId: "site-2",
    type: "integrity.check",
    status: "running",
    priority: "normal",
    createdAt: "14:20:01",
    startedAt: "14:20:03",
    attempts: 1,
    maxAttempts: 2,
    createdBy: "workflow:security-scan",
    strategy: "serial",
    params: [{ label: "Omfattning", value: "full" }],
    workflow: { id: "security-scan", name: "Säkerhetsskanning varje natt", step: 2 },
  },
  {
    id: "job-1043",
    siteId: "site-5",
    type: "backup.create",
    status: "running",
    priority: "urgent",
    createdAt: "14:18:34",
    startedAt: "14:18:36",
    attempts: 1,
    maxAttempts: 2,
    createdBy: "Fredrik",
    strategy: "immediate",
    params: [{ label: "Typ", value: "full" }, { label: "Retention", value: "7 dagar" }],
  },
  {
    id: "job-1042",
    siteId: "site-3",
    type: "cache.flush",
    status: "completed",
    priority: "normal",
    createdAt: "14:12:44",
    startedAt: "14:12:45",
    finishedAt: "14:12:51",
    duration: "6s",
    attempts: 1,
    maxAttempts: 2,
    createdBy: "Olof P.",
    strategy: "immediate",
  },
  {
    id: "job-1041",
    siteId: "site-3",
    type: "theme.update",
    status: "claimed",
    priority: "normal",
    createdAt: "14:10:02",
    attempts: 0,
    maxAttempts: 2,
    createdBy: "Fredrik",
    strategy: "immediate",
    params: [{ label: "Tema", value: "GeneratePress" }, { label: "Till version", value: "3.4.2" }],
  },
  {
    id: "job-1040",
    siteId: "site-1",
    type: "backup.create",
    status: "completed",
    priority: "normal",
    createdAt: "14:00:00",
    startedAt: "14:00:02",
    finishedAt: "14:04:18",
    duration: "4m 16s",
    attempts: 1,
    maxAttempts: 2,
    createdBy: "cron:nightly-backup",
    strategy: "scheduled",
  },
  {
    id: "job-1039",
    siteId: "site-2",
    type: "plugin.update",
    status: "pending",
    priority: "high",
    createdAt: "13:58:11",
    attempts: 0,
    maxAttempts: 3,
    createdBy: "Fredrik",
    strategy: "canary",
    params: [{ label: "Plugins", value: "wordfence, yoast" }],
  },
  {
    id: "job-1038",
    siteId: "site-4",
    type: "db.optimize",
    status: "completed",
    priority: "low",
    createdAt: "13:42:55",
    startedAt: "13:42:58",
    finishedAt: "13:44:11",
    duration: "1m 13s",
    attempts: 1,
    maxAttempts: 2,
    createdBy: "Astrid L.",
    strategy: "immediate",
  },
  {
    id: "job-1037",
    siteId: "site-5",
    type: "ssl.renew",
    status: "cancelled",
    priority: "normal",
    createdAt: "13:21:08",
    finishedAt: "13:21:22",
    attempts: 0,
    maxAttempts: 2,
    createdBy: "Greta T.",
    strategy: "immediate",
    output: "Avbruten manuellt - väntar på DNS-propagering",
  },
  {
    id: "job-1036",
    siteId: "site-3",
    type: "agent.upgrade",
    status: "completed",
    priority: "low",
    createdAt: "12:00:01",
    startedAt: "12:00:04",
    finishedAt: "12:01:44",
    duration: "1m 40s",
    attempts: 1,
    maxAttempts: 2,
    createdBy: "system",
    strategy: "serial",
    params: [{ label: "Till version", value: "0.8.2" }],
  },
  {
    id: "job-1035",
    siteId: "site-2",
    type: "core.update",
    status: "pending",
    priority: "urgent",
    createdAt: "11:48:22",
    attempts: 0,
    maxAttempts: 2,
    createdBy: "Fredrik",
    strategy: "canary",
    params: [{ label: "Från", value: "6.4.2" }, { label: "Till", value: "6.5.3" }],
  },
  {
    id: "job-1034",
    siteId: "site-1",
    type: "cache.flush",
    status: "completed",
    priority: "low",
    createdAt: "11:12:00",
    startedAt: "11:12:01",
    finishedAt: "11:12:04",
    duration: "3s",
    attempts: 1,
    maxAttempts: 2,
    createdBy: "Olof P.",
    strategy: "immediate",
  },
];

export const jobsForSite = (siteId: string) => jobs.filter((j) => j.siteId === siteId);

export const jobTypes: { value: JobType; label: string; description: string; paramFields?: { name: string; label: string; placeholder?: string; kind?: "text" | "select"; options?: string[] }[] }[] = [
  { value: "core.update", label: "Uppdatera WP-kärna", description: "Uppgradera WordPress till senaste version", paramFields: [{ name: "targetVersion", label: "Målversion", placeholder: "t.ex. 6.5.3" }] },
  { value: "plugin.update", label: "Uppdatera plugin", description: "Uppdatera ett eller flera plugins", paramFields: [{ name: "plugins", label: "Plugins (komma-separerade)", placeholder: "yoast, wordfence" }] },
  { value: "theme.update", label: "Uppdatera tema", description: "Uppdatera aktivt tema till ny version", paramFields: [{ name: "theme", label: "Tema-slug", placeholder: "kadence" }] },
  { value: "plugin.install", label: "Installera plugin", description: "Installera från WP.org eller ZIP", paramFields: [{ name: "slug", label: "Slug eller ZIP-url", placeholder: "akismet" }] },
  { value: "backup.create", label: "Skapa backup", description: "Full eller inkrementell backup", paramFields: [{ name: "type", label: "Typ", kind: "select", options: ["full", "inkrementell"] }, { name: "retention", label: "Retention (dagar)", placeholder: "30" }] },
  { value: "backup.restore", label: "Återställ backup", description: "Rulla tillbaka till ett tidigare tillstånd", paramFields: [{ name: "backupId", label: "Backup-id", placeholder: "b-123" }] },
  { value: "cache.flush", label: "Rensa cache", description: "Töm object- och page-cache" },
  { value: "db.optimize", label: "Optimera databas", description: "Kör OPTIMIZE TABLE + cleanup" },
  { value: "integrity.check", label: "Integritetskontroll", description: "Verifiera kärnfiler och checksums" },
  { value: "rollback", label: "Rollback", description: "Återställ från senaste backup" },
  { value: "ssl.renew", label: "Förnya SSL", description: "Kör Let's Encrypt-förnyelse" },
  { value: "agent.upgrade", label: "Uppgradera agent", description: "Uppgradera jetwp-agent på sajten", paramFields: [{ name: "targetVersion", label: "Målversion", placeholder: "0.8.2" }] },
];

export type AlertSeverity = "info" | "warning" | "critical";
export type AlertKind = "missed_heartbeat" | "failed_job" | "stale_telemetry" | "security_update" | "disk_space" | "ssl_expiring";
export type AlertStatus = "open" | "acked" | "resolved";

export interface Alert {
  id: string;
  kind: AlertKind;
  severity: AlertSeverity;
  status: AlertStatus;
  siteId?: string;
  title: string;
  description: string;
  createdAt: string;
  source: string;
}

export const alerts: Alert[] = [
  { id: "al-1", kind: "missed_heartbeat", severity: "critical", status: "open", siteId: "site-5", title: "Missad heartbeat - arcticoutdoor.com", description: "Agenten har inte rapporterat in sedan 13:38. Förväntas var 30:e sekund.", createdAt: "för 42 min sedan", source: "jetwp-agent" },
  { id: "al-2", kind: "failed_job", severity: "critical", status: "open", siteId: "site-5", title: "Plugin-uppdatering misslyckades (3/3 försök)", description: "job-1045 · elementor → fatal error efter update. Rollback kördes automatiskt.", createdAt: "för 15 min sedan", source: "jobs" },
  { id: "al-3", kind: "ssl_expiring", severity: "warning", status: "open", siteId: "site-2", title: "SSL går ut om 12 dagar", description: "lagominterior.se · certbot-förnyelse fastnade i DNS-verifiering.", createdAt: "för 3 tim sedan", source: "monitoring" },
  { id: "al-4", kind: "security_update", severity: "warning", status: "open", siteId: "site-2", title: "Kritisk säkerhetsuppdatering tillgänglig", description: "Wordfence 7.11.6 innehåller fix för CVE-2026-1042. 2 sajter påverkade.", createdAt: "för 5 tim sedan", source: "inventory" },
  { id: "al-5", kind: "stale_telemetry", severity: "warning", status: "acked", siteId: "site-5", title: "Stale telemetry > 30 min", description: "Senaste telemetri från arcticoutdoor.com är 42 min gammal.", createdAt: "för 1 tim sedan", source: "jetwp-agent" },
  { id: "al-6", kind: "disk_space", severity: "warning", status: "open", siteId: "site-2", title: "Disk > 90% full", description: "lagominterior.se · 9.1/10 GB i bruk. Överväg att rensa media eller uppgradera plan.", createdAt: "för 2 tim sedan", source: "monitoring" },
  { id: "al-7", kind: "failed_job", severity: "info", status: "resolved", siteId: "site-5", title: "SSL-förnyelse avbruten", description: "job-1037 avbröts manuellt av Greta T.", createdAt: "för 4 tim sedan", source: "jobs" },
  { id: "al-8", kind: "missed_heartbeat", severity: "info", status: "resolved", siteId: "site-4", title: "Heartbeat återupptagen", description: "fjallkliniken.se är tillbaka efter planerat underhåll.", createdAt: "igår", source: "jetwp-agent" },
];

export interface InventoryItem {
  slug: string;
  name: string;
  installed: { siteId: string; version: string; active?: boolean; updateAvailable?: boolean }[];
  latestVersion: string;
  sitesWithUpdate: number;
}

export const coreInventory: InventoryItem[] = [
  {
    slug: "wordpress",
    name: "WordPress Core",
    latestVersion: "6.5.3",
    sitesWithUpdate: sites.filter((s) => s.wpUpdateAvailable).length,
    installed: sites.map((s) => ({ siteId: s.id, version: s.wp, updateAvailable: s.wpUpdateAvailable })),
  },
];

export const pluginInventory: InventoryItem[] = [
  { slug: "wordpress-seo", name: "Yoast SEO", latestVersion: "22.7", sitesWithUpdate: 3, installed: [
    { siteId: "site-1", version: "22.7", active: true },
    { siteId: "site-2", version: "22.4", active: true, updateAvailable: true },
    { siteId: "site-3", version: "22.5", active: true, updateAvailable: true },
    { siteId: "site-5", version: "22.4", active: true, updateAvailable: true },
  ]},
  { slug: "woocommerce", name: "WooCommerce", latestVersion: "8.9.1", sitesWithUpdate: 2, installed: [
    { siteId: "site-1", version: "8.9.1", active: true },
    { siteId: "site-3", version: "8.8.2", active: true, updateAvailable: true },
    { siteId: "site-5", version: "8.8.2", active: true, updateAvailable: true },
  ]},
  { slug: "wordfence", name: "Wordfence Security", latestVersion: "7.11.6", sitesWithUpdate: 2, installed: [
    { siteId: "site-1", version: "7.11.6", active: true },
    { siteId: "site-2", version: "7.11.3", active: true, updateAvailable: true },
    { siteId: "site-3", version: "7.11.6", active: true },
    { siteId: "site-5", version: "7.11.3", active: true, updateAvailable: true },
  ]},
  { slug: "elementor", name: "Elementor", latestVersion: "3.21.0", sitesWithUpdate: 0, installed: [
    { siteId: "site-2", version: "3.21.0", active: true },
    { siteId: "site-5", version: "3.21.0", active: true },
  ]},
  { slug: "wp-rocket", name: "WP Rocket", latestVersion: "3.15.10", sitesWithUpdate: 0, installed: [
    { siteId: "site-1", version: "3.15.10", active: true },
    { siteId: "site-3", version: "3.15.10", active: true },
  ]},
  { slug: "updraftplus", name: "UpdraftPlus", latestVersion: "1.24.5", sitesWithUpdate: 1, installed: [
    { siteId: "site-2", version: "1.24.4", active: false, updateAvailable: true },
    { siteId: "site-4", version: "1.24.5", active: true },
  ]},
];

export const themeInventory: InventoryItem[] = [
  { slug: "kadence", name: "Kadence", latestVersion: "1.1.14", sitesWithUpdate: 0, installed: [
    { siteId: "site-1", version: "1.1.14", active: true },
  ]},
  { slug: "astra", name: "Astra", latestVersion: "4.7.1", sitesWithUpdate: 1, installed: [
    { siteId: "site-2", version: "4.6.8", active: true, updateAvailable: true },
  ]},
  { slug: "generatepress", name: "GeneratePress", latestVersion: "3.4.2", sitesWithUpdate: 1, installed: [
    { siteId: "site-3", version: "3.4.0", active: true, updateAvailable: true },
  ]},
  { slug: "twentytwentyfour", name: "Twenty Twenty-Four", latestVersion: "1.2", sitesWithUpdate: 0, installed: [
    { siteId: "site-4", version: "1.2", active: true },
  ]},
  { slug: "blocksy", name: "Blocksy", latestVersion: "2.0.48", sitesWithUpdate: 1, installed: [
    { siteId: "site-5", version: "2.0.42", active: true, updateAvailable: true },
  ]},
];

export const siteName = (id: string) => sites.find((s) => s.id === id)?.name ?? id;
export const siteDomain = (id: string) => sites.find((s) => s.id === id)?.domain ?? id;
