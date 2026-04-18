"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Play, Package, Palette, Box } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { coreInventory, pluginInventory, themeInventory, siteName, siteDomain, type InventoryItem } from "../fleet";

type Tab = "core" | "plugins" | "themes";

const tabCfg: Record<Tab, { label: string; Icon: typeof Box; data: InventoryItem[] }> = {
  core: { label: "Core", Icon: Box, data: coreInventory },
  plugins: { label: "Plugins", Icon: Package, data: pluginInventory },
  themes: { label: "Teman", Icon: Palette, data: themeInventory },
};

export default function InventoryPage() {
  const router = useRouter();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("plugins");
  const [query, setQuery] = useState("");
  const [only, setOnly] = useState<"all" | "updates">("all");

  const data = tabCfg[tab].data;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((i) => {
      if (only === "updates" && i.sitesWithUpdate === 0) return false;
      if (!q) return true;
      return i.name.toLowerCase().includes(q) || i.slug.includes(q);
    });
  }, [data, query, only]);

  const totalUpdates = {
    core: coreInventory.reduce((s, i) => s + i.sitesWithUpdate, 0),
    plugins: pluginInventory.reduce((s, i) => s + i.sitesWithUpdate, 0),
    themes: themeInventory.reduce((s, i) => s + i.sitesWithUpdate, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          JetWP
        </Link>
        <div className="mt-3">
          <PageHeader title="Inventory" subtitle="Versioner av WordPress-kärna, plugins och teman över hela flottan" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Core-uppdateringar" value={String(totalUpdates.core)} hint={`${coreInventory.length} entiteter`} />
        <StatCard label="Plugin-uppdateringar" value={String(totalUpdates.plugins)} hint={`${pluginInventory.length} plugins tracked`} />
        <StatCard label="Tema-uppdateringar" value={String(totalUpdates.themes)} hint={`${themeInventory.length} teman tracked`} />
        <StatCard label="Totalt installerade" value={String(pluginInventory.reduce((s, i) => s + i.installed.length, 0) + themeInventory.reduce((s, i) => s + i.installed.length, 0))} />
      </div>

      <div className="flex rounded-xl border bg-bg p-1">
        {(Object.keys(tabCfg) as Tab[]).map((t) => {
          const { Icon, label } = tabCfg[t];
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-surface shadow-soft" : "text-muted hover:text-fg",
              )}
            >
              <Icon size={14} />
              {label}
              <span className="ml-1 rounded-md bg-fg/5 px-1.5 py-0.5 text-[10px]">{tabCfg[t].data.length}</span>
            </button>
          );
        })}
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input className="pl-9" placeholder={`Sök ${tab}…`} value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["all", "updates"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setOnly(f)}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  only === f ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                )}
              >
                {f === "all" ? "Alla" : "Har uppdatering"}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.slug} className="p-0 overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b px-5 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">{item.name}</div>
                  <span className="font-mono text-[11px] text-muted">{item.slug}</span>
                  {item.sitesWithUpdate > 0 && <Badge tone="warning">{item.sitesWithUpdate} behöver update</Badge>}
                </div>
                <div className="mt-0.5 text-[11px] text-muted">
                  Senaste version: <span className="font-mono">{item.latestVersion}</span> · {item.installed.length} installationer
                </div>
              </div>
              {item.sitesWithUpdate > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    const targets = item.installed.filter((i) => i.updateAvailable).map((i) => i.siteId).join(",");
                    toast.success("Uppdatering köad", `${item.sitesWithUpdate} sajter`);
                    router.push(`/jetwp/jobs/new?site=${targets}`);
                  }}
                >
                  <Play size={13} className="mr-1.5" />Kör uppdatering
                </Button>
              )}
            </div>
            <div className="divide-y divide-border/60">
              {item.installed.map((inst) => (
                <div key={inst.siteId} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                  <Link href={`/jetwp/${inst.siteId}`} className="min-w-0 flex-1 hover:text-fg">
                    <div className="truncate font-medium">{siteName(inst.siteId)}</div>
                    <div className="truncate text-[11px] text-muted">{siteDomain(inst.siteId)}</div>
                  </Link>
                  <span className="font-mono text-[12px] tabular-nums">{inst.version}</span>
                  {inst.updateAvailable ? (
                    <Badge tone="warning">→ {item.latestVersion}</Badge>
                  ) : (
                    <Badge tone="success">aktuell</Badge>
                  )}
                  {inst.active !== undefined && (
                    <span className="w-14 text-right text-[11px] text-muted">{inst.active ? "aktiv" : "inaktiv"}</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <Card className="p-10 text-center text-sm text-muted">Inga poster matchade.</Card>}
      </div>
    </div>
  );
}
