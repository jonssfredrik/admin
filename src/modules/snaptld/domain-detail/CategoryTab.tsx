import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ScoreBar, BigScoreRing } from "@/modules/snaptld/components/ScoreBar";
import { SignalList } from "@/modules/snaptld/components/SignalList";
import {
  categoryMeta,
  type AnalysisCategory,
  type CategoryResult,
} from "@/modules/snaptld/data/core";
import { StepCardHeader } from "./StepCardHeader";

interface Props {
  category: AnalysisCategory;
  result: CategoryResult;
  weight: number;
  onRun: () => void;
  isRunning?: boolean;
}

export function CategoryTab({ category, result, weight, onRun, isRunning }: Props) {
  const meta = categoryMeta[category];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <div className="flex flex-col items-center gap-4 py-3">
          <BigScoreRing score={result.score} maxScore={result.scoreMax} />
          <div className="text-center">
            <div className="text-sm font-semibold">{meta.label}</div>
            <div className="mt-0.5 text-xs text-muted">Vikt {weight}% av total</div>
          </div>
        </div>
      </Card>

      <Card className="lg:col-span-2 space-y-4">
        <StepCardHeader
          title="Signaler"
          description={meta.description}
          actionLabel={`Kör ${meta.label}`}
          onRun={onRun}
          running={isRunning}
        />
        <SignalList signals={result.signals} />
        {result.verdict && (
          <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-fg/10 bg-fg/5 p-3.5 text-sm">
            <Sparkles size={14} className="mt-0.5 shrink-0 text-fg/70" />
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted">AI-utlåtande</div>
              <p className="mt-1 leading-relaxed">{result.verdict}</p>
            </div>
          </div>
        )}
        {result.subAnalyses && result.subAnalyses.length > 0 && (
          <div className="border-t pt-4">
            <div className="mb-2 text-xs font-medium">Subanalyser</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {result.subAnalyses.map((item) => (
                <div key={item.id} className="rounded-lg border bg-bg/30 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium">{item.label}</span>
                    <span className="font-mono text-[11px] tabular-nums text-muted">
                      {item.score}/{item.maxScore}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-muted">
                    {item.status === "complete" ? "KÃ¶rd" : item.reason ?? "Ej kÃ¶rd"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="border-t pt-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium">Poäng</span>
            <span className="font-mono tabular-nums text-muted">{result.score} / {result.scoreMax ?? 100}</span>
          </div>
          <ScoreBar score={result.score} maxScore={result.scoreMax} thick />
        </div>
      </Card>
    </div>
  );
}
