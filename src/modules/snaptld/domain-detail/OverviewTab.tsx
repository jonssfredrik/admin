import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ScoreBreakdown } from "@/modules/snaptld/components/ScoreBreakdown";
import { NotesCard } from "@/modules/snaptld/components/NotesCard";
import { SimilarDomains } from "@/modules/snaptld/components/SimilarDomains";
import { DonutChart } from "@/components/charts/DonutChart";
import type { DomainAnalysis } from "@/modules/snaptld/data/core";
import { categoryMeta, type AnalysisCategory } from "@/modules/snaptld/data/core";
import { StepCardHeader } from "./StepCardHeader";
import { getCategoryWeightMap } from "@/modules/snaptld/selectors/weights";
import type { WeightsConfig } from "@/modules/snaptld/types";

const donutColor = (score: number): string => {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
};

export function OverviewTab({
  domain,
  onRun,
  isRunning,
  weightsConfig,
}: {
  domain: DomainAnalysis;
  onRun: () => void;
  isRunning?: boolean;
  weightsConfig: WeightsConfig;
}) {
  const categoryWeights = getCategoryWeightMap(weightsConfig);
  const donut = (Object.keys(categoryMeta) as AnalysisCategory[]).map((key) => ({
    label: categoryMeta[key].label,
    value: categoryWeights[key],
    color: donutColor(domain.categories[key].score),
  }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <StepCardHeader
          title="Kategoripoäng"
          description="Klicka för att se signaler per kategori eller kör om sammanställningen för fliken."
          actionLabel="Kör översikt"
          onRun={onRun}
          running={isRunning}
        />
        <div className="mt-4">
          <ScoreBreakdown categories={domain.categories} weights={categoryWeights} />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold tracking-tight">Viktfördelning</h2>
        <p className="text-xs text-muted">Färg = poäng, storlek = vikt</p>
        <div className="mt-6">
          <DonutChart data={donut} size={140} />
        </div>
      </Card>

      <Card className="lg:col-span-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-fg/5">
            <Sparkles size={16} className="text-fg/70" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-tight">AI-övergripande utlåtande</h2>
              <span className="rounded-md bg-fg/5 px-1.5 py-0.5 font-mono text-[10px] text-muted">gpt-5.4</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-fg/90">{domain.aiSummary}</p>
          </div>
        </div>
      </Card>

      <div className="lg:col-span-2">
        <SimilarDomains domain={domain} />
      </div>

      <NotesCard slug={domain.slug} domain={domain.domain} />
    </div>
  );
}
