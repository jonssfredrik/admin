"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Mail,
  MemoryStick,
  Network,
  RefreshCw,
  Server,
  XCircle,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { AreaChart } from "@/components/charts/AreaChart";
import { useToast } from "@/components/toast/ToastProvider";
import { nodeThresholdAlerts, sites } from "@/modules/mwp/data";
import { getHealthOverviewStats, getNodeTotals } from "@/modules/mwp/selectors/health";

type NodeStatus = "healthy" | "warning" | "critical";
type ServiceStatus = "operational" | "degraded" | "down";

interface Node {
  id: string;
  name: string;
  region: string;
  status: NodeStatus;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  sites: number;
  uptime: string;
}

interface Service {
  name: string;
  description: string;
  status: ServiceStatus;
  latency: string;
  icon: typeof Server;
}

interface Incident {
  id: string;
  title: string;
  status: "resolved" | "investigating" | "monitoring";
  severity: "low" | "medium" | "high";
  time: string;
  duration: string;
  node: string;
}

const nodes: Node[] = [
  { id: "n-1", name: "sto-web-01", region: "Stockholm", status: "healthy", cpu: 32, memory: 58, disk: 41, network: 24, sites: 12, uptime: "182d" },
  { id: "n-2", name: "sto-web-02", region: "Stockholm", status: "warning", cpu: 78, memory: 81, disk: 62, network: 58, sites: 14, uptime: "182d" },
  { id: "n-3", name: "got-web-01", region: "Göteborg", status: "healthy", cpu: 44, memory: 52, disk: 38, network: 31, sites: 10, uptime: "94d" },
  { id: "n-4", name: "fra-web-01", region: "Frankfurt", status: "healthy", cpu: 28, memory: 47, disk: 55, network: 19, sites: 8, uptime: "231d" },
];

const services: Service[] = [
  { name: "Nginx", description: "Webbserver och reverse proxy", status: "operational", latency: "8 ms", icon: Server },
  { name: "MariaDB", description: "Primärt databaskluster", status: "operational", latency: "12 ms", icon: Database },
  { name: "Redis", description: "Objekt- och sidcache", status: "operational", latency: "2 ms", icon: Activity },
  { name: "PHP-FPM", description: "PHP 8.1 / 8.2 / 8.3 pooler", status: "degraded", latency: "184 ms", icon: Cpu },
  { name: "Cron-schemaläggare", description: "WP-Cron och systemjobb", status: "operational", latency: "-", icon: Clock },
  { name: "SMTP relay", description: "Transaktionell e-post", status: "operational", latency: "42 ms", icon: Mail },
];

const incidents: Incident[] = [
  { id: "i-1", title: "Förhöjd latens på PHP-FPM-pool", status: "monitoring", severity: "medium", time: "14:22", duration: "pågår · 18 min", node: "sto-web-02" },
  { id: "i-2", title: "Sajt svarar inte - arcticoutdoor.com", status: "investigating", severity: "high", time: "14:05", duration: "pågår · 35 min", node: "fra-web-01" },
  { id: "i-3", title: "MariaDB-failover genomförd", status: "resolved", severity: "medium", time: "09:47", duration: "12 min", node: "sto-web-01" },
  { id: "i-4", title: "Redis minnesanvändning > 80%", status: "resolved", severity: "low", time: "igår 22:14", duration: "8 min", node: "got-web-01" },
  { id: "i-5", title: "SSL-förnyelse misslyckades", status: "resolved", severity: "low", time: "igår 04:03", duration: "auto-fixad", node: "sto-web-01" },
];

