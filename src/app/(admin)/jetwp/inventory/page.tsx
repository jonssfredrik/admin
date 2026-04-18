"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Play, Package, Palette, Box, FileText } from "lucide-react";
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
  themes: { label: "Themes", Icon: Palette, data: themeInventory },
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
    return data.filter((item) => {
      if (only === "updates" && item.sitesWithUpdate === 0) return false;
      if (!q) return true;
      return item.name.toLowerCase().includes(q) || item.slug.includes(q);
    });
  }, [data, query, only]);

  const totalUpdates = {
    core: coreInventory.reduce((sum, item) => sum + item.sitesWithUpdate, 0),
    plugins: pluginInventory.reduce((sum, item) => sum + item.sitesWithUpdate, 0),
    themes: themeInventory.reduce((sum, item) => sum + item.sitesWithUpdate, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          JetWP
        </Link>
        <div className="mt-3">
          <PageHeader title="Inventory" subtitle="Versions of core, plugins and themes across the managed WordPress fleet." />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Core updates" value={String(totalUpdates.core)} />
        <StatCard label="Plugin updates" value={String(totalUpdates.plugins)} />
        <StatCard label="Theme updates" value={String(totalUpdates.themes)} />
        <StatCard label="Installations" value={String(pluginInventory.reduce((sum, item) => sum + item.installed.length, 0) + themeInventory.reduce((sum, item) => sum + item.installed.length, 0))} />
      </div>

      <div className="flex rounded-xl border bg-bg p-1">
        {(Object.keys(tabCfg) as Tab[]).map((key) => {
          const { Icon, label } = tabCfg[key];
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={clsx("flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? "bg-surface shadow-soft" : "text-muted hover:text-fg")}
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
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input className="pl-9" placeholder={`Search ${tab}...`} value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["all", "updates"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setOnly(filter)}
                className={clsx("rounded-md px-2.5 py-1 text-xs font-medium transition-colors", only === filter ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg")}
              >
                {filter === "all" ? "All" : "Needs update"}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map((item) => (
          <InventoryCard key={item.slug} item={item} onQueueUpdate={(targets) => {
            toast.success("Update queued", `${targets.length} sites`);
            router.push(`/jetwp/jobs/new?site=${targets.join(",")}`);
          }} />
        ))}
        {filtered.length === 0 && <Card className="p-10 text-center text-sm text-muted">No inventory rows matched the filters.</Card>}
      </div>
    </div>
  );
}

function InventoryCard({ item, onQueueUpdate }: { item: InventoryItem; onQueueUpdate: (targets: string[]) => void }) {
  const router = useRouter();
  const targets = item.installed.filter((entry) => entry.updateAvailable).map((entry) => entry.siteId);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b px-5 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">{item.name}</div>
            <span className="font-mono text-[11px] text-muted">{item.slug}</span>
            {item.sitesWithUpdate > 0 && <Badge tone="warning">{item.sitesWithUpdate} need updates</Badge>}
          </div>
          <div className="mt-0.5 text-[11px] text-muted">
            Latest version <span className="font-mono">{item.latestVersion}</span> · {item.installed.length} installs
          </div>
          <div className="mt-1 text-[11px] text-muted">
            Release notes: compatibility improvements, cache safety fixes and admin UI polish for {item.latestVersion}.
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.push(`/jetwp/bulk-update`)}>
            <FileText size={13} className="mr-1.5" />
            Changelog
          </Button>
          {targets.length > 0 && (
            <Button variant="secondary" onClick={() => onQueueUpdate(targets)}>
              <Play size={13} className="mr-1.5" />
              Queue update
            </Button>
          )}
        </div>
      </div>
      <div className="divide-y divide-border/60">
        {item.installed.map((install) => (
          <div key={install.siteId} className="flex items-center gap-3 px-5 py-2.5 text-sm">
            <Link href={`/jetwp/${install.siteId}`} className="min-w-0 flex-1 hover:text-fg">
              <div className="truncate font-medium">{siteName(install.siteId)}</div>
              <div className="truncate text-[11px] text-muted">{siteDomain(install.siteId)}</div>
            </Link>
            <span className="font-mono text-[12px] tabular-nums">{install.version}</span>
            {install.updateAvailable ? <Badge tone="warning">→ {item.latestVersion}</Badge> : <Badge tone="success">current</Badge>}
            {install.active !== undefined && <span className="w-14 text-right text-[11px] text-muted">{install.active ? "active" : "inactive"}</span>}
            {install.updateAvailable && (
              <button onClick={() => router.push(`/jetwp/jobs/new?site=${install.siteId}`)} className="rounded-md border bg-surface px-2 py-1 text-[11px] font-medium hover:bg-bg">
                Update job
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
