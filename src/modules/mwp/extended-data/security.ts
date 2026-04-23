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
