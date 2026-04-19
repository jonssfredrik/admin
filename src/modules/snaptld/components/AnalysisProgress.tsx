import clsx from "clsx";
import { Check, Loader2 } from "lucide-react";
import { categoryMeta, type AnalysisCategory } from "@/modules/snaptld/data/core";

const order: AnalysisCategory[] = [
  "structure",
  "lexical",
  "brand",
  "market",
  "risk",
  "salability",
  "seo",
  "history",
];

interface Props {
  completed: number;
}

export function AnalysisProgress({ completed }: Props) {
  const total = order.length;
  const pct = Math.round((completed / total) * 100);
  return (
    <div className="space-y-3 rounded-xl border bg-surface p-4">
      <div className="flex items-center justify-between text-sm">
        <div className="font-medium">Analys pågår</div>
        <div className="font-mono tabular-nums text-muted">
          {completed}/{total} steg · {pct}%
        </div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-fg/5">
        <div className="h-full rounded-full bg-fg transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {order.map((key, i) => {
          const done = i < completed;
          const active = i === completed;
          return (
            <div
              key={key}
              className={clsx(
                "flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs",
                done && "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
                active && "border-fg/20 bg-fg/5",
                !done && !active && "text-muted",
              )}
            >
              {done ? (
                <Check size={12} />
              ) : active ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <span className="h-3 w-3 shrink-0 rounded-full border" />
              )}
              <span className="truncate">{categoryMeta[key].label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
