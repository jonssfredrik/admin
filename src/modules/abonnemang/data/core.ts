export type BillingCycle = "monthly" | "quarterly" | "annual" | "biannual";
export type SubscriptionStatus = "active" | "trial" | "paused" | "cancelled";
export type SubscriptionCategory =
  | "hosting"
  | "saas"
  | "design"
  | "media"
  | "dev"
  | "security"
  | "domain";

export interface Subscription {
  id: string;
  name: string;
  description: string;
  category: SubscriptionCategory;
  status: SubscriptionStatus;
  amountSEK: number;
  billingCycle: BillingCycle;
  startedAt: string;
  nextRenewal: string;
  cancelledAt?: string;
  website?: string;
  notes?: string;
}

export const categoryMeta: Record<
  SubscriptionCategory,
  { label: string; color: string }
> = {
  hosting: { label: "Hosting",   color: "#6366f1" },
  saas:    { label: "SaaS",      color: "#3b82f6" },
  design:  { label: "Design",    color: "#f59e0b" },
  media:   { label: "Media",     color: "#ec4899" },
  dev:     { label: "Verktyg",   color: "#10b981" },
  security:{ label: "Säkerhet",  color: "#8b5cf6" },
  domain:  { label: "Domäner",   color: "#64748b" },
};

export const statusMeta: Record<
  SubscriptionStatus,
  { label: string; tone: "success" | "warning" | "neutral" | "danger" }
> = {
  active:    { label: "Aktiv",    tone: "success" },
  trial:     { label: "Testperiod", tone: "warning" },
  paused:    { label: "Pausad",   tone: "neutral" },
  cancelled: { label: "Avslutad", tone: "danger" },
};

export const cycleLabel: Record<BillingCycle, string> = {
  monthly:  "Månadsvis",
  quarterly:"Kvartalsvis",
  annual:   "Årsvis",
  biannual: "Varannat år",
};

export function toMonthly(amountSEK: number, cycle: BillingCycle): number {
  switch (cycle) {
    case "monthly":  return amountSEK;
    case "quarterly":return amountSEK / 3;
    case "annual":   return amountSEK / 12;
    case "biannual": return amountSEK / 24;
  }
}

