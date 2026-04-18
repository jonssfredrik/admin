"use client";

import Link from "next/link";
import {
  RefreshCw,
  Plus,
  Activity,
  ArrowRight,
  ServerCrash,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Clock,
  XCircle,
  ShieldAlert,
  Package,
  HeartPulse,
  Cpu,
} from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { AddSiteDialog } from "./AddSiteDialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { sites } from "./data";
import { jobs, alerts, pluginInventory, themeInventory, coreInventory } from "./fleet";

export default function JetWPOverviewPage() {
  const toast = useToast();
  const [addOpen, setAddOpen] = useState(false);

  const total = sites.length;
  const online = sites.filter((s) => s.status === "online").length;
  const warning = sites.filter((s) => s.status === "warning" || s.heartbeatStale).length;
  const offline = sites.filter((s) => s.status === "offline").length;
  const staleHeartbeats = sites.filter((s) => s.heartbeatStale).length;

  const pendingJobs = jobs.filter((j) => j.status === "pending").length;
  const runningJobs = jobs.filter((j) => j.status === "running" || j.status === "claimed").length;
  const failedJobs = jobs.filter((j) => j.status === "failed").length;

  const openAlerts = alerts.filter((a) => a.status === "open");
  const criticalAlerts = openAlerts.filter((a) => a.severity === "critical").length;

  const coreUpdates = coreInventory.reduce((s, i) => s + i.sitesWithUpdate, 0);
  const pluginUpdates = pluginInventory.reduce((s, i) => s + i.sitesWithUpdate, 0);
  const themeUpdates = themeInventory.reduce((s, i) => s + i.sitesWithUpdate, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 items-center gap-1.5 rounded-md bg-fg px-2 text-[11px] font-bold tracking-tight text-bg">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              JetWP
            </div>
            <span className="text-xs text-muted">Managed WordPress · control plane</span>
          </div>
          <PageHeader title="Översikt" subtitle="Central kontrollpanel för hela flottan av WordPress-sajter" />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => toast.info("Synkroniserar", "Hämtar heartbeat från alla agenter…")}>
            <RefreshCw size={14} strokeWidth={2} className="mr-1.5" />
            Synka flottan
          </Button>
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={14} strokeWidth={2} className="mr-1.5" />
            Lägg till sajt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Sajter" value={`${online}/${total}`} hint={`${staleHeartbeats} stale heartbeats`} />
        <StatCard label="Öppna alerts" value={String(openAlerts.length)} hint={`${criticalAlerts} kritiska`} />
        <StatCard label="Aktiva jobb" value={String(runningJobs + pendingJobs)} hint={`${runningJobs} körs · ${pendingJobs} väntar`} />
        <StatCard label="Uppdateringar" value={String(coreUpdates + pluginUpdates + themeUpdates)} hint={`core ${coreUpdates} · plugin ${pluginUpdates} · tema ${themeUpdates}`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Flottstatus</h2>
              <p className="mt-0.5 text-xs text-muted">Heartbeat och health per sajt</p>
            </div>
            <Link href="/jetwp/sites" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
              Öppna alla sajter <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-1.5">
            {sites.map((s) => (
              <SiteRow key={s.id} site={s} />
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
                <HeartPulse size={13} className="text-muted" />
                Agent heartbeat
              </h2>
              <Link href="/jetwp/health" className="text-xs text-muted hover:text-fg">Detaljer →</Link>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted">
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                  Rapporterar
                </span>
                <span className="font-semibold tabular-nums">{total - staleHeartbeats}/{total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted">
                  <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400" />
                  Stale &gt; 30 min
                </span>
                <span className="font-semibold tabular-nums">{staleHeartbeats}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted">
                  <ServerCrash size={13} className="text-red-600 dark:text-red-400" />
                  Offline
                </span>
                <span className="font-semibold tabular-nums">{offline}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
                <Cpu size={13} className="text-muted" />
                Jobbkö
              </h2>
              <Link href="/jetwp/jobs" className="text-xs text-muted hover:text-fg">Detaljer →</Link>
            </div>
            <div className="space-y-2.5 text-sm">
              <QueueRow icon={Clock} tone="text-muted" label="Väntande" value={pendingJobs} />
              <QueueRow icon={PlayCircle} tone="text-blue-600 dark:text-blue-400" label="Körs" value={runningJobs} />
              <QueueRow icon={XCircle} tone="text-red-600 dark:text-red-400" label="Misslyckade" value={failedJobs} />
              <QueueRow icon={CheckCircle2} tone="text-emerald-600 dark:text-emerald-400" label="Färdiga (24h)" value={jobs.filter((j) => j.status === "completed").length} />
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
              <ShieldAlert size={13} className="text-muted" />
              Öppna alerts
            </h2>
            <Link href="/jetwp/alerts" className="text-xs text-muted hover:text-fg">Visa alla →</Link>
          </div>
          <div className="divide-y divide-border/60">
            {openAlerts.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-start gap-3 px-5 py-3">
                <span
                  className={clsx(
                    "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                    a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{a.title}</div>
                  <div className="truncate text-xs text-muted">{a.description}</div>
                </div>
                <span className="shrink-0 text-[11px] tabular-nums text-muted">{a.createdAt}</span>
              </div>
            ))}
            {openAlerts.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-muted">Inga öppna alerts just nu</div>
            )}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
              <Package size={13} className="text-muted" />
              Inventory highlights
            </h2>
            <Link href="/jetwp/inventory" className="text-xs text-muted hover:text-fg">Detaljer →</Link>
          </div>
          <div className="divide-y divide-border/60">
            <InventoryRow label="WordPress Core" updates={coreUpdates} total={total} latest={coreInventory[0].latestVersion} />
            {pluginInventory.filter((p) => p.sitesWithUpdate > 0).slice(0, 3).map((p) => (
              <InventoryRow key={p.slug} label={p.name} updates={p.sitesWithUpdate} total={p.installed.length} latest={p.latestVersion} />
            ))}
            {themeInventory.filter((t) => t.sitesWithUpdate > 0).slice(0, 2).map((t) => (
              <InventoryRow key={t.slug} label={`Tema · ${t.name}`} updates={t.sitesWithUpdate} total={t.installed.length} latest={t.latestVersion} />
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
            <Activity size={13} className="text-muted" />
            Senaste aktivitet
          </h2>
          <Link href="/jetwp/activity" className="text-xs text-muted hover:text-fg">Visa alla →</Link>
        </div>
        <div className="divide-y divide-border/60">
          {jobs.slice(0, 6).map((j) => (
            <div key={j.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
              <span className={clsx(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                j.status === "completed" ? "bg-emerald-500" :
                j.status === "failed" ? "bg-red-500" :
                j.status === "running" || j.status === "claimed" ? "bg-blue-500" :
                j.status === "cancelled" ? "bg-fg/40" : "bg-amber-500",
              )} />
              <span className="font-mono text-[11px] text-muted">{j.id}</span>
              <span className="min-w-0 flex-1 truncate">{j.type}</span>
              <Link href={`/jetwp/${j.siteId}`} className="shrink-0 text-xs text-muted hover:text-fg">{sites.find((s) => s.id === j.siteId)?.domain}</Link>
              <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted">{j.createdAt}</span>
            </div>
          ))}
        </div>
      </Card>

      <AddSiteDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

function SiteRow({ site }: { site: typeof sites[number] }) {
  const statusDot =
    site.status === "online" ? "bg-emerald-500" :
    site.status === "warning" ? "bg-amber-500" :
    site.status === "maintenance" ? "bg-blue-500" : "bg-red-500";
  return (
    <Link
      href={`/jetwp/${site.id}`}
      className="flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-bg"
    >
      <span className={clsx("h-2 w-2 shrink-0 rounded-full", statusDot)} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{site.name}</span>
          {site.heartbeatStale && <Badge tone="warning">stale</Badge>}
          {site.failingJobs > 0 && <Badge tone="danger">{site.failingJobs} failed</Badge>}
          {site.pendingJobs > 0 && <Badge tone="neutral">{site.pendingJobs} pending</Badge>}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
          <span className="truncate">{site.domain}</span>
          <span>·</span>
          <span className="font-mono">WP {site.wp}</span>
          <span>·</span>
          <span>heartbeat {site.lastHeartbeat}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <HealthBar score={site.healthScore} />
        <span className="w-8 text-right font-mono text-[11px] tabular-nums text-muted">{site.healthScore}</span>
      </div>
    </Link>
  );
}

function HealthBar({ score }: { score: number }) {
  const tone = score > 80 ? "bg-emerald-500" : score > 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="h-1 w-16 overflow-hidden rounded-full bg-fg/5">
      <div className={clsx("h-full", tone)} style={{ width: `${score}%` }} />
    </div>
  );
}

function QueueRow({ icon: Icon, tone, label, value }: { icon: typeof Clock; tone: string; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-muted">
        <Icon size={13} className={tone} />
        {label}
      </span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function InventoryRow({ label, updates, total, latest }: { label: string; updates: number; total: number; latest: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{label}</div>
        <div className="text-[11px] text-muted">Senaste version: <span className="font-mono">{latest}</span></div>
      </div>
      {updates > 0 ? (
        <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
          {updates}/{total} behöver update
        </span>
      ) : (
        <span className="text-[11px] text-muted">Alla aktuella</span>
      )}
    </div>
  );
}
