import clsx from "clsx";
import { AlertTriangle, Check, Info, X } from "lucide-react";
import type { Signal, Tone } from "@/modules/snaptld/data/core";

const toneMeta: Record<Tone, { icon: typeof Check; color: string }> = {
  success: { icon: Check, color: "text-emerald-600 dark:text-emerald-400" },
  warning: { icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400" },
  danger: { icon: X, color: "text-red-600 dark:text-red-400" },
  neutral: { icon: Info, color: "text-muted" },
};

export function SignalList({ signals }: { signals: Signal[] }) {
  if (!signals.length) {
    return <div className="text-xs text-muted">Inga signaler registrerade.</div>;
  }
  return (
    <ul className="space-y-2">
      {signals.map((s, i) => {
        const { icon: Icon, color } = toneMeta[s.tone];
        return (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <Icon size={14} className={clsx("mt-0.5 shrink-0", color)} />
            <div className="flex-1">
              <span className="font-medium">{s.label}</span>
              <span className="mx-1.5 text-muted">·</span>
              <span className="text-muted">{s.value}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
