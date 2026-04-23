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
