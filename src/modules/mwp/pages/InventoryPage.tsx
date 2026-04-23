"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Box, FileText, Package, Palette, Play, Search } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { coreInventory, pluginInventory, siteDomain, siteName, themeInventory, type InventoryItem } from "@/modules/mwp/data";
import { getInventoryRows, getInventoryStats, type InventoryFilter, type InventoryTab } from "@/modules/mwp/selectors/inventory";

const tabCfg: Record<InventoryTab, { label: string; Icon: typeof Box; data: InventoryItem[] }> = {
  core: { label: "Kärna", Icon: Box, data: coreInventory },
  plugins: { label: "Plugin", Icon: Package, data: pluginInventory },
  themes: { label: "Teman", Icon: Palette, data: themeInventory },
};

export function InventoryPage() {
  const router = useRouter();
  const toast = useToast();
  const [tab, setTab] = useState<InventoryTab>("plugins");
  const [query, setQuery] = useState("");
  const [only, setOnly] = useState<InventoryFilter>("all");

  const data = tabCfg[tab].data;
  const filtered = useMemo(() => getInventoryRows(data, query, only), [data, only, query]);
  const stats = useMemo(() => getInventoryStats(coreInventory, pluginInventory, themeInventory), []);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/mwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          MWP
        </Link>
        <div className="mt-3">
          <PageHeader
            title="Inventering"
            subtitle="Versioner av kärna, plugin och teman över hela den hanterade WordPress-flottan."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Kärnuppdateringar" value={String(stats.coreUpdates)} />
        <StatCard label="Pluginuppdateringar" value={String(stats.pluginUpdates)} />
        <StatCard label="Temauppdateringar" value={String(stats.themeUpdates)} />
        <StatCard label="Installationer" value={String(stats.installations)} />
      </div>

      <div className="flex rounded-xl border bg-bg p-1">
        {(Object.keys(tabCfg) as InventoryTab[]).map((key) => {
          const { Icon, label } = tabCfg[key];
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={clsx(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-surface shadow-soft" : "text-muted hover:text-fg",
              )}
            >
              <Icon size={14} />
              {label}
              <span className="ml-1 rounded-md bg-fg/5 px-1.5 py-0.5 text-[10px]">{tabCfg[key].data.length}</span>
            </button>
          );
        })}
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              className="pl-9"
              placeholder={`Sök ${tabCfg[tab].label.toLowerCase()}...`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["all", "updates"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setOnly(filter)}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  only === filter ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                )}
              >
                {filter === "all" ? "Alla" : "Behöver uppdateras"}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map((item) => (
          <InventoryCard
            key={item.slug}
            item={item}
            onQueueUpdate={(targets) => {
              toast.success("Uppdatering köad", `${targets.length} sajter`);
              router.push(`/mwp/jobs/new?site=${targets.join(",")}`);
            }}
          />
        ))}
        {filtered.length === 0 && (
          <Card className="p-10 text-center text-sm text-muted">Inga inventeringsrader matchade filtret.</Card>
        )}
      </div>
    </div>
  );
}

function InventoryCard({ item, onQueueUpdate }: { item: InventoryItem; onQueueUpdate: (targets: string[]) => void }) {
  const router = useRouter();
  const toast = useToast();
  const targets = item.installed.filter((entry) => entry.updateAvailable).map((entry) => entry.siteId);

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between gap-4 border-b px-5 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">{item.name}</div>
            <span className="font-mono text-[11px] text-muted">{item.slug}</span>
            {item.sitesWithUpdate > 0 && <Badge tone="warning">{item.sitesWithUpdate} behöver uppdateras</Badge>}
          </div>
          <div className="mt-0.5 text-[11px] text-muted">
            Senaste version <span className="font-mono">{item.latestVersion}</span> · {item.installed.length} installationer
          </div>
          <div className="mt-1 text-[11px] text-muted">
            Versionsnoteringar: kompatibilitetsförbättringar, säkrare cachehantering och adminpolish för {item.latestVersion}.
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              toast.info(`${item.name} ${item.latestVersion}`, "Kompatibilitetsförbättringar, säkrare cachehantering och adminpolish.")
            }
          >
            <FileText size={13} className="mr-1.5" />
            Ändringslogg
          </Button>
          {targets.length > 0 && (
            <Button variant="secondary" onClick={() => onQueueUpdate(targets)}>
              <Play size={13} className="mr-1.5" />
              Köa uppdatering
            </Button>
          )}
        </div>
      </div>
      <div className="divide-y divide-border/60">
        {item.installed.map((install) => (
          <div key={install.siteId} className="flex items-center gap-3 px-5 py-2.5 text-sm">
            <Link href={`/mwp/${install.siteId}`} className="min-w-0 flex-1 hover:text-fg">
              <div className="truncate font-medium">{siteName(install.siteId)}</div>
              <div className="truncate text-[11px] text-muted">{siteDomain(install.siteId)}</div>
            </Link>
            <span className="font-mono text-[12px] tabular-nums">{install.version}</span>
            {install.updateAvailable ? <Badge tone="warning">→ {item.latestVersion}</Badge> : <Badge tone="success">aktuell</Badge>}
            {install.active !== undefined && (
              <span className="w-14 text-right text-[11px] text-muted">{install.active ? "aktiv" : "inaktiv"}</span>
            )}
            {install.updateAvailable && (
              <button
                onClick={() => router.push(`/mwp/jobs/new?site=${install.siteId}`)}
                className="rounded-md border bg-surface px-2 py-1 text-[11px] font-medium hover:bg-bg"
              >
                Uppdateringsjobb
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
