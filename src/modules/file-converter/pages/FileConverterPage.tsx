"use client";

import { type ChangeEvent, type DragEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Copy,
  Download,
  FileArchive,
  FileImage,
  Filter,
  Layers3,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/components/toast/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { RowMenu } from "@/components/ui/RowMenu";
import { StatCard } from "@/components/ui/StatCard";
import { Badge, Table, Td, Th } from "@/components/ui/Table";
import {
  acceptedFormats,
  buildResultName,
  conversionTools,
  demoFiles,
  estimateDuration,
  formatBytes,
  formatDuration,
  formatLabel,
  getCompatibleTools,
  getFileExtension,
} from "@/modules/file-converter/config";
import { useConversionQueueEngine } from "@/modules/file-converter/lib/activity";
import { useFileConverterWorkspace } from "@/modules/file-converter/lib/workspace";
import { Checkbox } from "@/modules/snaptld/components/Checkbox";
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

function buildAddFilesSummary(
  items: Array<{ name: string; size: number }>,
  current: StagedFile[],
): {
  nextFiles: StagedFile[];
  addedCount: number;
  duplicateCount: number;
  unsupportedCount: number;
} {
  const existingKeys = new Set(current.map((file) => `${file.name}:${file.size}`));
  let duplicateCount = 0;
  let unsupportedCount = 0;

  const nextFiles = items.flatMap((file) => {
    const identity = `${file.name}:${file.size}`;
    if (existingKeys.has(identity)) {
      duplicateCount += 1;
      return [];
    }

    const extension = getFileExtension(file.name);
    const compatibleTools = getCompatibleTools(extension);
    if (compatibleTools.length === 0) unsupportedCount += 1;
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

  return {
    nextFiles,
    addedCount: nextFiles.length,
    duplicateCount,
    unsupportedCount,
  };
}

export function FileConverterPage() {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ConversionToolDefinition["category"] | "all">("all");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedStageIds, setSelectedStageIds] = useState<Set<string>>(new Set());
  const workspace = useFileConverterWorkspace();
  const parallelism = workspace.parallelism;
  const activity = useConversionQueueEngine(parallelism);
  const queueItems = activity.queueItems;
  const stagedFiles = workspace.stagedFiles;

  const toolMap = useMemo(() => new Map(conversionTools.map((tool) => [tool.id, tool])), []);
  const queueItemMap = useMemo(() => new Map(queueItems.map((item) => [item.id, item])), [queueItems]);

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
    const paused = queueItems.filter((item) => item.status === "paused").length;
    const canceled = queueItems.filter((item) => item.status === "canceled").length;
    return { completed, running, queued, paused, canceled };
  }, [queueItems]);

  const availableToQueue = stagedFiles.filter(
    (file) =>
      !file.queueItemId &&
      file.extension &&
      file.selectedToolId &&
      file.compatibleToolIds.includes(file.selectedToolId),
  );
  const unsupportedFiles = stagedFiles.filter((file) => !file.queueItemId && file.compatibleToolIds.length === 0);
  const supportedSelectedFiles = stagedFiles.filter(
    (file) => selectedStageIds.has(file.id) && !file.queueItemId && file.compatibleToolIds.length > 0,
  );
  const selectedUnsupportedCount = stagedFiles.filter(
    (file) => selectedStageIds.has(file.id) && !file.queueItemId && file.compatibleToolIds.length === 0,
  ).length;

  const commonToolIds = useMemo(() => {
    if (supportedSelectedFiles.length === 0) return [];
    return supportedSelectedFiles
      .slice(1)
      .reduce(
        (shared, file) => shared.filter((toolId) => file.compatibleToolIds.includes(toolId)),
        supportedSelectedFiles[0]?.compatibleToolIds ?? [],
      );
  }, [supportedSelectedFiles]);

  const selectedCount = selectedStageIds.size;
  const selectedReadyCount = supportedSelectedFiles.filter(
    (file) =>
      !!file.extension &&
      !!file.selectedToolId &&
      !file.queueItemId &&
      file.compatibleToolIds.includes(file.selectedToolId),
  ).length;
  const allStagedSelected = stagedFiles.length > 0 && selectedCount === stagedFiles.length;
  const stagedFormats = useMemo(
    () => new Set(stagedFiles.map((file) => file.extension).filter((format): format is FileFormat => !!format)),
    [stagedFiles],
  );

  const batchSummary = useMemo(() => {
    const grouped = new Map<
      string,
      {
        createdAt: number;
        total: number;
        completed: number;
        active: number;
        paused: number;
        canceled: number;
      }
    >();

    queueItems.forEach((item) => {
      const current = grouped.get(item.batchId) ?? {
        createdAt: item.createdAt,
        total: 0,
        completed: 0,
        active: 0,
        paused: 0,
        canceled: 0,
      };
      current.total += 1;
      if (item.status === "completed") current.completed += 1;
      if (item.status === "running" || item.status === "queued") current.active += 1;
      if (item.status === "paused") current.paused += 1;
      if (item.status === "canceled") current.canceled += 1;
      grouped.set(item.batchId, current);
    });

    return Array.from(grouped.entries())
      .map(([batchId, value]) => ({
        batchId,
        ...value,
        label:
          queueItems.find((item) => item.batchId === batchId)?.batchLabel ??
          queueItems.find((item) => item.batchId === batchId)?.presetName ??
          `Batch ${batchId.slice(-6)}`,
      }))
      .sort((left, right) => right.createdAt - left.createdAt)
      .slice(0, 4);
  }, [queueItems]);

  useEffect(() => {
    setSelectedStageIds((current) => {
      const validIds = new Set(stagedFiles.map((file) => file.id));
      const next = new Set([...current].filter((id) => validIds.has(id)));
      return next.size === current.size ? current : next;
    });
  }, [stagedFiles]);

  function openPicker() {
    inputRef.current?.click();
  }

  function addFiles(items: Array<{ name: string; size: number }>) {
    const summary = buildAddFilesSummary(items, stagedFiles);
    workspace.setStagedFiles((current) => [...current, ...summary.nextFiles]);

    if (summary.addedCount > 0) {
      const details = [
        summary.unsupportedCount > 0 ? `${summary.unsupportedCount} utan matchning` : null,
        summary.duplicateCount > 0 ? `${summary.duplicateCount} dubletter hoppades över` : null,
      ]
        .filter(Boolean)
        .join(" • ");
      toast.success(
        summary.addedCount === 1 ? "1 fil lades till i staging" : `${summary.addedCount} filer lades till i staging`,
        details || undefined,
      );
      return;
    }

    if (summary.duplicateCount > 0) {
      toast.info(
        "Inga nya filer lades till",
        summary.duplicateCount === 1 ? "Filen finns redan i staging." : `${summary.duplicateCount} filer finns redan i staging.`,
      );
    }
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
    workspace.setStagedFiles((current) =>
      current.map((file) => {
        if (file.id !== fileId) return file;
        const nextFile: StagedFile = {
          ...file,
          selectedToolId: toolId,
        };
        return nextFile;
      }),
    );
  }

  function removeStaged(fileId: string) {
    const currentFile = stagedFiles.find((file) => file.id === fileId);
    if (currentFile?.queueItemId) {
      activity.replaceQueueItems((current) => current.filter((item) => item.id !== currentFile.queueItemId));
    }
    workspace.setStagedFiles((current) => current.filter((file) => file.id !== fileId));
  }

  function toggleStageSelection(fileId: string) {
    setSelectedStageIds((current) => {
      const next = new Set(current);
      if (next.has(fileId)) next.delete(fileId);
      else next.add(fileId);
      return next;
    });
  }

  function toggleSelectAllStaged() {
    setSelectedStageIds((current) => {
      if (stagedFiles.length > 0 && current.size === stagedFiles.length) return new Set();
      return new Set(stagedFiles.map((file) => file.id));
    });
  }

  function assignToolToSelected(toolId: string) {
    const tool = toolMap.get(toolId);
    if (!tool) return;

    let updated = 0;
    workspace.setStagedFiles((current) =>
      current.map((file) => {
        if (!selectedStageIds.has(file.id) || !!file.queueItemId || !file.compatibleToolIds.includes(toolId)) return file;
        updated += 1;
        const nextFile: StagedFile = {
          ...file,
          selectedToolId: toolId,
        };
        return nextFile;
      }),
    );

    if (updated > 0) {
      toast.success(
        updated === 1 ? "Verktyg uppdaterat" : `Verktyg uppdaterat för ${updated} filer`,
        tool.title,
      );
    }
  }

  function removeSelectedStaged() {
    const count = selectedStageIds.size;
    if (count === 0) return;

    const linkedQueueIds = stagedFiles
      .filter((file) => selectedStageIds.has(file.id))
      .map((file) => file.queueItemId)
      .filter((queueItemId): queueItemId is string => !!queueItemId);

    if (linkedQueueIds.length > 0) {
      const linkedSet = new Set(linkedQueueIds);
      activity.replaceQueueItems((current) => current.filter((item) => !linkedSet.has(item.id)));
    }

    workspace.setStagedFiles((current) => current.filter((file) => !selectedStageIds.has(file.id)));
    setSelectedStageIds(new Set());
    toast.info(count === 1 ? "1 fil togs bort" : `${count} filer togs bort`);
  }

  function queueBatch() {
    const convertible = stagedFiles.filter(
      (file): file is StagedFile & { extension: FileFormat; selectedToolId: string } =>
        !file.queueItemId &&
        !!file.extension &&
        !!file.selectedToolId &&
        file.compatibleToolIds.includes(file.selectedToolId),
    );
    if (convertible.length === 0) return;

    const batchId = makeId("batch");
    const createdAt = Date.now();
    const queuedByFileId = new Map<string, QueueItem>();

    const nextItems = convertible.flatMap((file) => {
      const tool = toolMap.get(file.selectedToolId);
      if (!tool) return [];
      const nextItem: QueueItem = {
        id: makeId("queue"),
        batchId,
        batchConcurrency: parallelism,
        fileName: file.name,
        size: file.size,
        sourceFormat: file.extension,
        toolId: tool.id,
        status: "queued",
        progress: 0,
        createdAt,
        durationMs: estimateDuration(file.size, tool),
        resultName: buildResultName(file.name, tool.outputFormat),
      };
      queuedByFileId.set(file.id, nextItem);
      return [nextItem];
    });

    activity.replaceQueueItems((current) => [...nextItems, ...current]);
    workspace.setStagedFiles((current) =>
      current.map((file) => {
        const queuedItem = queuedByFileId.get(file.id);
        if (!queuedItem) return file;
        const nextFile: StagedFile = {
          ...file,
          queueItemId: queuedItem.id,
        };
        return nextFile;
      }),
    );
    setSelectedStageIds(new Set());
    toast.success(
      convertible.length === 1 ? "Batch startad med 1 fil" : `Batch startad med ${convertible.length} filer`,
      `${parallelism} parallella jobb • Batch ${batchId.slice(-6)}`,
    );
  }

  function copyResultName(resultName: string) {
    void navigator.clipboard.writeText(resultName);
    toast.success("Filnamn kopierat", resultName);
  }

  function downloadResult(resultName: string) {
    toast.success("Export förberedd", resultName);
  }

  function pauseItem(itemId: string) {
    activity.replaceQueueItems((current) =>
      current.map((item) =>
        item.id === itemId && item.status === "running"
          ? {
              ...item,
              status: "paused",
            }
          : item,
      ),
    );
    toast.info("Jobb pausat");
  }

  function resumeItem(itemId: string) {
    activity.replaceQueueItems((current) =>
      current.map((item) =>
        item.id === itemId && item.status === "paused"
          ? {
              ...item,
              status: "queued",
            }
          : item,
      ),
    );
    toast.success("Jobb återupptaget");
  }

  function cancelItem(itemId: string) {
    activity.replaceQueueItems((current) =>
      current.map((item) =>
        item.id === itemId && item.status !== "completed" && item.status !== "canceled"
          ? {
              ...item,
              status: "canceled",
              completedAt: Date.now(),
            }
          : item,
      ),
    );
    toast.info("Jobb avbrutet");
  }

  function retryItem(itemId: string) {
    activity.replaceQueueItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: "queued",
              progress: 0,
              startedAt: undefined,
              completedAt: undefined,
              createdAt: Date.now(),
            }
          : item,
      ),
    );
    toast.success("Jobb kölagt igen");
  }

  const totalStagedSize = stagedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Konvertera filer"
          subtitle="Samla filer i staging, välj rätt utdataformat och följ samma rad från väntar till färdig export."
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Tillgängliga flöden" value={String(conversionTools.length)} hint="Bild, dokument och ikonformat i samma verktyg." />
        <StatCard label="Filer i staging" value={String(stagedFiles.length)} hint={totalStagedSize ? formatBytes(totalStagedSize) : workspace.hydrated ? "Ingen fil inlagd" : "Laddar arbetsyta..."} />
        <StatCard label="Exporter klara" value={String(queueSummary.completed)} hint={queueSummary.canceled > 0 ? `${queueSummary.canceled} avbrutna jobb i kön` : "Klara filer med nedladdning direkt på raden."} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.45fr_0.9fr]">
        <Card className="p-0">
          <div className="border-b p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                  <FileArchive size={16} />
                  Arbetsyta
                </div>
                <p className="mt-1 text-sm text-muted">
                  Lägg till filer, kontrollera matchning och låt samma rad visa väntar, körs och färdig export.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {unsupportedFiles.length > 0 && <Badge tone="warning">{unsupportedFiles.length} utan matchning</Badge>}
                <Badge tone={availableToQueue.length > 0 ? "success" : "neutral"}>{availableToQueue.length} redo</Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-5 border-b p-5 lg:grid-cols-[1fr_0.8fr]">
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
                {isDragging ? "Släpp filerna här" : "Lägg till filer i staging"}
              </div>
              <p className="mt-1 max-w-md text-sm text-muted">
                JPG, PNG, WEBP, PDF, HEIC och SVG matchas direkt mot rätt konverteringsflöden innan batchen startar.
              </p>
              <div className="mt-3 rounded-xl border bg-surface/70 px-3 py-2 text-xs text-muted">
                Dra in filer från datorn eller klicka för att välja manuellt. Demo-filer läggs bara in när du väljer det.
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {acceptedFormats.map((format) => (
                  <span
                    key={format}
                    className={clsx(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      stagedFormats.has(format)
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "bg-surface text-muted",
                    )}
                  >
                    {formatLabel(format)}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-bg/40 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Layers3 size={15} />
                Batchinställningar
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium">Parallella jobb</label>
                  <select
                    value={parallelism}
                    onChange={(event) => workspace.setParallelism(Number(event.target.value))}
                    className="h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
                  >
                    {parallelOptions.map((value) => (
                      <option key={value} value={value}>
                        {value} samtidiga jobb
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-xl border bg-surface px-3 py-2 text-sm text-muted">
                  Arbetsytan sparas lokalt så att staging och kapacitet ligger kvar när du kommer tillbaka.
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={queueBatch} disabled={availableToQueue.length === 0}>
                  <Play size={14} strokeWidth={2} className="mr-1.5" />
                  Starta batch
                </Button>
                <Button variant="secondary" onClick={() => workspace.resetWorkspace()} disabled={stagedFiles.length === 0 && parallelism === 4}>
                  Töm staging
                </Button>
              </div>
            </div>
          </div>

          {selectedCount > 0 && (
            <div className="border-b bg-fg px-5 py-3 text-bg">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-semibold">{selectedCount} valda</span>
                  <span className="text-bg/75">{selectedReadyCount} redo</span>
                  {selectedUnsupportedCount > 0 && <span className="text-bg/75">{selectedUnsupportedCount} utan matchning</span>}
                  <button onClick={() => setSelectedStageIds(new Set())} className="text-bg/75 transition-colors hover:text-bg">
                    Rensa val
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    defaultValue=""
                    onChange={(event) => {
                      if (!event.target.value) return;
                      assignToolToSelected(event.target.value);
                      event.target.value = "";
                    }}
                    disabled={commonToolIds.length === 0}
                    className="h-9 min-w-[220px] rounded-lg border border-fg/15 bg-bg px-3 text-sm text-fg outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5 disabled:text-muted"
                  >
                    <option value="">{commonToolIds.length > 0 ? "Välj verktyg för valda" : "Inget gemensamt verktyg"}</option>
                    {commonToolIds.map((toolId) => (
                      <option key={toolId} value={toolId}>
                        {toolMap.get(toolId)?.title}
                      </option>
                    ))}
                  </select>
                  <Button variant="secondary" onClick={removeSelectedStaged} className="border-0 bg-bg text-fg hover:bg-surface">
                    <Trash2 size={14} strokeWidth={2} className="mr-1.5" />
                    Ta bort valda
                  </Button>
                </div>
              </div>
            </div>
          )}

          {unsupportedFiles.length > 0 && (
            <div className="border-b bg-amber-500/10 px-5 py-3">
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                  <AlertCircle size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-amber-700 dark:text-amber-300">Vissa filer saknar kompatibel konvertering</div>
                  <div className="mt-1 text-sm text-muted">
                    De ligger kvar i staging så att du ser vad som blockerar batchen, men de kan inte köas förrän formatet stöds. Stödda indata just nu: {acceptedFormats.map(formatLabel).join(", ")}.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="border-b px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold tracking-tight">Staginglista</div>
                <div className="mt-1 text-sm text-muted">Samma rad går från väntar till klar export. Nedladdning och omkörning sker direkt på raden.</div>
              </div>
              <div className="text-sm text-muted">{totalStagedSize > 0 ? formatBytes(totalStagedSize) : "Ingen storlek än"}</div>
            </div>
          </div>

          <Table className="rounded-none border-0 shadow-none">
            <thead>
              <tr>
                <Th className="w-8 pr-0">
                  <Checkbox
                    checked={allStagedSelected}
                    indeterminate={selectedCount > 0 && !allStagedSelected}
                    onChange={toggleSelectAllStaged}
                    ariaLabel="Markera alla filer i staging"
                  />
                </Th>
                <Th>Fil</Th>
                <Th>Status</Th>
                <Th>Verktyg</Th>
                <Th>Output</Th>
                <Th className="text-right">Åtgärder</Th>
              </tr>
            </thead>
            <tbody>
              {stagedFiles.length === 0 && (
                <tr>
                  <Td colSpan={6} className="py-12">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg">
                        <Upload size={18} className="text-muted" />
                      </div>
                      <div className="mt-4 text-sm font-medium text-fg">Staging är tom</div>
                      <div className="mt-1 max-w-sm text-sm text-muted">
                        Lägg till filer för att börja bygga en batch. När filerna ligger här kan du justera verktyg innan du startar körningen.
                      </div>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <Button onClick={openPicker}>
                          <Upload size={14} strokeWidth={2} className="mr-1.5" />
                          Välj filer
                        </Button>
                        <Button variant="secondary" onClick={() => addFiles(demoFiles)}>
                          <Sparkles size={14} strokeWidth={2} className="mr-1.5" />
                          Ladda demo-filer
                        </Button>
                      </div>
                    </div>
                  </Td>
                </tr>
              )}
              {stagedFiles.map((file) => {
                const queueItem = file.queueItemId ? queueItemMap.get(file.queueItemId) : undefined;
                const tool = file.selectedToolId ? toolMap.get(file.selectedToolId) : queueItem ? toolMap.get(queueItem.toolId) : undefined;
                const outputName = queueItem?.resultName ?? (tool && file.extension ? buildResultName(file.name, tool.outputFormat) : "Ingen output ännu");
                const statusTone =
                  queueItem?.status === "completed"
                    ? "success"
                    : queueItem?.status === "running" || queueItem?.status === "paused"
                      ? "warning"
                      : queueItem?.status === "canceled"
                        ? "danger"
                        : file.compatibleToolIds.length > 0
                          ? "neutral"
                          : "danger";
                const statusLabel =
                  queueItem?.status === "completed"
                    ? "Klar"
                    : queueItem?.status === "running"
                      ? "Körs"
                      : queueItem?.status === "paused"
                        ? "Pausad"
                        : queueItem?.status === "canceled"
                          ? "Avbruten"
                          : file.compatibleToolIds.length > 0
                            ? "Redo"
                            : "Ingen matchning";

                return (
                  <tr
                    key={file.id}
                    className={clsx(
                      "transition-colors hover:bg-bg/50",
                      selectedStageIds.has(file.id) && "bg-fg/[0.03]",
                      !queueItem && file.compatibleToolIds.length === 0 && "bg-amber-500/[0.04]",
                    )}
                  >
                    <Td className="pr-0">
                      <Checkbox checked={selectedStageIds.has(file.id)} onChange={() => toggleStageSelection(file.id)} ariaLabel={`Välj ${file.name}`} />
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg">
                          <FileImage size={16} className="text-muted" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium">{file.name}</div>
                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted">
                            <span>{file.extension ? formatLabel(file.extension) : "Okänd filtyp"}</span>
                            <span>{formatBytes(file.size)}</span>
                          </div>
                          {queueItem && (
                            <div className="mt-3">
                              <div className="h-2 overflow-hidden rounded-full bg-surface">
                                <div
                                  className={clsx(
                                    "h-full rounded-full transition-all",
                                    queueItem.status === "completed"
                                      ? "bg-emerald-500"
                                      : queueItem.status === "canceled"
                                        ? "bg-red-500"
                                        : queueItem.status === "paused"
                                          ? "bg-amber-500"
                                          : "bg-fg",
                                  )}
                                  style={{ width: `${queueItem.progress}%` }}
                                />
                              </div>
                              <div className="mt-2 text-xs text-muted">
                                {queueItem.status === "completed"
                                  ? `Klar på ${formatDuration((queueItem.completedAt ?? queueItem.createdAt) - queueItem.createdAt)}`
                                  : queueItem.status === "canceled"
                                    ? "Avbruten innan export"
                                    : queueItem.status === "paused"
                                      ? `${queueItem.progress}% • väntar på återupptagning`
                                      : `${queueItem.progress}%`}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <Badge tone={statusTone}>{statusLabel}</Badge>
                    </Td>
                    <Td>
                      {queueItem ? (
                        <div className="text-sm">
                          <div className="font-medium">{tool?.title ?? queueItem.toolId}</div>
                          <div className="mt-1 text-xs text-muted">
                            {formatLabel(queueItem.sourceFormat)} till {tool ? formatLabel(tool.outputFormat) : "?"}
                          </div>
                        </div>
                      ) : file.compatibleToolIds.length > 0 ? (
                        <select
                          value={file.selectedToolId ?? ""}
                          onChange={(event) => assignTool(file.id, event.target.value)}
                          className="h-9 w-full min-w-[180px] rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
                        >
                          {file.compatibleToolIds.map((toolId) => (
                            <option key={toolId} value={toolId}>
                              {toolMap.get(toolId)?.title}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-sm text-muted">Ingen kompatibel konvertering</div>
                      )}
                    </Td>
                    <Td>
                      <div className="text-sm">
                        <div className="font-medium">{outputName}</div>
                        <div className="mt-1 text-xs text-muted">
                          {queueItem?.status === "completed"
                            ? "Redo för nedladdning"
                            : queueItem
                              ? "Resultatet blir aktivt när jobbet är klart"
                              : tool
                                ? "Visar planerat filnamn"
                                : "Saknar målformat"}
                        </div>
                      </div>
                    </Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-1">
                        {queueItem?.status === "completed" && (
                          <>
                            <button
                              onClick={() => copyResultName(queueItem.resultName)}
                              className="rounded-md p-1.5 text-muted transition-colors hover:bg-bg hover:text-fg"
                              aria-label={`Kopiera ${queueItem.resultName}`}
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              onClick={() => downloadResult(queueItem.resultName)}
                              className="rounded-md p-1.5 text-muted transition-colors hover:bg-bg hover:text-fg"
                              aria-label={`Ladda ned ${queueItem.resultName}`}
                            >
                              <Download size={14} />
                            </button>
                            <button
                              onClick={() => retryItem(queueItem.id)}
                              className="rounded-md p-1.5 text-muted transition-colors hover:bg-bg hover:text-fg"
                              aria-label={`Kör om ${queueItem.resultName}`}
                            >
                              <RotateCcw size={14} />
                            </button>
                          </>
                        )}
                        {queueItem && queueItem.status !== "completed" && (
                          <RowMenu
                            items={[
                              ...(queueItem.status === "running" ? [{ label: "Pausa jobb", icon: Pause, onClick: () => pauseItem(queueItem.id) }] : []),
                              ...(queueItem.status === "paused" ? [{ label: "Återuppta jobb", icon: Play, onClick: () => resumeItem(queueItem.id) }] : []),
                              ...(queueItem.status === "queued" || queueItem.status === "running" || queueItem.status === "paused"
                                ? [{ label: "Avbryt jobb", icon: XCircle, danger: true, onClick: () => cancelItem(queueItem.id) }]
                                : []),
                              { divider: true },
                              { label: "Ta bort rad", icon: Trash2, danger: true, onClick: () => removeStaged(file.id) },
                            ]}
                          />
                        )}
                        {!queueItem && (
                          <Button variant="ghost" onClick={() => removeStaged(file.id)}>
                            Ta bort
                          </Button>
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>

        <div className="space-y-4">
          <Card className="p-0">
            <div className="border-b p-5">
              <div className="text-sm font-semibold tracking-tight">Senaste batcher</div>
              <div className="mt-1 text-sm text-muted">Snabb överblick över de senaste körningarna från samma arbetsyta.</div>
            </div>
            <div className="space-y-3 p-5">
              {batchSummary.length === 0 && (
                <div className="rounded-2xl border bg-bg/40 p-4 text-sm text-muted">
                  Inga batcher ännu. När du kör staginglistan skapas en separat batch med egen progress.
                </div>
              )}
              {batchSummary.map((batch) => (
                <div key={batch.batchId} className="rounded-2xl border bg-bg/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{batch.label}</div>
                      <div className="mt-1 text-xs text-muted">
                        {new Date(batch.createdAt).toLocaleTimeString("sv-SE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <Badge tone={batch.active > 0 || batch.paused > 0 ? "warning" : batch.canceled > 0 ? "danger" : "success"}>
                      {batch.active > 0
                        ? `${batch.completed}/${batch.total} klara`
                        : batch.paused > 0
                          ? `${batch.paused} pausade`
                          : batch.canceled > 0
                            ? `${batch.canceled} avbrutna`
                            : `${batch.completed}/${batch.total} klara`}
                    </Badge>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
                    <div className="h-full rounded-full bg-fg transition-all" style={{ width: `${(batch.completed / batch.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card id="catalog" className="p-0">
            <div className="border-b p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="text-sm font-semibold tracking-tight">Verktygskatalog</div>
                  <div className="mt-1 text-sm text-muted">Se snabbt vilka format som stöds och vilket utdataformat varje flöde ger.</div>
                </div>
                <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                  <div className="relative min-w-[220px]">
                    <Filter size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Sök format eller verktyg..." className="pl-9" />
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
        </div>
      </div>
    </div>
  );
}