const cpuHistory = Array.from({ length: 48 }, (_, i) => ({
  label: `${Math.floor(i / 2).toString().padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
  value: Math.round(38 + Math.sin(i / 4) * 12 + Math.cos(i * 1.3) * 8 + (i > 40 ? 18 : 0)),
}));

const requestHistory = Array.from({ length: 48 }, (_, i) => ({
  label: `${Math.floor(i / 2).toString().padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
  value: Math.round(1800 + Math.sin(i / 3) * 600 + Math.cos(i * 1.1) * 300 + i * 12),
}));

const nodeStatusCfg: Record<NodeStatus, { dot: string; text: string; label: string }> = {
  healthy: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", label: "Frisk" },
  warning: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", label: "Varning" },
  critical: { dot: "bg-red-500", text: "text-red-600 dark:text-red-400", label: "Kritisk" },
};

const serviceCfg: Record<ServiceStatus, { tone: string; label: string }> = {
  operational: { tone: "text-emerald-600 dark:text-emerald-400", label: "Drift" },
  degraded: { tone: "text-amber-600 dark:text-amber-400", label: "Försämrad" },
  down: { tone: "text-red-600 dark:text-red-400", label: "Nere" },
};

export function HealthPage() {
  const toast = useToast();
  const { activeIncidents } = getHealthOverviewStats(incidents);
  const { nodeCount, totalSites } = getNodeTotals(nodes);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/mwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          MWP
        </Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <PageHeader title="Serverhälsa" subtitle="Realtidsstatus för noder, tjänster och sajter" />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => toast.info("Hämtar färsk data...")}>
              <RefreshCw size={14} strokeWidth={2} className="mr-1.5" />
              Uppdatera
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Uptime (30d)" value="99.98%" delta={0.02} hint="SLA: 99.9%" />
        <StatCard label="Svarstid (p95)" value="182 ms" delta={-4.1} hint="genomsnitt alla noder" />
        <StatCard label="Begäranden/s" value="2 148" delta={6.8} hint="sista 5 min" />
        <StatCard label="Aktiva incidenter" value={String(activeIncidents)} hint={activeIncidents > 0 ? "kräver uppmärksamhet" : "allt lugnt"} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Webbnoder</h2>
            <p className="mt-0.5 text-xs text-muted">{nodeCount} noder · {totalSites} sajter totalt</p>
          </div>
          <span className="text-xs text-muted">Uppdaterad för 12 sek sedan</span>
        </div>
        <div className="divide-y divide-border/60">
          {nodes.map((node) => {
            const cfg = nodeStatusCfg[node.status];
            return (
              <div key={node.id} className="grid grid-cols-1 gap-4 px-5 py-4 md:grid-cols-12 md:items-center">
                <div className="md:col-span-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      {node.status === "healthy" && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />}
                      <span className={clsx("relative h-2 w-2 rounded-full", cfg.dot)} />
                    </span>
                    <span className="font-mono text-sm font-medium">{node.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                    <span>{node.region}</span>
                    <span>·</span>
                    <span>{node.sites} sajter</span>
                    <span>·</span>
                    <span className="tabular-nums">up {node.uptime}</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 md:col-span-8">
                  <ResourceBar icon={Cpu} label="CPU" value={node.cpu} />
                  <ResourceBar icon={MemoryStick} label="RAM" value={node.memory} />
                  <ResourceBar icon={HardDrive} label="Disk" value={node.disk} />
                  <ResourceBar icon={Network} label="Nät" value={node.network} />
                </div>
                <div className={clsx("text-right text-xs font-medium md:col-span-1", cfg.text)}>{cfg.label}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">CPU-användning</h2>
              <p className="mt-0.5 text-xs text-muted">Senaste 24 timmarna · genomsnitt</p>
            </div>
            <span className="rounded border px-2 py-0.5 font-mono text-[11px] tabular-nums">45%</span>
          </div>
          <AreaChart data={cpuHistory} height={180} formatValue={(value) => `${value}%`} />
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Begäranden per minut</h2>
              <p className="mt-0.5 text-xs text-muted">Senaste 24 timmarna · alla noder</p>
            </div>
            <span className="rounded border px-2 py-0.5 font-mono text-[11px] tabular-nums">2 148/s</span>
          </div>
          <AreaChart data={requestHistory} height={180} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold tracking-tight">Nodregler för gränsvärden</h2>
            <p className="mt-0.5 text-xs text-muted">Automatiska larm när noder passerar kritiska gränsvärden.</p>
          </div>
          <div className="space-y-2">
            {nodeThresholdAlerts.map((rule) => (
              <div key={`${rule.node}-${rule.metric}`} className="rounded-lg border bg-bg px-3 py-2.5 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{rule.node} · {rule.metric}</span>
                  <span className="font-mono text-[11px] text-muted">{rule.threshold}</span>
                </div>
                <div className="mt-1 text-xs text-muted">{rule.action}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold tracking-tight">Historisk nodtrend</h2>
            <p className="mt-0.5 text-xs text-muted">30 minuters snittlast för den varmaste noden.</p>
          </div>
          <AreaChart
            data={cpuHistory.map((point, index) => ({ label: point.label, value: Math.max(24, point.value - (index % 5) * 3) }))}
            height={180}
            formatValue={(value) => `${value}%`}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold tracking-tight">Tjänster</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {services.map((service) => {
              const cfg = serviceCfg[service.status];
              const Icon = service.icon;
              return (
                <div key={service.name} className="flex items-center gap-3 rounded-lg border bg-bg px-3 py-2.5">
                  <Icon size={16} className="shrink-0 text-muted" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{service.name}</span>
                      <span className={clsx("text-[10px] font-semibold uppercase tracking-wider", cfg.tone)}>{cfg.label}</span>
                    </div>
                    <div className="truncate text-xs text-muted">{service.description}</div>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted">{service.latency}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-tight">Sajtstatus</h2>
          <div className="space-y-2">
            {sites.map((site) => {
              const tone =
                site.status === "online" ? "bg-emerald-500" :
                site.status === "warning" ? "bg-amber-500" :
                site.status === "maintenance" ? "bg-blue-500" : "bg-red-500";
              return (
                <Link key={site.id} href={`/mwp/${site.id}`} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-bg">
                  <span className={clsx("h-1.5 w-1.5 shrink-0 rounded-full", tone)} />
                  <Globe size={12} className="shrink-0 text-muted" />
                  <span className="min-w-0 flex-1 truncate">{site.domain}</span>
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted">
                    {site.visits30d > 1000 ? `${Math.round(site.visits30d / 1000)}k` : site.visits30d}
                  </span>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Incidenter</h2>
            <p className="mt-0.5 text-xs text-muted">Senaste 24 timmarna</p>
          </div>
          <Link href="/mwp/activity" className="text-xs text-muted hover:text-fg">Visa alla →</Link>
        </div>
        <div className="divide-y divide-border/60">
          {incidents.map((incident) => {
            const statusCfg =
              incident.status === "resolved"
                ? { Icon: CheckCircle2, tone: "text-emerald-600 dark:text-emerald-400", label: "Löst" }
                : incident.status === "investigating"
                  ? { Icon: XCircle, tone: "text-red-600 dark:text-red-400", label: "Undersöker" }
                  : { Icon: AlertTriangle, tone: "text-amber-600 dark:text-amber-400", label: "Övervakas" };
            const { Icon } = statusCfg;
            return (
              <div key={incident.id} className="flex items-start gap-3 px-5 py-3">
                <Icon size={15} className={clsx("mt-0.5 shrink-0", statusCfg.tone)} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{incident.title}</span>
                    <span
                      className={clsx(
                        "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        incident.severity === "high"
                          ? "bg-red-500/10 text-red-600 dark:text-red-400"
                          : incident.severity === "medium"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-fg/5 text-muted",
                      )}
                    >
                      {incident.severity}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                    <span className="font-mono">{incident.node}</span>
                    <span>·</span>
                    <span>{incident.time}</span>
                    <span>·</span>
                    <span>{incident.duration}</span>
                  </div>
                </div>
                <span className={clsx("shrink-0 text-xs font-medium", statusCfg.tone)}>{statusCfg.label}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function ResourceBar({ icon: Icon, label, value }: { icon: typeof Cpu; label: string; value: number }) {
  const hot = value > 75;
  const warm = value > 60;
  return (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1 text-muted">
          <Icon size={11} />
          {label}
        </span>
        <span className={clsx("font-medium tabular-nums", hot ? "text-amber-600 dark:text-amber-400" : "text-fg")}>{value}%</span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-fg/5">
        <div className={clsx("h-full rounded-full", hot ? "bg-amber-500" : warm ? "bg-fg/80" : "bg-fg/60")} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
