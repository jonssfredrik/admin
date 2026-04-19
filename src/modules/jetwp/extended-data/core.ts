export interface DomainEntry {
  id: string;
  host: string;
  kind: "primary" | "alias" | "redirect";
  dnsStatus: "verified" | "pending" | "error";
  sslStatus: "active" | "renewing" | "expiring";
  redirectTo?: string;
  target?: string;
  wwwMode?: "root" | "www" | "both";
  records: { type: string; name: string; value: string; status: "ok" | "pending" | "mismatch" }[];
}

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

export interface BackupDetail {
  id: string;
  siteId: string;
  createdAt: string;
  type: "auto" | "manual";
  size: string;
  retention: string;
  location: string;
  filesIncluded: string[];
  database: { engine: string; size: string; tables: number };
  checksum: string;
}

export interface SecurityFinding {
  id: string;
  siteId: string;
  target: string;
  packageType: "plugin" | "theme" | "core";
  installedVersion: string;
  fixedVersion: string;
  severity: "low" | "medium" | "high" | "critical";
  cve: string;
  title: string;
  summary: string;
  detectedAt: string;
  status: "open" | "mitigated" | "ignored";
}

export interface NotificationChannel {
  id: string;
  name: string;
  type: "email" | "slack" | "webhook";
  target: string;
  status: "active" | "degraded";
  scope: "global" | "site";
  siteId?: string;
}

export interface NotificationRule {
  id: string;
  name: string;
  severity: ("info" | "warning" | "critical")[];
  eventTypes: string[];
  channels: string[];
  escalation: string;
  siteIds: string[];
}

export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  scope: string;
  lastUsed: string;
  createdAt: string;
}

export interface OutboundWebhook {
  id: string;
  name: string;
  event: string;
  destination: string;
  status: "active" | "paused";
  lastDelivery: string;
}

export interface PipelineIntegration {
  id: string;
  provider: string;
  project: string;
  branch: string;
  trigger: string;
  lastRun: string;
}

export interface AgentRecord {
  id: string;
  siteId: string;
  server: string;
  version: string;
  desiredVersion: string;
  status: "healthy" | "stale" | "outdated" | "pairing_required";
  configProfile: string;
  lastHeartbeat: string;
}

export interface BulkUpdatePlan {
  siteId: string;
  siteName: string;
  plugins: { name: string; current: string; next: string; changelog: string }[];
  themes: { name: string; current: string; next: string; changelog: string }[];
}

export interface StagingFlow {
  siteId: string;
  source: string;
  target: string;
  lastClone: string;
  lastPromote: string;
  diffSummary: string[];
}

export interface SiteMembership {
  siteId: string;
  members: { name: string; email: string; role: "read-only" | "deploy" | "admin"; team: string }[];
}

export interface ReportPreset {
  id: string;
  name: string;
  format: "pdf" | "csv";
  scope: string;
  generatedAt: string;
}

export const domainInventory: Record<string, DomainEntry[]> = {
  "site-1": [
    {
      id: "d1",
      host: "nordiskkaffe.se",
      kind: "primary",
      dnsStatus: "verified",
      sslStatus: "active",
      wwwMode: "root",
      records: [
        { type: "A", name: "@", value: "203.0.113.10", status: "ok" },
        { type: "CNAME", name: "www", value: "nordiskkaffe.se", status: "ok" },
      ],
    },
    {
      id: "d2",
      host: "kampanj.nordiskkaffe.se",
      kind: "alias",
      dnsStatus: "pending",
      sslStatus: "renewing",
      target: "site-1",
      records: [{ type: "CNAME", name: "kampanj", value: "edge.jetwp.io", status: "pending" }],
    },
  ],
  "site-2": [
    {
      id: "d3",
      host: "lagominterior.se",
      kind: "primary",
      dnsStatus: "verified",
      sslStatus: "expiring",
      wwwMode: "both",
      records: [
        { type: "A", name: "@", value: "203.0.113.12", status: "ok" },
        { type: "CNAME", name: "www", value: "lagominterior.se", status: "ok" },
      ],
    },
    {
      id: "d4",
      host: "shop.lagominterior.se",
      kind: "redirect",
      dnsStatus: "error",
      sslStatus: "expiring",
      redirectTo: "https://lagominterior.se/butik",
      records: [{ type: "CNAME", name: "shop", value: "old-host.example.com", status: "mismatch" }],
    },
  ],
};

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

