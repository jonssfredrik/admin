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

export const agentRecords: AgentRecord[] = [
  { id: "ag-1", siteId: "site-1", server: "sto-web-01", version: "0.8.2", desiredVersion: "0.8.2", status: "healthy", configProfile: "standard", lastHeartbeat: "14 sek sedan" },
  { id: "ag-2", siteId: "site-2", server: "sto-web-02", version: "0.8.2", desiredVersion: "0.8.3", status: "outdated", configProfile: "debug-enabled", lastHeartbeat: "48 sek sedan" },
  { id: "ag-3", siteId: "site-5", server: "fra-web-01", version: "0.7.9", desiredVersion: "0.8.3", status: "stale", configProfile: "enterprise", lastHeartbeat: "42 min sedan" },
];
