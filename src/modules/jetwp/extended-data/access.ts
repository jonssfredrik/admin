export interface SiteMembership {
  siteId: string;
  members: { name: string; email: string; role: "read-only" | "deploy" | "admin"; team: string }[];
}

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
