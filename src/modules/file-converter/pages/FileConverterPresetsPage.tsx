"use client";

import { type ChangeEvent, useMemo, useRef, useState } from "react";
import {
  Copy,
  FolderKanban,
  Heart,
  Layers3,
  Pencil,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/components/toast/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { RowMenu } from "@/components/ui/RowMenu";
import { StatCard } from "@/components/ui/StatCard";
import { Badge, Table, Td, Th } from "@/components/ui/Table";
import {
  buildResultName,
  conversionTools,
  demoFiles,
  estimateDuration,
  formatBytes,
  getCompatibleTools,
  getFileExtension,
} from "@/modules/file-converter/config";
import { conversionHistoryBatches } from "@/modules/file-converter/data";
import { useConversionQueueEngine } from "@/modules/file-converter/lib/activity";
import { useConversionPresets } from "@/modules/file-converter/lib/presets";
import type { ConversionPreset, QueueItem } from "@/modules/file-converter/types";

const targetLabel = {
  "web-assets": "Webbassets",
  "document-export": "Dokument",
  "brand-delivery": "Brand delivery",
} as const;

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function dedupeFiles(files: Array<{ name: string; size: number }>) {
  const seen = new Set<string>();
  return files.filter((file) => {
    const key = `${file.name}:${file.size}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getPresetMatches(preset: ConversionPreset, files: Array<{ name: string; size: number }>) {
  return files.map((file) => {
    const extension = getFileExtension(file.name);
    const tool = getCompatibleTools(extension).find((entry) => preset.toolIds.includes(entry.id)) ?? null;
    return {
      ...file,
      extension,
      tool,
    };
  });
}

export function FileConverterPresetsPage() {
  const toast = useToast();
  const activity = useConversionQueueEngine();
  const presetsStore = useConversionPresets();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [runPresetId, setRunPresetId] = useState<string | null>(null);
  const [editPresetId, setEditPresetId] = useState<string | null>(null);
  const [runFiles, setRunFiles] = useState<Array<{ name: string; size: number }>>([]);
  const [editDraft, setEditDraft] = useState<ConversionPreset | null>(null);

  const presets = presetsStore.presets;
  const archived = presets.filter((preset) => preset.autoArchive).length;
  const averageParallelism = Math.round(presets.reduce((sum, preset) => sum + preset.concurrency, 0) / Math.max(1, presets.length));
  const favoriteCount = presets.filter((preset) => preset.favorite).length;

  const presetUsage = useMemo(() => {
    const usage = new Map<
      string,
      {
        runs: number;
        lastRunAt: number | null;
      }
    >();

    conversionHistoryBatches.forEach((batch) => {
      if (!batch.presetId) return;
      const current = usage.get(batch.presetId) ?? { runs: 0, lastRunAt: null };
      current.runs += 1;
      current.lastRunAt = Math.max(current.lastRunAt ?? 0, new Date(batch.startedAt).getTime());
      usage.set(batch.presetId, current);
    });

    activity.queueItems.forEach((item) => {
      if (!item.presetId) return;
      const current = usage.get(item.presetId) ?? { runs: 0, lastRunAt: null };
      current.runs += 1;
      current.lastRunAt = Math.max(current.lastRunAt ?? 0, item.createdAt);
      usage.set(item.presetId, current);
    });

    return usage;
  }, [activity.queueItems]);

  const selectedRunPreset = presets.find((preset) => preset.id === runPresetId) ?? null;
  const runMatches = selectedRunPreset ? getPresetMatches(selectedRunPreset, runFiles) : [];
  const runnableCount = runMatches.filter((file) => !!file.tool).length;
  const blockedCount = runMatches.length - runnableCount;

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleNativeFilePick(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).map((file) => ({
      name: file.name,
      size: file.size,
    }));
    setRunFiles((current) => dedupeFiles([...current, ...files]));
    event.target.value = "";
  }

  function openRunDialog(preset: ConversionPreset) {
    setRunPresetId(preset.id);
    setRunFiles([]);
  }

  function openEditDialog(preset: ConversionPreset) {
    setEditPresetId(preset.id);
    setEditDraft({ ...preset });
  }

  function toggleFavorite(presetId: string) {
    presetsStore.replacePresets((current) =>
      current.map((preset) =>
        preset.id === presetId
          ? {
              ...preset,
              favorite: !preset.favorite,
            }
          : preset,
      ),
    );
    const preset = presets.find((entry) => entry.id === presetId);
    toast.success(preset?.favorite ? "Preset borttagen från favoriter" : "Preset sparad som favorit");
  }

  function duplicatePreset(preset: ConversionPreset) {
    const duplicate: ConversionPreset = {
      ...preset,
      id: makeId("preset"),
      name: `${preset.name} kopia`,
      favorite: false,
    };
    presetsStore.replacePresets((current) => [duplicate, ...current]);
    toast.success("Preset duplicerad", duplicate.name);
  }

  function saveEditPreset() {
    if (!editDraft) return;
    presetsStore.replacePresets((current) =>
      current.map((preset) => (preset.id === editDraft.id ? editDraft : preset)),
    );
    toast.success("Preset uppdaterad", editDraft.name);
    setEditPresetId(null);
    setEditDraft(null);
  }

  function runPreset() {
    if (!selectedRunPreset) return;
    const matches = getPresetMatches(selectedRunPreset, runFiles);
    const runnable = matches.filter((file): file is typeof file & { tool: NonNullable<typeof file.tool> } => !!file.tool);
    if (runnable.length === 0) {
      toast.info("Inga filer matchar presetet", "Lägg till filer som stöds av presetets verktyg.");
      return;
    }

    const batchId = makeId("batch");
    const createdAt = Date.now();
    const batchLabel = `${selectedRunPreset.name} • presetkörning`;
    const items: QueueItem[] = runnable.map((file) => ({
      id: makeId("queue"),
      batchId,
      batchLabel,
      batchConcurrency: selectedRunPreset.concurrency,
      presetId: selectedRunPreset.id,
      presetName: selectedRunPreset.name,
      fileName: file.name,
      size: file.size,
      sourceFormat: file.extension!,
      toolId: file.tool.id,
      status: "queued",
      progress: 0,
      createdAt,
      durationMs: estimateDuration(file.size, file.tool),
      resultName: buildResultName(file.name, file.tool.outputFormat),
    }));

    activity.replaceQueueItems((current) => [...items, ...current]);
    toast.success(
      `${selectedRunPreset.name} kölagd`,
      blockedCount > 0 ? `${runnable.length} filer startar, ${blockedCount} matchade inte presetet.` : `${runnable.length} filer startar i presetkön.`,
    );
    setRunPresetId(null);
    setRunFiles([]);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Presets"
        subtitle="Spara återkommande körningar som profiler, starta dem direkt med nya filer och följ hur ofta de används."
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp,.pdf,.heic,.svg"
        className="hidden"
        onChange={handleNativeFilePick}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Presets" value={String(presets.length)} hint="Återanvändbara körmallar." />
        <StatCard label="Favoriter" value={String(favoriteCount)} hint="Snabbval för återkommande körningar." />
        <StatCard label="Auto-arkiv" value={String(archived)} hint="Presets som markerar output för arkivering." />
        <StatCard label="Snittparallellism" value={String(averageParallelism)} hint="Förvald samtidighet mellan presets." />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
        {presets.map((preset) => {
          const usage = presetUsage.get(preset.id);
          return (
            <Card key={preset.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-base font-semibold tracking-tight">{preset.name}</div>
                    {preset.favorite && (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                        <Heart size={12} fill="currentColor" />
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-muted">{preset.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="neutral">{targetLabel[preset.target]}</Badge>
                  <RowMenu
                    items={[
                      { label: "Kör preset", icon: PlayCircle, onClick: () => openRunDialog(preset) },
                      { label: "Redigera preset", icon: Pencil, onClick: () => openEditDialog(preset) },
                      { label: preset.favorite ? "Ta bort favorit" : "Markera som favorit", icon: Heart, onClick: () => toggleFavorite(preset.id) },
                      { label: "Duplicera preset", icon: Copy, onClick: () => duplicatePreset(preset) },
                    ]}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <div className="rounded-xl border bg-bg/40 p-3">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted">Parallellt</div>
                  <div className="mt-2 text-lg font-semibold tracking-tight">{preset.concurrency}</div>
                </div>
                <div className="rounded-xl border bg-bg/40 p-3">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted">Verktyg</div>
                  <div className="mt-2 text-lg font-semibold tracking-tight">{preset.toolIds.length}</div>
                </div>
                <div className="rounded-xl border bg-bg/40 p-3">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted">Senast körd</div>
                  <div className="mt-2 text-sm font-semibold tracking-tight">
                    {usage?.lastRunAt
                      ? new Date(usage.lastRunAt).toLocaleString("sv-SE", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
                      : "Inte körd än"}
                  </div>
                </div>
                <div className="rounded-xl border bg-bg/40 p-3">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted">Körningar</div>
                  <div className="mt-2 text-lg font-semibold tracking-tight">{usage?.runs ?? 0}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {preset.toolIds.map((toolId) => (
                  <span key={toolId} className="rounded-full border bg-surface px-2.5 py-1 text-xs font-medium">
                    {conversionTools.find((tool) => tool.id === toolId)?.title ?? toolId}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => openRunDialog(preset)}>
                  <PlayCircle size={14} strokeWidth={2} className="mr-1.5" />
                  Kör preset
                </Button>
                <Button variant="secondary" onClick={() => openEditDialog(preset)}>
                  <Pencil size={14} strokeWidth={2} className="mr-1.5" />
                  Redigera
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Table>
          <thead>
            <tr>
              <Th>Preset</Th>
              <Th>Mål</Th>
              <Th>Parallellt</Th>
              <Th>Senast körd</Th>
              <Th className="text-right">Körningar</Th>
            </tr>
          </thead>
          <tbody>
            {presets.map((preset) => {
              const usage = presetUsage.get(preset.id);
              return (
                <tr key={preset.id} className="transition-colors hover:bg-bg/50">
                  <Td>
                    <div className="font-medium">{preset.name}</div>
                    <div className="mt-1 text-xs text-muted">{preset.id}</div>
                  </Td>
                  <Td>{targetLabel[preset.target]}</Td>
                  <Td>{preset.concurrency}</Td>
                  <Td className="text-xs text-muted">
                    {usage?.lastRunAt
                      ? new Date(usage.lastRunAt).toLocaleString("sv-SE", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
                      : "Inte körd"}
                  </Td>
                  <Td className="text-right font-medium">{usage?.runs ?? 0}</Td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <FolderKanban size={15} />
            Presetmodell
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl border bg-bg/40 p-3">
              <div className="flex items-center gap-2 font-medium">
                <Layers3 size={14} />
                Så används presets
              </div>
              <div className="mt-1 text-muted">
                Välj filer, starta körningen direkt och låt historiken visa vilken profil batchen kom från.
              </div>
            </div>
            <div className="rounded-xl border bg-bg/40 p-3">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck size={14} />
                Hantering
              </div>
              <div className="mt-1 text-muted">
                Markera favoriter, uppdatera namn och kapacitet eller duplicera en profil när ett nytt arbetsflöde behöver en variant.
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Dialog
        open={!!selectedRunPreset}
        onClose={() => {
          setRunPresetId(null);
          setRunFiles([]);
        }}
        title={selectedRunPreset ? `Kör ${selectedRunPreset.name}` : "Kör preset"}
        description={
          selectedRunPreset
            ? `Presetet använder ${selectedRunPreset.toolIds.length} verktyg och kör upp till ${selectedRunPreset.concurrency} jobb samtidigt.`
            : undefined
        }
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRunPresetId(null)}>
              Avbryt
            </Button>
            <Button onClick={runPreset} disabled={!selectedRunPreset || runnableCount === 0}>
              Starta presetkörning
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setRunFiles((current) => dedupeFiles([...current, ...demoFiles]))}>
              <Sparkles size={14} strokeWidth={2} className="mr-1.5" />
              Ladda demo-filer
            </Button>
            <Button variant="secondary" onClick={openFilePicker}>
              <Upload size={14} strokeWidth={2} className="mr-1.5" />
              Välj filer
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-bg/40 p-3">
              <div className="text-xs font-medium uppercase tracking-wider text-muted">Filer i körningen</div>
              <div className="mt-2 text-lg font-semibold tracking-tight">{runFiles.length}</div>
            </div>
            <div className="rounded-xl border bg-bg/40 p-3">
              <div className="text-xs font-medium uppercase tracking-wider text-muted">Matchar preset</div>
              <div className="mt-2 text-lg font-semibold tracking-tight">{runnableCount}</div>
            </div>
            <div className="rounded-xl border bg-bg/40 p-3">
              <div className="text-xs font-medium uppercase tracking-wider text-muted">Blockerade</div>
              <div className="mt-2 text-lg font-semibold tracking-tight">{blockedCount}</div>
            </div>
          </div>

          <Table>
            <thead>
              <tr>
                <Th>Fil</Th>
                <Th>Storlek</Th>
                <Th>Matchning</Th>
                <Th className="text-right">Preset-verktyg</Th>
              </tr>
            </thead>
            <tbody>
              {runMatches.length === 0 && (
                <tr>
                  <Td colSpan={4} className="py-8 text-center text-sm text-muted">
                    Lägg till filer för att se vilka som kan köras i presetet.
                  </Td>
                </tr>
              )}
              {runMatches.map((file) => (
                <tr key={`${file.name}-${file.size}`} className="transition-colors hover:bg-bg/50">
                  <Td>
                    <div className="font-medium">{file.name}</div>
                    <div className="mt-1 text-xs text-muted">{file.extension ? file.extension.toUpperCase() : "Okänd filtyp"}</div>
                  </Td>
                  <Td className="text-xs text-muted">{formatBytes(file.size)}</Td>
                  <Td>
                    <Badge tone={file.tool ? "success" : "warning"}>{file.tool ? "Matchar" : "Saknar matchning"}</Badge>
                  </Td>
                  <Td className="text-right text-sm">{file.tool?.title ?? "Presetet saknar stöd för filtypen"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Dialog>

      <Dialog
        open={!!editPresetId && !!editDraft}
        onClose={() => {
          setEditPresetId(null);
          setEditDraft(null);
        }}
        title={editDraft ? `Redigera ${editDraft.name}` : "Redigera preset"}
        description="Justera metadata och körprofil utan att ändra själva verktygskatalogen."
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditPresetId(null)}>
              Avbryt
            </Button>
            <Button onClick={saveEditPreset} disabled={!editDraft}>
              Spara preset
            </Button>
          </>
        }
      >
        {editDraft && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium">Namn</label>
              <Input value={editDraft.name} onChange={(event) => setEditDraft({ ...editDraft, name: event.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium">Beskrivning</label>
              <Input value={editDraft.description} onChange={(event) => setEditDraft({ ...editDraft, description: event.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium">Parallella jobb</label>
                <select
                  value={editDraft.concurrency}
                  onChange={(event) => setEditDraft({ ...editDraft, concurrency: Number(event.target.value) })}
                  className="h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
                >
                  {[1, 2, 4, 6].map((value) => (
                    <option key={value} value={value}>
                      {value} samtidiga jobb
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium">Mål</label>
                <select
                  value={editDraft.target}
                  onChange={(event) => setEditDraft({ ...editDraft, target: event.target.value as ConversionPreset["target"] })}
                  className="h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
                >
                  {Object.entries(targetLabel).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 rounded-xl border bg-bg/40 px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={editDraft.autoArchive}
                onChange={(event) => setEditDraft({ ...editDraft, autoArchive: event.target.checked })}
              />
              Auto-arkivera output när presetet körs
            </label>
            <label className="flex items-center gap-2 rounded-xl border bg-bg/40 px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={!!editDraft.favorite}
                onChange={(event) => setEditDraft({ ...editDraft, favorite: event.target.checked })}
              />
              Markera som favorit
            </label>
          </div>
        )}
      </Dialog>
    </div>
  );
}
