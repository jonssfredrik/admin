"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock3,
  FolderArchive,
  Layers3,
  Search,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { Badge, Table, Td, Th } from "@/components/ui/Table";
import { conversionHistoryBatches } from "@/modules/file-converter/data";
import { conversionHistoryDetails } from "@/modules/file-converter/data/history-details";
import { conversionTools, formatBytes, formatDuration, formatLabel } from "@/modules/file-converter/config";
import { useConversionQueueEngine } from "@/modules/file-converter/lib/activity";
import type { ConversionHistoryBatch, ConversionHistoryItem } from "@/modules/file-converter/types";

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

const itemStatusTone = {
  completed: "success",
  running: "warning",
  queued: "neutral",
  paused: "warning",
  canceled: "danger",
} as const;

const itemStatusLabel = {
  completed: "Klar",
  running: "Körs",
  queued: "I kö",
  paused: "Pausad",
  canceled: "Avbruten",
} as const;

type SortKey = "startedAt" | "label" | "progress";
type SortDir = "asc" | "desc";

interface BatchView extends ConversionHistoryBatch {
  source: "live" | "mock";
  items: ConversionHistoryItem[];
  issueSummary?: string;
}

export function FileConverterHistoryPage() {
  const activity = useConversionQueueEngine();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ConversionHistoryBatch["status"] | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("startedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  const runtimeBatches = useMemo<BatchView[]>(() => {
    const grouped = new Map<string, typeof activity.queueItems>();
    activity.queueItems.forEach((item) => {
      const current = grouped.get(item.batchId) ?? [];
      current.push(item);
      grouped.set(item.batchId, current);
    });

    return Array.from(grouped.entries()).map(([batchId, items]) => {
      const createdAt = Math.min(...items.map((item) => item.createdAt));
      const completedFiles = items.filter((item) => item.status === "completed").length;
      const activeItems = items.filter(
        (item) => item.status === "queued" || item.status === "running" || item.status === "paused",
      );
      const canceledItems = items.filter((item) => item.status === "canceled");
      const outputCounts = items
        .filter((item) => item.status === "completed")
        .reduce<Record<string, number>>((acc, item) => {
          const tool = conversionTools.find((entry) => entry.id === item.toolId);
          const key = tool ? formatLabel(tool.outputFormat) : "Okänd";
          acc[key] = (acc[key] ?? 0) + 1;
          return acc;
        }, {});

      const outputSummary =
        Object.keys(outputCounts).length > 0
          ? Object.entries(outputCounts)
              .map(([format, count]) => `${count} ${format}`)
              .join(", ")
          : canceledItems.length > 0
            ? `${canceledItems.length} avbrutna`
            : "Ingen output ännu";

      const latestCompleted = Math.max(...items.map((item) => item.completedAt ?? item.createdAt));
      const status: ConversionHistoryBatch["status"] =
        activeItems.length > 0 ? "running" : canceledItems.length > 0 ? "partial" : "completed";
      const issueSummary =
        canceledItems.length > 0
          ? `${canceledItems.length} filer stoppades i batchen och kan behöva köras om.`
          : activeItems.length > 0
            ? `${activeItems.length} filer är fortfarande aktiva i batchen.`
            : undefined;

      return {
        id: batchId,
        label: items[0]?.batchLabel ?? items[0]?.presetName ?? `Live-batch ${batchId.slice(-6)}`,
        startedAt: new Date(createdAt).toISOString(),
        totalFiles: items.length,
        completedFiles,
        runtimeLabel:
          activeItems.length > 0
            ? "Kör fortfarande"
            : formatDuration(Math.max(1000, latestCompleted - createdAt)),
        status,
        outputSummary,
        topToolIds: Array.from(new Set(items.map((item) => item.toolId))).slice(0, 3),
        presetId: items[0]?.presetId,
        presetName: items[0]?.presetName,
        source: "live",
        issueSummary,
        items: items.map((item) => ({
          id: item.id,
          fileName: item.fileName,
          resultName: item.resultName,
          toolId: item.toolId,
          sourceFormat: item.sourceFormat,
          status: item.status,
          progress: item.progress,
          size: item.size,
          durationMs:
            item.completedAt && item.startedAt ? Math.max(1000, item.completedAt - item.startedAt) : undefined,
          note:
            item.status === "canceled"
              ? "Jobbet avbröts i den aktiva kön."
              : item.status === "paused"
                ? "Jobbet är pausat och väntar på återupptagning."
                : undefined,
        })),
      };
    });
  }, [activity.queueItems]);

  const mockBatches = useMemo<BatchView[]>(
    () =>
      conversionHistoryBatches.map((batch) => ({
        ...batch,
        source: "mock",
        items: conversionHistoryDetails[batch.id]?.items ?? [],
        issueSummary: conversionHistoryDetails[batch.id]?.issueSummary,
      })),
    [],
  );

  const allBatches = useMemo<BatchView[]>(
    () =>
      [...runtimeBatches, ...mockBatches].sort(
        (left, right) => new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime(),
      ),
    [mockBatches, runtimeBatches],
  );

  const filteredBatches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const base = allBatches.filter((batch) => {
      if (statusFilter !== "all" && batch.status !== statusFilter) return false;
      if (!normalized) return true;
      return [batch.label, batch.id, batch.outputSummary]
        .concat(batch.presetName ?? "")
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });

    const direction = sortDir === "asc" ? 1 : -1;
    return [...base].sort((left, right) => {
      if (sortKey === "label") return left.label.localeCompare(right.label) * direction;
      if (sortKey === "progress") {
        const leftRatio = left.totalFiles === 0 ? 0 : left.completedFiles / left.totalFiles;
        const rightRatio = right.totalFiles === 0 ? 0 : right.completedFiles / right.totalFiles;
        return (leftRatio - rightRatio) * direction;
      }
      return (new Date(left.startedAt).getTime() - new Date(right.startedAt).getTime()) * direction;
    });
  }, [allBatches, query, sortDir, sortKey, statusFilter]);

  const selectedBatch = filteredBatches.find((batch) => batch.id === selectedBatchId) ?? allBatches.find((batch) => batch.id === selectedBatchId) ?? null;
  const completed = allBatches.filter((batch) => batch.status === "completed").length;
  const running = allBatches.filter((batch) => batch.status === "running").length;
  const partial = allBatches.filter((batch) => batch.status === "partial").length;
  const filesProcessed = allBatches.reduce((sum, batch) => sum + batch.completedFiles, 0);

  function toggleSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextKey);
    setSortDir(nextKey === "label" ? "asc" : "desc");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Historik"
        subtitle="Följ tidigare batcher, se vad som blev klart och fånga upp körningar som behöver åtgärdas."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Batcher totalt" value={String(allBatches.length)} hint="Visar både live-batcher och tidigare körningar." />
        <StatCard label="Slutförda" value={String(completed)} hint="Helt färdiga batcher." />
        <StatCard label="Aktiva" value={String(running)} hint="Körningar som fortfarande pågår." />
        <StatCard label="Filer processade" value={String(filesProcessed)} hint={partial > 0 ? `${partial} batcher kräver uppföljning` : "Ingen batch kräver uppföljning just nu."} />
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sök batchnamn, id eller output..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1 rounded-lg border bg-surface p-1">
              {[
                { id: "all", label: "Alla" },
                { id: "running", label: "Körs" },
                { id: "partial", label: "Delvis klara" },
                { id: "completed", label: "Klara" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setStatusFilter(filter.id as ConversionHistoryBatch["status"] | "all")}
                  className={clsx(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    statusFilter === filter.id ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
                setSortKey("startedAt");
                setSortDir("desc");
              }}
            >
              Rensa
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted">{filteredBatches.length} batcher matchar filtren.</div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Table>
          <thead>
            <tr>
              <SortableTh active={sortKey === "label"} dir={sortDir} onClick={() => toggleSort("label")}>
                Batch
              </SortableTh>
              <Th>Status</Th>
              <SortableTh active={sortKey === "startedAt"} dir={sortDir} onClick={() => toggleSort("startedAt")}>
                Start
              </SortableTh>
              <Th>Körning</Th>
              <SortableTh className="text-right" active={sortKey === "progress"} dir={sortDir} onClick={() => toggleSort("progress")}>
                Progress
              </SortableTh>
            </tr>
          </thead>
          <tbody>
            {filteredBatches.length === 0 && (
              <tr>
                <Td colSpan={5} className="py-10 text-center text-sm text-muted">
                  Ingen batch matchar filtren.
                </Td>
              </tr>
            )}
            {filteredBatches.map((batch) => (
              <tr
                key={batch.id}
                className={clsx(
                  "cursor-pointer transition-colors hover:bg-bg/50",
                  selectedBatch?.id === batch.id && "bg-fg/[0.03]",
                )}
                onClick={() => setSelectedBatchId(batch.id)}
              >
                <Td>
                  <div className="font-medium">{batch.label}</div>
                  {batch.presetName && <div className="mt-1 text-xs text-muted">Preset: {batch.presetName}</div>}
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
                <Td className="text-right">
                  <div className="font-medium">
                    {batch.completedFiles}/{batch.totalFiles}
                  </div>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedBatchId(batch.id);
                    }}
                    className="mt-1 text-xs text-muted transition-colors hover:text-fg"
                  >
                    Visa detaljer
                  </button>
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
                <div className="font-medium">Arbeta direkt från historiken</div>
                <div className="mt-1 text-muted">
                  Filtrera batcher, sortera listan och öppna drilldown för att se exakt vilka filer som blev klara, fastnade eller avbröts.
                </div>
              </div>
              <div className="rounded-xl border bg-bg/40 p-3">
                <div className="font-medium">Delvis klara batcher</div>
                <div className="mt-1 text-muted">
                  {partial > 0
                    ? `${partial} batcher innehåller stoppade filer. Öppna batchen för att se vilka underlag som behöver köras om.`
                    : "Inga batcher är delvis klara just nu."}
                </div>
              </div>
            </div>
          </Card>

          {filteredBatches.map((batch) => {
            const canceledItems = batch.items.filter((item) => item.status === "canceled");
            const activeItems = batch.items.filter(
              (item) => item.status === "queued" || item.status === "running" || item.status === "paused",
            );

            return (
              <Card key={batch.id} className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold tracking-tight">{batch.label}</div>
                    <div className="mt-1 text-xs text-muted">
                      {batch.id}
                      {batch.presetName ? ` • ${batch.presetName}` : ""}
                    </div>
                  </div>
                  <Badge tone={statusTone[batch.status]}>{statusLabel[batch.status]}</Badge>
                </div>

                {(batch.issueSummary || canceledItems.length > 0) && (
                  <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                        <AlertCircle size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-red-600 dark:text-red-400">Kräver uppföljning</div>
                        <div className="mt-1 text-sm text-muted">
                          {batch.issueSummary ??
                            `${canceledItems.length} filer avbröts i batchen. Öppna detaljer för att se vad som stoppade körningen.`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                      Status
                    </div>
                    <div className="mt-2 text-sm font-medium">
                      {canceledItems.length > 0
                        ? `${canceledItems.length} stoppade`
                        : activeItems.length > 0
                          ? `${activeItems.length} aktiva`
                          : "Allt klart"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {batch.topToolIds.map((toolId) => (
                      <span key={toolId} className="rounded-full border bg-surface px-2 py-1 text-xs">
                        {conversionTools.find((tool) => tool.id === toolId)?.title ?? toolId}
                      </span>
                    ))}
                  </div>
                  <Button variant="secondary" onClick={() => setSelectedBatchId(batch.id)}>
                    Visa batchdetaljer
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog
        open={!!selectedBatch}
        onClose={() => setSelectedBatchId(null)}
        title={selectedBatch ? selectedBatch.label : "Batchdetaljer"}
        description={
          selectedBatch
            ? `${selectedBatch.completedFiles}/${selectedBatch.totalFiles} filer klara • ${statusLabel[selectedBatch.status]}`
            : undefined
        }
        size="xl"
      >
        {selectedBatch && (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border bg-bg/40 p-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted">Batch-id</div>
                <div className="mt-2 text-sm font-medium">{selectedBatch.id}</div>
              </div>
              <div className="rounded-xl border bg-bg/40 p-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted">Start</div>
                <div className="mt-2 text-sm font-medium">
                  {new Date(selectedBatch.startedAt).toLocaleString("sv-SE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="rounded-xl border bg-bg/40 p-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted">Källa</div>
                <div className="mt-2 text-sm font-medium">{selectedBatch.source === "live" ? "Aktiv kö" : "Mockad historik"}</div>
              </div>
              <div className="rounded-xl border bg-bg/40 p-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted">Preset</div>
                <div className="mt-2 text-sm font-medium">{selectedBatch.presetName ?? "Ingen preset kopplad"}</div>
              </div>
            </div>

            {selectedBatch.issueSummary && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    <AlertCircle size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-amber-700 dark:text-amber-300">Vad som behöver följas upp</div>
                    <div className="mt-1 text-sm text-muted">{selectedBatch.issueSummary}</div>
                  </div>
                </div>
              </div>
            )}

            <Table>
              <thead>
                <tr>
                  <Th>Fil</Th>
                  <Th>Verktyg</Th>
                  <Th>Status</Th>
                  <Th>Output</Th>
                  <Th>Storlek</Th>
                  <Th className="text-right">Detalj</Th>
                </tr>
              </thead>
              <tbody>
                {selectedBatch.items.length === 0 && (
                  <tr>
                    <Td colSpan={6} className="py-8 text-center text-sm text-muted">
                      Inga filrader finns för den här batchen ännu.
                    </Td>
                  </tr>
                )}
                {selectedBatch.items.map((item) => {
                  const tool = conversionTools.find((entry) => entry.id === item.toolId);
                  return (
                    <tr key={item.id} className="transition-colors hover:bg-bg/50">
                      <Td>
                        <div className="font-medium">{item.fileName}</div>
                        <div className="mt-1 text-xs text-muted">{formatLabel(item.sourceFormat)}</div>
                      </Td>
                      <Td>{tool?.title ?? item.toolId}</Td>
                      <Td>
                        <Badge tone={itemStatusTone[item.status]}>{itemStatusLabel[item.status]}</Badge>
                      </Td>
                      <Td>
                        <div className="font-medium">{item.resultName}</div>
                        <div className="mt-1 text-xs text-muted">{item.progress}% färdigt</div>
                      </Td>
                      <Td className="text-xs text-muted">{formatBytes(item.size)}</Td>
                      <Td className="text-right text-xs text-muted">
                        {item.note ?? (item.durationMs ? formatDuration(item.durationMs) : "Ingen extra detalj")}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </Dialog>
    </div>
  );
}

function SortableTh({
  children,
  active,
  dir,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Th className={className}>
      <button
        onClick={onClick}
        className={clsx(
          "-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors",
          active ? "text-fg" : "hover:text-fg",
        )}
      >
        {children}
        {active ? dir === "asc" ? <ArrowUp size={10} /> : <ArrowDown size={10} /> : <span className="inline-block h-[10px] w-[10px]" />}
      </button>
    </Th>
  );
}