export const backupDetails: BackupDetail[] = [
  {
    id: "b-1",
    siteId: "site-1",
    createdAt: "Idag 04:00",
    type: "auto",
    size: "842 MB",
    retention: "30 dagar",
    location: "s3://jetwp-backups/nordiskkaffe/2026-04-19-0400.tar.zst",
    filesIncluded: ["wp-content/uploads", "wp-content/plugins", "wp-content/themes", "wp-config.php"],
    database: { engine: "MariaDB 10.11", size: "186 MB", tables: 114 },
    checksum: "sha256:3adfb1f2e98c",
  },
  {
    id: "b-2",
    siteId: "site-2",
    createdAt: "Igår 04:00",
    type: "auto",
    size: "9.1 GB",
    retention: "30 dagar",
    location: "s3://jetwp-backups/lagominterior/2026-04-18-0400.tar.zst",
    filesIncluded: ["uploads", "mu-plugins", "themes", "db.sql.gz"],
    database: { engine: "MariaDB 10.11", size: "1.8 GB", tables: 202 },
    checksum: "sha256:ba11c0ffee42",
  },
];

export const securityFindings: SecurityFinding[] = [
  {
    id: "sec-1",
    siteId: "site-2",
    target: "Wordfence Security",
    packageType: "plugin",
    installedVersion: "7.11.3",
    fixedVersion: "7.11.6",
    severity: "critical",
    cve: "CVE-2026-1042",
    title: "Privilege escalation via vulnerable admin action",
    summary: "Authenticated editors can trigger unsafe option writes in older versions.",
    detectedAt: "2026-04-19 11:22",
    status: "open",
  },
  {
    id: "sec-2",
    siteId: "site-5",
    target: "Blocksy",
    packageType: "theme",
    installedVersion: "2.0.42",
    fixedVersion: "2.0.48",
    severity: "medium",
    cve: "CVE-2026-1188",
    title: "Stored XSS in custom header builder",
    summary: "Admin-side sanitization is incomplete for imported layouts.",
    detectedAt: "2026-04-19 09:02",
    status: "open",
  },
  {
    id: "sec-3",
    siteId: "site-3",
    target: "WordPress core",
    packageType: "core",
    installedVersion: "6.5.2",
    fixedVersion: "6.5.3",
    severity: "high",
    cve: "CVE-2026-1009",
    title: "CSRF in media settings",
    summary: "Patched by core update completed earlier today.",
    detectedAt: "2026-04-18 22:10",
    status: "mitigated",
  },
];

export const notificationChannels: NotificationChannel[] = [
  { id: "ch-1", name: "Ops Slack", type: "slack", target: "#jetwp-ops", status: "active", scope: "global" },
  { id: "ch-2", name: "Security Mail", type: "email", target: "security@example.se", status: "active", scope: "global" },
  { id: "ch-3", name: "Lagom Webhook", type: "webhook", target: "https://lagom.example/hooks/jetwp", status: "degraded", scope: "site", siteId: "site-2" },
];

export const notificationRules: NotificationRule[] = [
  {
    id: "nr-1",
    name: "Critical runtime alerts",
    severity: ["critical"],
    eventTypes: ["missed_heartbeat", "failed_job", "cpu.threshold"],
    channels: ["ch-1", "ch-2"],
    escalation: "Slack immediately, email after 10 min if unresolved",
    siteIds: ["site-1", "site-2", "site-3", "site-4", "site-5"],
  },
  {
    id: "nr-2",
    name: "Lagom SSL expiry",
    severity: ["warning", "critical"],
    eventTypes: ["ssl_expiring"],
    channels: ["ch-1", "ch-3"],
    escalation: "Webhook to customer portal plus Slack note",
    siteIds: ["site-2"],
  },
];

export const apiKeys: ApiKeyItem[] = [
  { id: "key-1", name: "Customer portal sync", prefix: "jwp_live_ab12", scope: "sites:read jobs:write", lastUsed: "14 min sedan", createdAt: "2026-03-02" },
  { id: "key-2", name: "Reporting export", prefix: "jwp_live_ff91", scope: "reports:read inventory:read", lastUsed: "igår", createdAt: "2026-02-12" },
];

export const outboundWebhooks: OutboundWebhook[] = [
  { id: "wh-1", name: "Job completed", event: "job.completed", destination: "https://api.example.se/jetwp/jobs", status: "active", lastDelivery: "2 min sedan" },
  { id: "wh-2", name: "Security findings", event: "security.finding.created", destination: "https://siem.example.se/events", status: "paused", lastDelivery: "för 3 dagar sedan" },
];