export const defaultSubscriptions: Subscription[] = [
  {
    id: "sub-1",
    name: "Hetzner Cloud",
    description: "VPS och dedikerade servrar",
    category: "hosting",
    status: "active",
    amountSEK: 220,
    billingCycle: "monthly",
    startedAt: "2023-09-01",
    nextRenewal: "2026-05-01",
    website: "https://hetzner.com",
  },
  {
    id: "sub-2",
    name: "Vercel Pro",
    description: "Frontend-deployment och edge-nätverk",
    category: "hosting",
    status: "active",
    amountSEK: 210,
    billingCycle: "monthly",
    startedAt: "2024-01-15",
    nextRenewal: "2026-04-28",
    website: "https://vercel.com",
  },
  {
    id: "sub-3",
    name: "Cloudflare Pro",
    description: "CDN, DDoS-skydd och DNS",
    category: "hosting",
    status: "active",
    amountSEK: 210,
    billingCycle: "monthly",
    startedAt: "2023-11-01",
    nextRenewal: "2026-05-15",
    website: "https://cloudflare.com",
  },
  {
    id: "sub-4",
    name: "DigitalOcean",
    description: "Droplets och managed databases",
    category: "hosting",
    status: "active",
    amountSEK: 125,
    billingCycle: "monthly",
    startedAt: "2024-03-01",
    nextRenewal: "2026-05-05",
    website: "https://digitalocean.com",
  },
  {
    id: "sub-5",
    name: "Linear",
    description: "Projekthantering och issue-tracker",
    category: "saas",
    status: "active",
    amountSEK: 84,
    billingCycle: "monthly",
    startedAt: "2024-06-01",
    nextRenewal: "2026-05-08",
    website: "https://linear.app",
  },
  {
    id: "sub-6",
    name: "Notion",
    description: "Docs, wiki och databaser",
    category: "saas",
    status: "active",
    amountSEK: 84,
    billingCycle: "monthly",
    startedAt: "2023-08-01",
    nextRenewal: "2026-04-25",
    website: "https://notion.so",
  },
  {
    id: "sub-7",
    name: "Plausible Analytics",
    description: "Integritetsvänlig webbanalys",
    category: "saas",
    status: "active",
    amountSEK: 95,
    billingCycle: "monthly",
    startedAt: "2024-02-01",
    nextRenewal: "2026-05-03",
    website: "https://plausible.io",
  },
  {
    id: "sub-8",
    name: "Figma",
    description: "UI-design och prototyping",
    category: "design",
    status: "trial",
    amountSEK: 170,
    billingCycle: "monthly",
    startedAt: "2026-03-28",
    nextRenewal: "2026-04-28",
    website: "https://figma.com",
    notes: "Testperiod slutar 28 april — beslut krävs",
  },
  {
    id: "sub-9",
    name: "Adobe Creative Cloud",
    description: "Photoshop, Illustrator, Premiere m.fl.",
    category: "design",
    status: "paused",
    amountSEK: 599,
    billingCycle: "monthly",
    startedAt: "2022-01-01",
    nextRenewal: "2026-07-01",
    website: "https://adobe.com",
    notes: "Pausad — utvärderar alternativ",
  },
  {
    id: "sub-10",
    name: "Spotify Premium",
    description: "Musikstreaming",
    category: "media",
    status: "active",
    amountSEK: 119,
    billingCycle: "monthly",
    startedAt: "2020-04-01",
    nextRenewal: "2026-04-23",
    website: "https://spotify.com",
  },
  {
    id: "sub-11",
    name: "Netflix Standard",
    description: "Videostreaming, 2 skärmar",
    category: "media",
    status: "active",
    amountSEK: 169,
    billingCycle: "monthly",
    startedAt: "2021-09-01",
    nextRenewal: "2026-04-30",
    website: "https://netflix.com",
  },
  {
    id: "sub-12",
    name: "GitHub Copilot",
    description: "AI-kodassistent",
    category: "dev",
    status: "active",
    amountSEK: 105,
    billingCycle: "monthly",
    startedAt: "2024-05-01",
    nextRenewal: "2026-05-19",
    website: "https://github.com",
  },
  {
    id: "sub-13",
    name: "1Password",
    description: "Lösenordshanterare",
    category: "security",
    status: "active",
    amountSEK: 32,
    billingCycle: "monthly",
    startedAt: "2023-01-01",
    nextRenewal: "2026-05-14",
    website: "https://1password.com",
  },
  {
    id: "sub-14",
    name: "nordiskkaffe.se",
    description: "Domänregistrering",
    category: "domain",
    status: "active",
    amountSEK: 149,
    billingCycle: "annual",
    startedAt: "2022-03-15",
    nextRenewal: "2027-03-15",
    notes: "Registrerad via Loopia",
  },
  {
    id: "sub-15",
    name: "nordbyte.se",
    description: "Domänregistrering",
    category: "domain",
    status: "active",
    amountSEK: 149,
    billingCycle: "annual",
    startedAt: "2023-11-22",
    nextRenewal: "2026-11-22",
    notes: "Registrerad via Namecheap",
  },
];

const svMonths = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

export function computeCostTrend(items: Subscription[]): { label: string; value: number }[] {
  const now = new Date();
  const result: { label: string; value: number }[] = [];

  for (let i = 7; i >= 0; i--) {
    const y = now.getFullYear();
    const m = now.getMonth() - i;
    const monthStart = new Date(y, m, 1);
    const monthEnd   = new Date(y, m + 1, 0);

    const value = items
      .filter((s) => {
        if (new Date(s.startedAt) > monthEnd) return false;
        if (s.status === "cancelled" && s.cancelledAt) {
          return new Date(s.cancelledAt) > monthStart;
        }
        return true;
      })
      .reduce((sum, s) => sum + toMonthly(s.amountSEK, s.billingCycle), 0);

    result.push({ label: svMonths[((m % 12) + 12) % 12], value: Math.round(value) });
  }

  return result;
}
