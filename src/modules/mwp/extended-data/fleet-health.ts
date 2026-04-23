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
