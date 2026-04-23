"use client";

import { useState } from "react";
import { Pause, Play, RefreshCw, Search } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/toast/ToastProvider";
import { defaultPlugins, type Plugin } from "@/modules/mwp/[id]/data";

interface PluginsTabProps {
  updatesAvailable: number;
}

type StatusFilter = "all" | "active" | "inactive" | "updates";

const statusFilterLabels: Record<StatusFilter, string> = {
  all: "Alla",
  active: "Aktiva",
  inactive: "Inaktiva",
  updates: "Behöver uppdateras",
};

export function PluginsTab({ updatesAvailable }: PluginsTabProps) {
  const [list, setList] = useState<Plugin[]>(() => defaultPlugins(updatesAvailable));
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [updateAllOpen, setUpdateAllOpen] = useState(false);
  const toast = useToast();

  const filtered = list.filter((plugin) => {
    const q = query.toLowerCase();
    if (q && !plugin.name.toLowerCase().includes(q) && !plugin.author.toLowerCase().includes(q)) return false;
    if (statusFilter === "active") return plugin.active;
    if (statusFilter === "inactive") return !plugin.active;
    if (statusFilter === "updates") return plugin.updateAvailable;
    return true;
  });
  const updateCount = list.filter((plugin) => plugin.updateAvailable).length;

  const toggle = (slug: string) => {
    setList((current) => current.map((plugin) => plugin.slug === slug ? { ...plugin, active: !plugin.active } : plugin));
    const plugin = list.find((entry) => entry.slug === slug);
    if (plugin) toast.success(plugin.active ? `${plugin.name} stoppat` : `${plugin.name} aktiverat`);
  };

  const updateOne = (slug: string) => {
    setList((current) => current.map((plugin) => plugin.slug === slug ? { ...plugin, version: plugin.latestVersion, updateAvailable: false } : plugin));
    toast.success("Plugin uppdaterat");
  };

  const updateAll = () => {
    setList((current) => current.map((plugin) => ({ ...plugin, version: plugin.latestVersion, updateAvailable: false })));
    toast.success("Alla plugin uppdaterade", `${updateCount} uppdateringar kördes`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-surface p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input className="pl-9" placeholder="Sök plugin..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(Object.keys(statusFilterLabels) as StatusFilter[]).map((key) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={clsx("rounded-md px-2.5 py-1 text-xs font-medium transition-colors", statusFilter === key ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg")}
              >
                {statusFilterLabels[key]}
              </button>
            ))}
          </div>
          {updateCount > 0 && (
            <Button onClick={() => setUpdateAllOpen(true)}>
              <RefreshCw size={14} className="mr-1.5" />
              Uppdatera alla ({updateCount})
            </Button>
          )}
        </div>
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Plugin</Th>
            <Th>Version</Th>
            <Th>Status</Th>
            <Th className="w-40 text-right">Åtgärder</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((plugin) => (
            <tr key={plugin.slug} className="transition-colors hover:bg-bg/50">
              <Td>
                <div>
                  <div className="font-medium">{plugin.name}</div>
                  <div className="text-xs text-muted">{plugin.author}</div>
                </div>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs tabular-nums">{plugin.version}</span>
                  {plugin.updateAvailable && <Badge tone="warning">→ {plugin.latestVersion}</Badge>}
                </div>
              </Td>
              <Td>
                <Badge tone={plugin.active ? "success" : "neutral"}>{plugin.active ? "Aktiv" : "Inaktiv"}</Badge>
              </Td>
              <Td className="text-right">
                <div className="inline-flex items-center gap-1">
                  {plugin.updateAvailable && (
                    <button onClick={() => updateOne(plugin.slug)} className="inline-flex h-7 items-center rounded-md border bg-surface px-2 text-xs font-medium hover:bg-bg">
                      <RefreshCw size={11} className="mr-1" />
                      Uppdatera
                    </button>
                  )}
                  <button onClick={() => toggle(plugin.slug)} className="inline-flex h-7 items-center rounded-md border bg-surface px-2 text-xs font-medium hover:bg-bg">
                    {plugin.active ? <Pause size={11} className="mr-1" /> : <Play size={11} className="mr-1" />}
                    {plugin.active ? "Stoppa" : "Starta"}
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ConfirmDialog
        open={updateAllOpen}
        onClose={() => setUpdateAllOpen(false)}
        onConfirm={updateAll}
        title={`Uppdatera ${updateCount} plugin?`}
        description="Backup rekommenderas innan uppdateringen körs."
        confirmLabel="Uppdatera alla"
      />
    </div>
  );
}
