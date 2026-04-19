import { Activity, Clock3, FolderArchive, Layers3 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge, Table, Td, Th } from "@/components/ui/Table";
import { conversionHistoryBatches } from "@/modules/file-converter/data";
import { conversionTools } from "@/modules/file-converter/config";

const statusTone = {
  completed: "success",
  running: "warning",
  partial: "danger",
} as const;

const statusLabel = {
  completed: "Klar",
  running: "Körs",
  partial: "Delvis klar",
} as const;

export function FileConverterHistoryPage() {
  const completed = conversionHistoryBatches.filter((batch) => batch.status === "completed").length;
  const running = conversionHistoryBatches.filter((batch) => batch.status === "running").length;
  const filesProcessed = conversionHistoryBatches.reduce((sum, batch) => sum + batch.completedFiles, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Historik"
        subtitle="Överblick över tidigare batchkörningar, resultat och vilka konverteringsverktyg som användes."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Batcher totalt" value={String(conversionHistoryBatches.length)} hint="Visar senaste körningarna." />
        <StatCard label="Slutförda" value={String(completed)} hint="Helt färdiga batcher." />
        <StatCard label="Aktiva" value={String(running)} hint="Körningar som fortfarande pågår." />
        <StatCard label="Filer processade" value={String(filesProcessed)} hint="Summerad output från batchhistoriken." />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Table>
          <thead>
            <tr>
              <Th>Batch</Th>
              <Th>Status</Th>
              <Th>Start</Th>
              <Th>Körning</Th>
              <Th className="text-right">Progress</Th>
            </tr>
          </thead>
          <tbody>
            {conversionHistoryBatches.map((batch) => (
              <tr key={batch.id} className="transition-colors hover:bg-bg/50">
                <Td>
                  <div className="font-medium">{batch.label}</div>
                  <div className="mt-1 text-xs text-muted">{batch.outputSummary}</div>
                </Td>
                <Td>
                  <Badge tone={statusTone[batch.status]}>{statusLabel[batch.status]}</Badge>
                </Td>
                <Td className="font-mono text-xs text-muted">
                  {new Date(batch.startedAt).toLocaleString("sv-SE", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Td>
                <Td>{batch.runtimeLabel}</Td>
                <Td className="text-right font-medium">
                  {batch.completedFiles}/{batch.totalFiles}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <Activity size={15} />
              Operativ lägesbild
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl border bg-bg/40 p-3">
                <div className="font-medium">Vad den här sidan är till för</div>
                <div className="mt-1 text-muted">
                  Historikvyn är tänkt för revision, återblick och framtida exportlogik när fler arbetsflöden kopplas in.
                </div>
              </div>
              <div className="rounded-xl border bg-bg/40 p-3">
                <div className="font-medium">Nästa naturliga steg</div>
                <div className="mt-1 text-muted">
                  Batchfilter, retry-flöden och drilldown per batch med individuell jobblogg.
                </div>
              </div>
            </div>
          </Card>

          {conversionHistoryBatches.map((batch) => (
            <Card key={batch.id} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold tracking-tight">{batch.label}</div>
                  <div className="mt-1 text-xs text-muted">{batch.id}</div>
                </div>
                <Badge tone={statusTone[batch.status]}>{statusLabel[batch.status]}</Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border bg-bg/40 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted">
                    <FolderArchive size={13} />
                    Output
                  </div>
                  <div className="mt-2 text-sm font-medium">{batch.outputSummary}</div>
                </div>
                <div className="rounded-xl border bg-bg/40 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted">
                    <Clock3 size={13} />
                    Körtid
                  </div>
                  <div className="mt-2 text-sm font-medium">{batch.runtimeLabel}</div>
                </div>
                <div className="rounded-xl border bg-bg/40 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted">
                    <Layers3 size={13} />
                    Verktyg
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {batch.topToolIds.map((toolId) => (
                      <span key={toolId} className="rounded-full border bg-surface px-2 py-1 text-xs">
                        {conversionTools.find((tool) => tool.id === toolId)?.title ?? toolId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
