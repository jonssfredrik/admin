"use client";

import Link from "next/link";
import {
  RefreshCw,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Clock,
  XCircle,
  ShieldAlert,
  Package,
  Workflow,
  Bot,
  FileText,
} from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { AddSiteDialog } from "@/modules/jetwp/components/AddSiteDialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { sites } from "@/modules/jetwp/data/core";
import { jobs, alerts, pluginInventory, themeInventory, coreInventory } from "@/modules/jetwp/fleet/core";
import { getOverviewInventoryHighlights, getOverviewStats } from "@/modules/jetwp/selectors/overview";
import { templateList } from "@/modules/jetwp/workflow/templates";
import { agentRecords } from "@/modules/jetwp/extended-data";

export default function JetWPOverviewPage() {
  const toast = useToast();
  const [addOpen, setAddOpen] = useState(false);

  const {
    total,
    online,
    staleHeartbeats,
    pendingJobs,
    runningJobs,
    failedJobs,
    openAlerts,
    criticalAlerts,
    coreUpdates,
    pluginUpdates,
    themeUpdates,
  } = getOverviewStats(sites, jobs, alerts, coreInventory, pluginInventory, themeInventory);

  const inventoryHighlights = getOverviewInventoryHighlights(coreInventory, pluginInventory, themeInventory, total);
  const activeWorkflows = templateList.filter((workflow) => workflow.status === "active").length;
  const healthyAgents = agentRecords.filter((agent) => agent.status === "healthy").length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 items-center gap-1.5 rounded-md bg-fg px-2 text-[11px] font-bold tracking-tight text-bg">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              JetWP
            </div>
            <span className="text-xs text-muted">WordPress-flotta · agentstyrning</span>
          </div>
          <PageHeader title="Översikt" subtitle="Operativ vy för WordPress-sajter, agenter, jobb och larm" />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => toast.info("Synkroniserar", "Hämtar aktuell status från sajter, jobb och agenter...")}>
            <RefreshCw size={14} strokeWidth={2} className="mr-1.5" />
            Synka JetWP
          </Button>
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={14} strokeWidth={2} className="mr-1.5" />
            Lägg till sajt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Sajter" value={`${online}/${total}`} hint={`${staleHeartbeats} fördröjda agentincheckningar`} />
        <StatCard label="Öppna larm" value={String(openAlerts.length)} hint={`${criticalAlerts} kritiska`} />
        <StatCard label="Aktiva jobb" value={String(runningJobs + pendingJobs)} hint={`${runningJobs} körs · ${pendingJobs} väntar`} />
        <StatCard label="Uppdateringar" value={String(coreUpdates + pluginUpdates + themeUpdates)} hint={`kärna ${coreUpdates} · plugin ${pluginUpdates} · teman ${themeUpdates}`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Sajter</h2>
              <p className="mt-0.5 text-xs text-muted">Agentstatus, köläge och uppdateringssignal per WordPress-sajt</p>
            </div>
            <Link href="/jetwp/sites" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
              Öppna alla sajter <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-1.5">
            {sites.map((site) => (
              <SiteRow key={site.id} site={site} />
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
                <Workflow size={13} className="text-muted" />
                Arbetsflöden
              </h2>
              <Link href="/jetwp/workflow" className="text-xs text-muted hover:text-fg">Detaljer →</Link>
            </div>
            <div className="space-y-2.5 text-sm">
              <QueueRow icon={CheckCircle2} tone="text-emerald-600 dark:text-emerald-400" label="Aktiva" value={activeWorkflows} />
              <QueueRow icon={Clock} tone="text-muted" label="Körningar 30 dgr" value={templateList.reduce((sum, workflow) => sum + workflow.runs30d, 0)} />
              <QueueRow icon={XCircle} tone="text-amber-600 dark:text-amber-400" label="Pausade/utkast" value={templateList.length - activeWorkflows} />
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
                <Bot size={13} className="text-muted" />
                Agenter
              </h2>
              <Link href="/jetwp/agents" className="text-xs text-muted hover:text-fg">Detaljer →</Link>
            </div>
            <div className="space-y-2.5 text-sm">
              <QueueRow icon={CheckCircle2} tone="text-emerald-600 dark:text-emerald-400" label="Friska" value={healthyAgents} />
              <QueueRow icon={AlertTriangle} tone="text-amber-600 dark:text-amber-400" label="Kräver åtgärd" value={agentRecords.length - healthyAgents} />
              <QueueRow icon={Clock} tone="text-muted" label="Totalt" value={agentRecords.length} />
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
              <ShieldAlert size={13} className="text-muted" />
              Öppna larm
            </h2>
            <Link href="/jetwp/alerts" className="text-xs text-muted hover:text-fg">Visa alla →</Link>
          </div>
          <div className="divide-y divide-border/60">
            {openAlerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 px-5 py-3">
                <span
                  className={clsx(
                    "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                    alert.severity === "critical" ? "bg-red-500" : alert.severity === "warning" ? "bg-amber-500" : "bg-blue-500",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{alert.title}</div>
                  <div className="truncate text-xs text-muted">{alert.description}</div>
                </div>
                <span className="shrink-0 text-[11px] tabular-nums text-muted">{alert.createdAt}</span>
              </div>
            ))}
            {openAlerts.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-muted">Inga öppna larm just nu</div>
            )}
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
              <Package size={13} className="text-muted" />
              Inventeringshöjdpunkter
            </h2>
            <Link href="/jetwp/inventory" className="text-xs text-muted hover:text-fg">Detaljer →</Link>
          </div>
          <div className="divide-y divide-border/60">
            {inventoryHighlights.map((item) => (
              <InventoryRow key={item.id} label={item.label} updates={item.updates} total={item.total} latest={item.latestVersion} />
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Jobbkö</h2>
              <p className="mt-0.5 text-xs text-muted">Senaste jobb och körstatus över hela flottan</p>
            </div>
            <Link href="/jetwp/jobs" className="text-xs text-muted hover:text-fg">Visa alla →</Link>
          </div>
          <div className="space-y-2.5 text-sm">
            <QueueRow icon={Clock} tone="text-muted" label="Väntande" value={pendingJobs} />
            <QueueRow icon={PlayCircle} tone="text-blue-600 dark:text-blue-400" label="Körs" value={runningJobs} />
            <QueueRow icon={XCircle} tone="text-red-600 dark:text-red-400" label="Misslyckade" value={failedJobs} />
            <QueueRow icon={CheckCircle2} tone="text-emerald-600 dark:text-emerald-400" label="Färdiga (24 h)" value={jobs.filter((job) => job.status === "completed").length} />
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
                <FileText size={13} className="text-muted" />
                Rapporter
              </h2>
              <p className="mt-0.5 text-xs text-muted">Snabbväg till export- och rapportflöden</p>
            </div>
            <Link href="/jetwp/reports" className="text-xs text-muted hover:text-fg">Öppna →</Link>
          </div>
          <div className="space-y-3 text-sm text-muted">
            <div className="rounded-xl border bg-bg/40 p-3">Kundrapporter och interna exporter hanteras i JetWP. Serverdata och återställning ligger i hostingbolagets ordinarie verktyg.</div>
            <div className="rounded-xl border bg-bg/40 p-3">Använd rapporter för uppdateringsläge, larm och agentstatus över WordPress-flottan.</div>
          </div>
        </Card>
      </div>

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
    <Link href={`/jetwp/${site.id}`} className="flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-bg">
      <span className={clsx("h-2 w-2 shrink-0 rounded-full", statusDot)} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{site.name}</span>
          {site.heartbeatStale && <Badge tone="warning">fördröjd</Badge>}
          {site.failingJobs > 0 && <Badge tone="danger">{site.failingJobs} fel</Badge>}
          {site.pendingJobs > 0 && <Badge tone="neutral">{site.pendingJobs} väntar</Badge>}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
          <span className="truncate">{site.domain}</span>
          <span>·</span>
          <span className="font-mono">WP {site.wp}</span>
          <span>·</span>
          <span>incheckning {site.lastHeartbeat}</span>
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

function InventoryRow({ label, updates, total, latest }: { label: string; updates: number; total: number; latest: string | null }) {
  return (
    <div className="flex items-center gap-3 px-5 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{label}</div>
        <div className="text-[11px] text-muted">
          Senaste version: <span className="font-mono">{latest ?? "saknas"}</span>
        </div>
      </div>
      {updates > 0 ? (
        <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
          {updates}/{total} behöver uppdateras
        </span>
      ) : !latest ? (
        <span className="text-[11px] text-muted">Ingen data</span>
      ) : (
        <span className="text-[11px] text-muted">Alla aktuella</span>
      )}
    </div>
  );
}
