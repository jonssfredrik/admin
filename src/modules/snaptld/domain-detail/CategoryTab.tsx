import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ScoreBar, BigScoreRing } from "@/modules/snaptld/components/ScoreBar";
import { SignalList } from "@/modules/snaptld/components/SignalList";
import {
  categoryMeta,
  type AnalysisCategory,
  type CategoryResult,
} from "@/modules/snaptld/data/core";

interface Props {
  category: AnalysisCategory;
  result: CategoryResult;
}

export function CategoryTab({ category, result }: Props) {
  const meta = categoryMeta[category];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <div className="flex flex-col items-center gap-4 py-3">
          <BigScoreRing score={result.score} />
          <div className="text-center">
            <div className="text-sm font-semibold">{meta.label}</div>
            <div className="mt-0.5 text-xs text-muted">Vikt {result.weight}% av total</div>
          </div>
        </div>
      </Card>

      <Card className="lg:col-span-2 space-y-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Signaler</h2>
          <p className="text-xs text-muted">{meta.description}</p>
        </div>
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
        <div className="border-t pt-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium">Poäng</span>
            <span className="font-mono tabular-nums text-muted">{result.score} / 100</span>
          </div>
          <ScoreBar score={result.score} thick />
        </div>
      </Card>
    </div>
  );
}
