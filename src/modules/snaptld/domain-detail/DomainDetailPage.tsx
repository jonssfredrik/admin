"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import {
  Briefcase,
  LayoutDashboard,
  ListChecks,
  ShieldAlert,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Type,
  History as HistoryIcon,
} from "lucide-react";
import clsx from "clsx";
import { domainAnalyses } from "@/modules/snaptld/data/core";
import { DomainDetailHeader } from "./DomainDetailHeader";
import { RegisterActions, AuctionNotice } from "@/modules/snaptld/components/RegisterActions";
import { OverviewTab } from "./OverviewTab";
import { CategoryTab } from "./CategoryTab";
import { SeoTab } from "./SeoTab";
import { HistoryTab } from "./HistoryTab";

type TabId =
  | "overview"
  | "structure"
  | "lexical"
  | "brand"
  | "market"
  | "risk"
  | "salability"
  | "seo"
  | "history";

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Översikt", icon: LayoutDashboard },
  { id: "structure", label: "Struktur", icon: ListChecks },
  { id: "lexical", label: "Lexikal", icon: Type },
  { id: "brand", label: "Varumärke", icon: Sparkles },
  { id: "market", label: "Marknad", icon: Briefcase },
  { id: "risk", label: "Risk", icon: ShieldAlert },
  { id: "salability", label: "Säljbarhet", icon: ShoppingCart },
  { id: "seo", label: "SEO", icon: TrendingUp },
  { id: "history", label: "Historik", icon: HistoryIcon },
];

export default function DomainDetailPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain: slug } = use(params);
  const domain = domainAnalyses.find((d) => d.slug === slug);
  const [tab, setTab] = useState<TabId>("overview");

  if (!domain) notFound();

  return (
    <div className="space-y-6">
      <DomainDetailHeader domain={domain} />

      <AuctionNotice domain={domain} />

      <RegisterActions domain={domain} />

      <div className="flex gap-1 overflow-x-auto overflow-y-hidden border-b">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={clsx(
              "relative flex shrink-0 items-center gap-1.5 px-3 py-2 text-sm transition-colors",
              tab === id ? "font-medium text-fg" : "text-muted hover:text-fg",
            )}
          >
            <Icon size={14} />
            {label}
            {tab === id && <span className="absolute inset-x-2 -bottom-px h-px bg-fg" />}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab domain={domain} />}
      {tab === "seo" && <SeoTab domain={domain} />}
      {tab === "history" && <HistoryTab domain={domain} />}
      {(tab === "structure" || tab === "lexical" || tab === "brand" || tab === "market" || tab === "risk" || tab === "salability") && (
        <CategoryTab category={tab} result={domain.categories[tab]} />
      )}
    </div>
  );
}
