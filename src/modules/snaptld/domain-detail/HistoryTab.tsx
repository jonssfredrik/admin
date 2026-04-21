import { AlertTriangle, Clock, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Table";
import { SignalList } from "@/modules/snaptld/components/SignalList";
import type { DomainAnalysis } from "@/modules/snaptld/data/core";
import { StepCardHeader } from "./StepCardHeader";

export function HistoryTab({
  domain,
  onRun,
  isRunning,
}: {
  domain: DomainAnalysis;
  onRun: () => void;
  isRunning?: boolean;
}) {
  const { wayback } = domain;
  const cat = domain.categories.history;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1 space-y-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Wayback Machine</h2>
          <p className="text-xs text-muted">Historik från arkivet</p>
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-xs text-muted">Snapshots</dt>
            <dd className="font-semibold tabular-nums">{wayback.snapshots}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-muted">Första sett</dt>
            <dd className="font-mono text-xs">{wayback.firstSeen}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-muted">Senaste sett</dt>
            <dd className="font-mono text-xs">{wayback.lastSeen}</dd>
          </div>
        </dl>
        <a
          href={`https://web.archive.org/web/*/${domain.domain}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline"
        >
          <ExternalLink size={12} />
          Öppna i Wayback Machine
        </a>
      </Card>

      <Card className="lg:col-span-2 space-y-4">
        <StepCardHeader
          title="Historik-flaggor"
          description="Identifierade problem i tidigare innehåll"
          actionLabel="Kör historik"
          onRun={onRun}
          running={isRunning}
        />
        {wayback.flags.length === 0 ? (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-700 dark:text-emerald-400">
            Inga flaggor. Tidigare innehåll verkar rent.
          </div>
        ) : (
          <ul className="space-y-2">
            {wayback.flags.map((f) => (
              <li key={f} className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <AlertTriangle size={14} className="shrink-0 text-amber-600 dark:text-amber-400" />
                <span className="flex-1 text-sm font-medium">{f}</span>
                <Badge tone="warning">Granska</Badge>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t pt-4">
          <div className="mb-3 flex items-center gap-1.5 text-xs font-medium">
            <Clock size={12} />
            Signaler
          </div>
          <SignalList signals={cat.signals} />
        </div>
      </Card>
    </div>
  );
}
