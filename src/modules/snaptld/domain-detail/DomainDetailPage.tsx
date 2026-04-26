"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { DomainDetailHeader } from "./DomainDetailHeader";
import { RegisterActions, AuctionNotice } from "@/modules/snaptld/components/RegisterActions";
import { OverviewTab } from "./OverviewTab";
import { CategoryTab } from "./CategoryTab";
import { SeoTab } from "./SeoTab";
import { HistoryTab } from "./HistoryTab";
import { useToast } from "@/components/toast/ToastProvider";
import { getCategoryWeightMap, parseWeightsConfig } from "@/modules/snaptld/selectors/weights";
import { useAsyncAction } from "@/modules/snaptld/lib/useAsyncAction";
import { rerunAnalysisAction } from "@/modules/snaptld/actions";
import { SnapTldUserStateProvider } from "@/modules/snaptld/client/SnapTldUserStateProvider";
import type { DomainAnalysis, SnapTldUserState } from "@/modules/snaptld/types";

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

const stepLabels: Record<TabId, string> = {
  overview: "översikt",
  structure: "struktur",
  lexical: "lexikal analys",
  brand: "varumärkesanalys",
  market: "marknadsanalys",
  risk: "riskanalys",
  salability: "säljbarhetsanalys",
  seo: "SEO",
  history: "historik",
};

function isTabId(value: string | null): value is TabId {
  return value !== null && tabs.some((tab) => tab.id === value);
}

export default function DomainDetailPage({
  domain,
  domains,
  activeWeightsYaml,
  initialUserState,
}: {
  domain: DomainAnalysis;
  domains: DomainAnalysis[];
  activeWeightsYaml: string;
  initialUserState: SnapTldUserState;
}) {
  return (
    <SnapTldUserStateProvider initialState={initialUserState}>
      <DomainDetailPageContent domain={domain} domains={domains} activeWeightsYaml={activeWeightsYaml} />
    </SnapTldUserStateProvider>
  );
}

function DomainDetailPageContent({
  domain,
  domains,
  activeWeightsYaml,
}: {
  domain: DomainAnalysis;
  domains: DomainAnalysis[];
  activeWeightsYaml: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const rerunAction = useAsyncAction();
  const activeWeightsConfig = parseWeightsConfig(activeWeightsYaml);
  const categoryWeights = getCategoryWeightMap(activeWeightsConfig);
  const requestedTab = searchParams.get("tab");
  const [tab, setTab] = useState<TabId>(isTabId(requestedTab) ? requestedTab : "overview");
  const [runningStep, setRunningStep] = useState<TabId | null>(null);

  useEffect(() => {
    setTab(isTabId(requestedTab) ? requestedTab : "overview");
  }, [requestedTab]);

  const runStep = async (step: TabId) => {
    if (rerunAction.isPending) return;

    setRunningStep(step);
    toast.info("Analyssteg körs", `${stepLabels[step]} för ${domain.domain}`);

    try {
      await rerunAction.run(() => rerunAnalysisAction(domain.slug, step));
      router.refresh();
      toast.success("Analyssteg klart", `${stepLabels[step]} uppdaterad för ${domain.domain}`);
    } catch {
      toast.error("Analyssteg misslyckades", `${stepLabels[step]} kunde inte köras för ${domain.domain}`);
    } finally {
      setRunningStep(null);
    }
  };

  const selectTab = (nextTab: TabId) => {
    setTab(nextTab);
    const nextParams = new URLSearchParams(searchParams.toString());
    if (nextTab === "overview") nextParams.delete("tab");
    else nextParams.set("tab", nextTab);
    const query = nextParams.toString();
    router.replace(query ? `/snaptld/${domain.slug}?${query}` : `/snaptld/${domain.slug}`);
  };

  return (
    <div className="space-y-6">
      <DomainDetailHeader domain={domain} onRerun={() => void runStep("overview")} />

      <AuctionNotice domain={domain} />

      <RegisterActions domain={domain} />

      <div className="flex gap-1 overflow-x-auto overflow-y-hidden border-b">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => selectTab(id)}
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

      {tab === "overview" && (
        <OverviewTab
          domain={domain}
          domains={domains}
          weightsConfig={activeWeightsConfig}
          onRun={() => void runStep("overview")}
          isRunning={runningStep === "overview"}
        />
      )}
      {tab === "seo" && (
        <SeoTab
          domain={domain}
          onRun={() => void runStep("seo")}
          isRunning={runningStep === "seo"}
        />
      )}
      {tab === "history" && (
        <HistoryTab
          domain={domain}
          onRun={() => void runStep("history")}
          isRunning={runningStep === "history"}
        />
      )}
      {(tab === "structure" || tab === "lexical" || tab === "brand" || tab === "market" || tab === "risk" || tab === "salability") && (
        <CategoryTab
          category={tab}
          result={domain.categories[tab]}
          weight={categoryWeights[tab]}
          onRun={() => void runStep(tab)}
          isRunning={runningStep === tab}
        />
      )}
    </div>
  );
}
