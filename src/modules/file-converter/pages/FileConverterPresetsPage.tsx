import { FolderKanban, Layers3, PlayCircle, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge, Table, Td, Th } from "@/components/ui/Table";
import { conversionTools } from "@/modules/file-converter/config";
import { conversionPresets } from "@/modules/file-converter/data";

const targetLabel = {
  "web-assets": "Webbassets",
  "document-export": "Dokument",
  "brand-delivery": "Brand delivery",
} as const;

export function FileConverterPresetsPage() {
  const archived = conversionPresets.filter((preset) => preset.autoArchive).length;
  const averageParallelism = Math.round(
    conversionPresets.reduce((sum, preset) => sum + preset.concurrency, 0) / conversionPresets.length,
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Presets"
        subtitle="Fördefinierade körprofiler för återkommande batcher. Byggt som nästa lager ovanpå samma konfigurationsdrivna verktygskatalog."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Presets" value={String(conversionPresets.length)} hint="Återanvändbara körmallar." />
        <StatCard label="Auto-arkiv" value={String(archived)} hint="Presets som markerar output för arkivering." />
        <StatCard label="Snittparallellism" value={String(averageParallelism)} hint="Förvald samtidighet mellan presets." />
        <StatCard label="Verktyg i omlopp" value={String(conversionTools.length)} hint="Alla presets bygger på samma centrala verktygslista." />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
        {conversionPresets.map((preset) => (
          <Card key={preset.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold tracking-tight">{preset.name}</div>
                <div className="mt-1 text-sm text-muted">{preset.description}</div>
              </div>
              <Badge tone="neutral">{targetLabel[preset.target]}</Badge>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border bg-bg/40 p-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted">Parallellt</div>
                <div className="mt-2 text-lg font-semibold tracking-tight">{preset.concurrency}</div>
              </div>
              <div className="rounded-xl border bg-bg/40 p-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted">Verktyg</div>
                <div className="mt-2 text-lg font-semibold tracking-tight">{preset.toolIds.length}</div>
              </div>
              <div className="rounded-xl border bg-bg/40 p-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted">Arkivering</div>
                <div className="mt-2 text-sm font-semibold tracking-tight">
                  {preset.autoArchive ? "Aktiv" : "Av"}
                </div>
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
              <Button variant="secondary">
                <PlayCircle size={14} strokeWidth={2} className="mr-1.5" />
                Kör preset
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Table>
          <thead>
            <tr>
              <Th>Preset</Th>
              <Th>Mål</Th>
              <Th>Parallellt</Th>
              <Th>Auto-arkiv</Th>
              <Th className="text-right">Verktyg</Th>
            </tr>
          </thead>
          <tbody>
            {conversionPresets.map((preset) => (
              <tr key={preset.id} className="transition-colors hover:bg-bg/50">
                <Td>
                  <div className="font-medium">{preset.name}</div>
                  <div className="mt-1 text-xs text-muted">{preset.id}</div>
                </Td>
                <Td>{targetLabel[preset.target]}</Td>
                <Td>{preset.concurrency}</Td>
                <Td>
                  <Badge tone={preset.autoArchive ? "success" : "neutral"}>
                    {preset.autoArchive ? "Aktiv" : "Av"}
                  </Badge>
                </Td>
                <Td className="text-right font-medium">{preset.toolIds.length}</Td>
              </tr>
            ))}
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
                Syfte
              </div>
              <div className="mt-1 text-muted">
                Presets fungerar som återanvändbara batchprofiler ovanpå de enskilda konverteringsobjekten.
              </div>
            </div>
            <div className="rounded-xl border bg-bg/40 p-3">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck size={14} />
                Utbyggnad
              </div>
              <div className="mt-1 text-muted">
                Nästa steg kan vara preset-redigering, sparade favoriter och koppling mellan presets och historik.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
