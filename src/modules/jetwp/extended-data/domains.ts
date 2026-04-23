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
