import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { Card } from "./Card";

interface Props {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
}

export function StatCard({ label, value, delta, hint }: Props) {
  const up = (delta ?? 0) >= 0;
  return (
    <Card className="p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
        {typeof delta === "number" && (
          <div
            className={clsx(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
              up ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400",
            )}
          >
            {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(delta)}%
          </div>
        )}
      </div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </Card>
  );
}
