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

export const apiKeys: ApiKeyItem[] = [
  { id: "key-1", name: "Customer portal sync", prefix: "jwp_live_ab12", scope: "sites:read jobs:write", lastUsed: "14 min sedan", createdAt: "2026-03-02" },
  { id: "key-2", name: "Reporting export", prefix: "jwp_live_ff91", scope: "reports:read inventory:read", lastUsed: "igår", createdAt: "2026-02-12" },
];

export const outboundWebhooks: OutboundWebhook[] = [
  { id: "wh-1", name: "Job completed", event: "job.completed", destination: "https://api.example.se/mwp/jobs", status: "active", lastDelivery: "2 min sedan" },
  { id: "wh-2", name: "Security findings", event: "security.finding.created", destination: "https://siem.example.se/events", status: "paused", lastDelivery: "för 3 dagar sedan" },
];

export const pipelineIntegrations: PipelineIntegration[] = [
  { id: "ci-1", provider: "GitHub Actions", project: "nordiskkaffe/web", branch: "main", trigger: "deploy.success", lastRun: "2026-04-19 10:14" },
  { id: "ci-2", provider: "GitLab CI", project: "lagom/interior", branch: "release", trigger: "tag.push", lastRun: "2026-04-18 18:40" },
];
