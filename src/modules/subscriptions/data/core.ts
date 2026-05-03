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

export type OwnerScope = "private" | "business" | "shared";

export interface PricePoint {
  date: string;
  amountSEK: number;
}

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
  owner?: OwnerScope;
  businessExpense?: boolean;
  reminderDaysBefore?: number;
  archived?: boolean;
  priceHistory?: PricePoint[];
}

export const categoryMeta: Record<
  SubscriptionCategory,
  { label: string; color: string }
> = {
  hosting: { label: "Hosting", color: "#6366f1" },
  saas: { label: "SaaS", color: "#3b82f6" },
  design: { label: "Design", color: "#f59e0b" },
  media: { label: "Media", color: "#ec4899" },
  dev: { label: "Verktyg", color: "#10b981" },
  security: { label: "Säkerhet", color: "#8b5cf6" },
  domain: { label: "Domäner", color: "#64748b" },
};

export const statusMeta: Record<
  SubscriptionStatus,
  { label: string; tone: "success" | "warning" | "neutral" | "danger" }
> = {
  active: { label: "Aktiv", tone: "success" },
  trial: { label: "Testperiod", tone: "warning" },
  paused: { label: "Pausad", tone: "neutral" },
  cancelled: { label: "Avslutad", tone: "danger" },
};

export const cycleLabel: Record<BillingCycle, string> = {
  monthly: "Månadsvis",
  quarterly: "Kvartalsvis",
  annual: "Årsvis",
  biannual: "Varannat år",
};

export const ownerMeta: Record<OwnerScope, { label: string; tone: "neutral" | "success" | "warning" }> = {
  private: { label: "Privat", tone: "neutral" },
  business: { label: "Företag", tone: "success" },
  shared: { label: "Delad", tone: "warning" },
};

export function advanceRenewal(dateStr: string, cycle: BillingCycle): string {
  const d = new Date(dateStr);
  switch (cycle) {
    case "monthly":
      d.setMonth(d.getMonth() + 1);
      break;
    case "quarterly":
      d.setMonth(d.getMonth() + 3);
      break;
    case "annual":
      d.setFullYear(d.getFullYear() + 1);
      break;
    case "biannual":
      d.setFullYear(d.getFullYear() + 2);
      break;
  }
  return d.toISOString().slice(0, 10);
}

export function cycleShortLabel(cycle: BillingCycle): string {
  return cycle === "monthly"
    ? "/mån"
    : cycle === "quarterly"
      ? "/kvartal"
      : cycle === "annual"
        ? "/år"
        : "/2 år";
}

export function formatSEK(amount: number): string {
  return amount.toLocaleString("sv-SE", { maximumFractionDigits: 0 }) + " kr";
}

export function toMonthly(amountSEK: number, cycle: BillingCycle): number {
  switch (cycle) {
    case "monthly":
      return amountSEK;
    case "quarterly":
      return amountSEK / 3;
    case "annual":
      return amountSEK / 12;
    case "biannual":
      return amountSEK / 24;
  }
}

const svMonths = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

export function computeCostTrend(items: Subscription[]): { label: string; value: number }[] {
  if (items.length === 0) return [];

  const now = new Date();
  const result: { label: string; value: number }[] = [];

  for (let i = 7; i >= 0; i--) {
    const y = now.getFullYear();
    const m = now.getMonth() - i;
    const monthStart = new Date(y, m, 1);
    const monthEnd = new Date(y, m + 1, 0);

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