export const pipelineIntegrations: PipelineIntegration[] = [
  { id: "ci-1", provider: "GitHub Actions", project: "nordiskkaffe/web", branch: "main", trigger: "deploy.success", lastRun: "2026-04-19 10:14" },
  { id: "ci-2", provider: "GitLab CI", project: "lagom/interior", branch: "release", trigger: "tag.push", lastRun: "2026-04-18 18:40" },
];

export const agentRecords: AgentRecord[] = [
  { id: "ag-1", siteId: "site-1", server: "sto-web-01", version: "0.8.2", desiredVersion: "0.8.2", status: "healthy", configProfile: "standard", lastHeartbeat: "14 sek sedan" },
  { id: "ag-2", siteId: "site-2", server: "sto-web-02", version: "0.8.2", desiredVersion: "0.8.3", status: "outdated", configProfile: "debug-enabled", lastHeartbeat: "48 sek sedan" },
  { id: "ag-3", siteId: "site-5", server: "fra-web-01", version: "0.7.9", desiredVersion: "0.8.3", status: "stale", configProfile: "enterprise", lastHeartbeat: "42 min sedan" },
];

export const bulkUpdatePlans: BulkUpdatePlan[] = [
  {
    siteId: "site-2",
    siteName: "Lagom Interiör",
    plugins: [
      { name: "Wordfence", current: "7.11.3", next: "7.11.6", changelog: "Security hotfix for CVE-2026-1042" },
      { name: "Yoast SEO", current: "22.4", next: "22.7", changelog: "Improved schema output and index speed" },
    ],
    themes: [{ name: "Astra", current: "4.6.8", next: "4.7.1", changelog: "Header builder fixes and WP 6.5 support" }],
  },
  {
    siteId: "site-3",
    siteName: "Svensk Cykelklubb",
    plugins: [{ name: "WooCommerce", current: "8.8.2", next: "8.9.1", changelog: "Checkout fixes and HPOS compatibility" }],
    themes: [{ name: "GeneratePress", current: "3.4.0", next: "3.4.2", changelog: "Accessibility fixes and layout controls" }],
  },
];

export const stagingFlows: StagingFlow[] = [
  {
    siteId: "site-4",
    source: "production",
    target: "staging",
    lastClone: "2026-04-19 09:10",
    lastPromote: "2026-04-15 16:42",
    diffSummary: ["12 filer skiljer sig", "3 databas-tabeller har nytt innehåll", "PHP-version staging=8.2 prod=8.2"],
  },
  {
    siteId: "site-1",
    source: "production",
    target: "staging",
    lastClone: "2026-04-18 22:00",
    lastPromote: "2026-04-12 13:05",
    diffSummary: ["Nytt plugin-konfigcache", "4 uppladdade mediafiler", "2 nya redirect-regler"],
  },
];

export const siteMemberships: SiteMembership[] = [
  {
    siteId: "site-1",
    members: [
      { name: "Fredrik Jonsson", email: "fredrik@example.se", role: "admin", team: "Ops" },
      { name: "Astrid L.", email: "astrid@example.se", role: "deploy", team: "Delivery" },
      { name: "Olof P.", email: "olof@example.se", role: "read-only", team: "Support" },
    ],
  },
  {
    siteId: "site-2",
    members: [
      { name: "Fredrik Jonsson", email: "fredrik@example.se", role: "admin", team: "Ops" },
      { name: "Greta T.", email: "greta@example.se", role: "deploy", team: "Customer success" },
    ],
  },
];

export const reportPresets: ReportPreset[] = [
  { id: "rp-1", name: "Månadsrapport kund", format: "pdf", scope: "Per sajt", generatedAt: "2026-04-18 08:00" },
  { id: "rp-2", name: "Inventory-export", format: "csv", scope: "Hela flottan", generatedAt: "2026-04-19 07:30" },
];

export const fleetRegions = [
  { name: "Stockholm", sites: 3, healthy: 2, warning: 1 },
  { name: "Goteborg", sites: 1, healthy: 1, warning: 0 },
  { name: "Frankfurt", sites: 1, healthy: 0, warning: 1 },
];

export const fleetHealthTrend = Array.from({ length: 14 }, (_, index) => ({
  label: `${index + 1}`,
  value: 82 + Math.round(Math.sin(index / 2) * 8 + (index > 9 ? -4 : 0)),
}));

export const nodeThresholdAlerts = [
  { node: "sto-web-02", metric: "CPU", threshold: "75%", action: "Skapa alert + Slack" },
  { node: "sto-web-02", metric: "Disk", threshold: "85%", action: "Skapa alert + blockera nya deploys" },
  { node: "fra-web-01", metric: "Heartbeat loss", threshold: "120s", action: "Eskalera till on-call" },
];
