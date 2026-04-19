"use client";

import { type ChangeEvent, type DragEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileArchive,
  FileCog,
  FileImage,
  FileSearch,
  Filter,
  Layers3,
  Play,
  Sparkles,
  Upload,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { Badge, Table, Td, Th } from "@/components/ui/Table";
import {
  acceptedFormats,
  buildResultName,
  conversionTools,
  demoFiles,
  estimateDuration,
  formatBytes,
  formatLabel,
  getCompatibleTools,
  getFileExtension,
} from "@/modules/file-converter/config";
import type { ConversionToolDefinition, FileFormat, QueueItem, StagedFile } from "@/modules/file-converter/types";

const parallelOptions = [1, 2, 4, 6];

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function toolTone(tool: ConversionToolDefinition) {
  if (tool.category === "document") return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
  if (tool.category === "icon") return "bg-sky-500/10 text-sky-700 dark:text-sky-300";
  return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
}

function stageIncomingFiles(
  items: Array<{ name: string; size: number }>,
  current: StagedFile[],
): StagedFile[] {
  const existingKeys = new Set(current.map((file) => `${file.name}:${file.size}`));
  const nextFiles = items.flatMap((file) => {
    const identity = `${file.name}:${file.size}`;
    if (existingKeys.has(identity)) return [];

    const extension = getFileExtension(file.name);
    const compatibleTools = getCompatibleTools(extension);
    return [
      {
        id: makeId("staged"),
        name: file.name,
        size: file.size,
        extension,
        compatibleToolIds: compatibleTools.map((tool) => tool.id),
        selectedToolId: compatibleTools[0]?.id ?? null,
      } satisfies StagedFile,
    ];
  });

  return [...current, ...nextFiles];
}

export function FileConverterPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ConversionToolDefinition["category"] | "all">("all");
  const [parallelism, setParallelism] = useState(4);
  const [isDragging, setIsDragging] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>(() => stageIncomingFiles(demoFiles, []));
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);

  const toolMap = useMemo(() => new Map(conversionTools.map((tool) => [tool.id, tool])), []);

  const filteredTools = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return conversionTools.filter((tool) => {
      const matchesCategory = category === "all" || tool.category === category;
      const matchesSearch =
        !normalized ||
        tool.title.toLowerCase().includes(normalized) ||
        tool.description.toLowerCase().includes(normalized) ||
        tool.inputFormats.join(" ").includes(normalized) ||
        tool.outputFormat.includes(normalized);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const queueSummary = useMemo(() => {
    const completed = queueItems.filter((item) => item.status === "completed").length;
    const running = queueItems.filter((item) => item.status === "running").length;
    const queued = queueItems.filter((item) => item.status === "queued").length;
    return { completed, running, queued };
  }, [queueItems]);

  const availableToQueue = stagedFiles.filter(
    (file) => file.extension && file.selectedToolId && file.compatibleToolIds.includes(file.selectedToolId),
  );

  const recentCompleted = useMemo(
    () =>
      [...queueItems]
        .filter((item) => item.status === "completed")
        .sort((left, right) => (right.completedAt ?? 0) - (left.completedAt ?? 0))
        .slice(0, 6),
    [queueItems],
  );

  const batchSummary = useMemo(() => {
    const grouped = new Map<
      string,
      {
        createdAt: number;
        total: number;
        completed: number;
      }
    >();

    queueItems.forEach((item) => {
      const current = grouped.get(item.batchId) ?? {
        createdAt: item.createdAt,
        total: 0,
        completed: 0,
      };
      current.total += 1;
      if (item.status === "completed") current.completed += 1;
      grouped.set(item.batchId, current);
    });

    return Array.from(grouped.entries())
      .map(([batchId, value]) => ({
        batchId,
        ...value,
      }))
      .sort((left, right) => right.createdAt - left.createdAt)
      .slice(0, 4);
  }, [queueItems]);

  useEffect(() => {
    const runningCount = queueItems.filter((item) => item.status === "running").length;
    const queuedCount = queueItems.filter((item) => item.status === "queued").length;
    if (runningCount >= parallelism || queuedCount === 0) return;

    const freeSlots = parallelism - runningCount;
    setQueueItems((current) => {
      let started = 0;
      let changed = false;

      const next = current.map((item) => {
        if (item.status !== "queued" || started >= freeSlots) return item;
        started += 1;
        changed = true;
        const startedItem: QueueItem = {
          ...item,
          status: "running",
          startedAt: Date.now(),
          progress: Math.max(item.progress, 4),
        };
        return startedItem;
      });

      return changed ? next : current;
    });
  }, [parallelism, queueItems]);

  useEffect(() => {
    const hasRunningItems = queueItems.some((item) => item.status === "running");
    if (!hasRunningItems) return;

    const timer = window.setInterval(() => {
      setQueueItems((current) =>
        current.map((item) => {
          if (item.status !== "running") return item;

          const increment = Math.max(6, Math.round(1000 / item.durationMs) * 12) + Math.floor(Math.random() * 12);
          const nextProgress = Math.min(item.progress + increment, 100);
          if (nextProgress >= 100) {
            const completedItem: QueueItem = {
              ...item,
              status: "completed",
              progress: 100,
              completedAt: Date.now(),
            };
            return completedItem;
          }

          const runningItem: QueueItem = {
            ...item,
            progress: nextProgress,
          };
          return runningItem;
        }),
      );
    }, 220);

    return () => window.clearInterval(timer);
  }, [queueItems]);

  function openPicker() {
    inputRef.current?.click();
  }

  function addFiles(items: Array<{ name: string; size: number }>) {
    setStagedFiles((current) => stageIncomingFiles(items, current));
  }

  function onNativeFilePick(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).map((file) => ({
      name: file.name,
      size: file.size,
    }));
    addFiles(files);
    event.target.value = "";
  }

  function onDragEnter(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    dragDepthRef.current += 1;
    setIsDragging(true);
  }

  function onDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  function onDragLeave(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setIsDragging(false);
  }

  function onDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    dragDepthRef.current = 0;
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files ?? []).map((file) => ({
      name: file.name,
      size: file.size,
    }));

    if (files.length > 0) addFiles(files);
  }

  function assignTool(fileId: string, toolId: string) {
    setStagedFiles((current) =>
      current.map((file) => {
        if (file.id !== fileId) return file;
        return {
          ...file,
          selectedToolId: toolId,
        };
      }),
    );
  }

  function removeStaged(fileId: string) {
    setStagedFiles((current) => current.filter((file) => file.id !== fileId));
  }

  function queueBatch() {
    const convertible = stagedFiles.filter(
      (file): file is StagedFile & { extension: FileFormat; selectedToolId: string } =>
        !!file.extension && !!file.selectedToolId && file.compatibleToolIds.includes(file.selectedToolId),
    );

    if (convertible.length === 0) return;

    const batchId = makeId("batch");
    const createdAt = Date.now();
    const nextItems = convertible.flatMap((file) => {
      const tool = toolMap.get(file.selectedToolId);
      if (!tool) return [];

      return [
        {
          id: makeId("queue"),
          batchId,
          fileName: file.name,
          size: file.size,
          sourceFormat: file.extension,
          toolId: tool.id,
          status: "queued",
          progress: 0,
          createdAt,
          durationMs: estimateDuration(file.size, tool),
          resultName: buildResultName(file.name, tool.outputFormat),
        } satisfies QueueItem,
      ];
    });

    setQueueItems((current) => [...nextItems, ...current]);
    setStagedFiles((current) => current.filter((file) => !convertible.some((item) => item.id === file.id)));
  }

  const totalStagedSize = stagedFiles.reduce((sum, file) => sum + file.size, 0);
  const activeCapacityHint = `${queueSummary.running}/${parallelism} parallella jobb`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Konvertera filer"
          subtitle="Konfigurationsdrivet konverteringsverktyg med batchkö och stöd för att lägga till nya flöden via en enkel verktygslista."
        />
        <div className="flex flex-wrap gap-2">
          <Link
            href="/convert-files/history"
            className="inline-flex h-9 items-center justify-center rounded-lg border bg-surface px-3.5 text-sm font-medium transition-colors hover:bg-bg"
          >
            Historik
          </Link>
          <Link
            href="/convert-files/presets"
            className="inline-flex h-9 items-center justify-center rounded-lg border bg-surface px-3.5 text-sm font-medium transition-colors hover:bg-bg"
          >
            Presets
          </Link>
          <Button variant="secondary" onClick={() => addFiles(demoFiles)}>
            <Sparkles size={14} strokeWidth={2} className="mr-1.5" />
            Ladda demo-filer
          </Button>
          <Button onClick={openPicker}>
            <Upload size={14} strokeWidth={2} className="mr-1.5" />
            Välj filer
          </Button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp,.pdf,.heic,.svg"
        className="hidden"
        onChange={onNativeFilePick}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Verktyg i katalogen" value={String(conversionTools.length)} hint="Varje konvertering definieras av ett objekt i config." />
        <StatCard label="Filer i staging" value={String(stagedFiles.length)} hint={totalStagedSize ? formatBytes(totalStagedSize) : "Ingen fil inlagd"} />
        <StatCard label="Aktiv kö" value={String(queueSummary.running + queueSummary.queued)} hint={activeCapacityHint} />
        <StatCard label="Färdiga körningar" value={String(queueSummary.completed)} hint="Resultat med separat batchhistorik." />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card id="upload" className="p-0">
          <div className="border-b p-5">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <FileArchive size={16} />
              Inmatning och batchkö
            </div>
            <p className="mt-1 text-sm text-muted">
              Lägg till en eller flera filer. Varje fil matchas automatiskt mot kompatibla konverteringar i katalogen.
            </p>
          </div>

          <div className="grid gap-4 p-5 lg:grid-cols-[1fr_0.95fr]">
            <div
              role="button"
              tabIndex={0}
              onClick={openPicker}
              onDragEnter={onDragEnter}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openPicker();
                }
              }}
              className={clsx(
                "rounded-2xl border border-dashed p-5 text-left transition-colors",
                isDragging ? "border-fg bg-bg" : "bg-bg/50 hover:bg-bg",
              )}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fg text-bg">
                <Upload size={18} />
              </div>
              <div className="mt-4 text-base font-semibold tracking-tight">
                {isDragging ? "Släpp filerna här" : "Släpp in filer i staging"}
              </div>
              <p className="mt-1 max-w-md text-sm text-muted">
                Uppladdning med stöd för JPG, PNG, WEBP, PDF, HEIC och SVG. I bulk-läge går kompatibla jobb direkt till kö och körs parallellt.
              </p>
              <div className="mt-3 rounded-xl border bg-surface/70 px-3 py-2 text-xs text-muted">
                Dra in filer från datorn eller klicka för att välja manuellt.
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {acceptedFormats.map((format) => (
                  <span key={format} className="rounded-full border bg-surface px-2.5 py-1 text-xs font-medium">
                    {formatLabel(format)}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border bg-bg/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Layers3 size={15} />
                  Köinställningar
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium">Parallella jobb</label>
                    <select
                      value={parallelism}
                      onChange={(event) => setParallelism(Number(event.target.value))}
                      className="h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
                    >
                      {parallelOptions.map((value) => (
                        <option key={value} value={value}>
                          {value} samtidiga jobb
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium">Batchläge</label>
                    <div className="flex h-9 items-center rounded-lg border bg-surface px-3 text-sm text-muted">
                      Parallell kömotor
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={queueBatch} disabled={availableToQueue.length === 0}>
                    <Play size={14} strokeWidth={2} className="mr-1.5" />
                    Starta batch
                  </Button>
                  <Button variant="secondary" onClick={() => setStagedFiles([])} disabled={stagedFiles.length === 0}>
                    Töm staging
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border bg-bg/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FileSearch size={15} />
                  Hur du bygger ut stödet
                </div>
                <p className="mt-2 text-sm text-muted">
                  Lägg till ett nytt objekt i <code>conversionTools</code> så dyker det upp i katalogen, blir sökbart i gränssnittet och kan väljas för kompatibla filer utan att kärnflödet behöver ändras.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <Clock3 size={15} />
            Driftbild
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border bg-bg/40 p-4">
              <div className="text-xs font-medium uppercase tracking-wider text-muted">Nu aktivt</div>
              <div className="mt-2 text-2xl font-semibold tracking-tight">{queueSummary.running}</div>
              <div className="mt-1 text-sm text-muted">Jobb som behandlas just nu.</div>
            </div>
            <div className="rounded-2xl border bg-bg/40 p-4">
              <div className="text-xs font-medium uppercase tracking-wider text-muted">Redo att köra</div>
              <div className="mt-2 text-2xl font-semibold tracking-tight">{availableToQueue.length}</div>
              <div className="mt-1 text-sm text-muted">Filer med giltigt verktygsval i staging.</div>
            </div>
            <div className="rounded-2xl border bg-bg/40 p-4">
              <div className="text-xs font-medium uppercase tracking-wider text-muted">Senaste output</div>
              <div className="mt-2 text-sm font-medium">{recentCompleted[0]?.resultName ?? "Ingen output ännu"}</div>
              <div className="mt-1 text-sm text-muted">
                {recentCompleted[0] ? "Senast avslutade körning." : "Kör en batch för att fylla historiken."}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <div className="text-sm font-semibold tracking-tight">Staginglista</div>
              <div className="mt-1 text-sm text-muted">Tilldela verktyg per fil innan batchen körs.</div>
            </div>
            <Badge tone={availableToQueue.length > 0 ? "success" : "neutral"}>{availableToQueue.length} redo</Badge>
          </div>

          <Table className="rounded-none border-0 shadow-none">
            <thead>
              <tr>
                <Th>Fil</Th>
                <Th>Storlek</Th>
                <Th>Matchning</Th>
                <Th>Verktyg</Th>
                <Th className="text-right">Åtgärd</Th>
              </tr>
            </thead>
            <tbody>
              {stagedFiles.length === 0 && (
                <tr>
                  <Td colSpan={5} className="py-10 text-center text-sm text-muted">
                    Staging är tom. Lägg till filer eller ladda demo-filer.
                  </Td>
                </tr>
              )}
              {stagedFiles.map((file) => (
                <tr key={file.id} className="transition-colors hover:bg-bg/50">
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg">
                        <FileImage size={16} className="text-muted" />
                      </div>
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-xs text-muted">{file.extension ? formatLabel(file.extension) : "Okänd filtyp"}</div>
                      </div>
                    </div>
                  </Td>
                  <Td className="font-mono text-xs">{formatBytes(file.size)}</Td>
                  <Td>
                    <Badge tone={file.compatibleToolIds.length > 0 ? "success" : "danger"}>
                      {file.compatibleToolIds.length > 0 ? `${file.compatibleToolIds.length} kompatibla` : "Ingen matchning"}
                    </Badge>
                  </Td>
                  <Td>
                    <select
                      value={file.selectedToolId ?? ""}
                      onChange={(event) => assignTool(file.id, event.target.value)}
                      disabled={file.compatibleToolIds.length === 0}
                      className="h-9 w-full min-w-[180px] rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5 disabled:text-muted"
                    >
                      {file.compatibleToolIds.length === 0 ? (
                        <option value="">Inget verktyg</option>
                      ) : (
                        file.compatibleToolIds.map((toolId) => (
                          <option key={toolId} value={toolId}>
                            {toolMap.get(toolId)?.title}
                          </option>
                        ))
                      )}
                    </select>
                  </Td>
                  <Td className="text-right">
                    <Button variant="ghost" onClick={() => removeStaged(file.id)}>
                      Ta bort
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card id="queue" className="p-5">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <Play size={15} />
            Batchhistorik
          </div>
          <div className="mt-4 space-y-3">
            {batchSummary.length === 0 && (
              <div className="rounded-2xl border bg-bg/40 p-4 text-sm text-muted">
                Inga batcher ännu. När du kör staginglistan skapas en separat batch med egen progress.
              </div>
            )}
            {batchSummary.map((batch) => (
              <div key={batch.batchId} className="rounded-2xl border bg-bg/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">Batch {batch.batchId.slice(-6)}</div>
                    <div className="mt-1 text-xs text-muted">
                      {new Date(batch.createdAt).toLocaleTimeString("sv-SE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <Badge tone={batch.completed === batch.total ? "success" : "warning"}>
                    {batch.completed}/{batch.total} klara
                  </Badge>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-fg transition-all"
                    style={{ width: `${(batch.completed / batch.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card id="catalog" className="p-0">
          <div className="border-b p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-sm font-semibold tracking-tight">Verktygskatalog</div>
                <div className="mt-1 text-sm text-muted">Varje kort representerar ett objekt i den centrala verktygslistan.</div>
              </div>
              <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                <div className="relative min-w-[220px]">
                  <Filter size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Sök format eller verktyg..."
                    className="pl-9"
                  />
                </div>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as ConversionToolDefinition["category"] | "all")}
                  className="h-9 rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
                >
                  <option value="all">Alla kategorier</option>
                  <option value="image">Bild</option>
                  <option value="document">Dokument</option>
                  <option value="icon">Ikon</option>
                </select>
              </div>
            </div>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-2">
            {filteredTools.map((tool) => (
              <div key={tool.id} className="rounded-2xl border bg-bg/30 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold tracking-tight">{tool.title}</div>
                    <div className="mt-1 text-sm text-muted">{tool.description}</div>
                  </div>
                  <span className={clsx("rounded-full px-2.5 py-1 text-xs font-medium", toolTone(tool))}>
                    {tool.category === "image" ? "Bild" : tool.category === "document" ? "Dokument" : "Ikon"}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="rounded-lg border bg-surface px-2 py-1 font-medium">
                    {tool.inputFormats.map(formatLabel).join(", ")}
                  </span>
                  <ArrowRight size={14} className="text-muted" />
                  <span className="rounded-lg border bg-surface px-2 py-1 font-medium">{formatLabel(tool.outputFormat)}</span>
                </div>
                <div className="mt-4 text-xs text-muted">{tool.qualityHint}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                    {tool.speed === "fast" ? "Snabb" : tool.speed === "balanced" ? "Balanserad" : "Tung"}
                  </span>
                  <span className="rounded-full border bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                    {tool.supportsBulk ? "Stöd för bulk" : "En fil åt gången"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-0">
          <div className="border-b p-5">
            <div className="text-sm font-semibold tracking-tight">Aktiv kö och resultat</div>
            <div className="mt-1 text-sm text-muted">
              Visar pågående jobb, progress och genererade resultat från den aktiva batchkön.
            </div>
          </div>
          <div className="space-y-3 p-5">
            {queueItems.length === 0 && (
              <div className="rounded-2xl border bg-bg/40 p-4 text-sm text-muted">
                Starta en batch för att se köstatus, progress och resultatnamn.
              </div>
            )}
            {queueItems.slice(0, 8).map((item) => {
              const tool = toolMap.get(item.toolId);
              return (
                <div key={item.id} className="rounded-2xl border bg-bg/30 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface">
                          <FileCog size={15} className="text-muted" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{item.fileName}</div>
                          <div className="text-xs text-muted">{tool?.title}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                        <span className="rounded-full border bg-surface px-2 py-1">
                          {formatLabel(item.sourceFormat)} till {tool ? formatLabel(tool.outputFormat) : "?"}
                        </span>
                        <span className="rounded-full border bg-surface px-2 py-1">{formatBytes(item.size)}</span>
                      </div>
                    </div>
                    <Badge
                      tone={
                        item.status === "completed"
                          ? "success"
                          : item.status === "running"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {item.status === "completed" ? "Klar" : item.status === "running" ? "Körs" : "I kö"}
                    </Badge>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface">
                    <div
                      className={clsx(
                        "h-full rounded-full transition-all",
                        item.status === "completed" ? "bg-emerald-500" : "bg-fg",
                      )}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted">
                    <span>{item.progress}%</span>
                    <span>{item.resultName}</span>
                  </div>
                </div>
              );
            })}

            {recentCompleted.length > 0 && (
              <div className="rounded-2xl border bg-bg/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 size={15} />
                  Senaste exporter
                </div>
                <div className="mt-3 space-y-2">
                  {recentCompleted.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2 text-sm">
                      <span className="truncate">{item.resultName}</span>
                      <span className="shrink-0 text-xs text-muted">
                        {new Date(item.completedAt ?? item.createdAt).toLocaleTimeString("sv-SE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
