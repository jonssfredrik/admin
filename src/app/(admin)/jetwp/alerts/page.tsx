"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, CheckCircle2, Bell, BellOff, ShieldAlert, HeartPulse, XCircle, HardDrive, Lock, AlertTriangle } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { alerts, siteName, type Alert, type AlertSeverity, type AlertStatus, type AlertKind } from "../fleet";

const kindIcon: Record<AlertKind, typeof Bell> = {
  missed_heartbeat: HeartPulse,
  failed_job: XCircle,
  stale_telemetry: AlertTriangle,
  security_update: ShieldAlert,
  disk_space: HardDrive,
  ssl_expiring: Lock,
};

const sevTone: Record<AlertSeverity, string> = {
  critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
};

const statusLabel: Record<AlertStatus, string> = { open: "Öppen", acked: "Bekräftad", resolved: "Löst" };

export default function AlertsPage() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [sev, setSev] = useState<"all" | AlertSeverity>("all");
  const [status, setStatus] = useState<"all" | AlertStatus>("all");
  const [items, setItems] = useState<Alert[]>(alerts);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((a) => {
      if (sev !== "all" && a.severity !== sev) return false;
      if (status !== "all" && a.status !== status) return false;
      if (!q) return true;
      return a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || (a.siteId && siteName(a.siteId).toLowerCase().includes(q));
    });
  }, [items, query, sev, status]);

  const setAlertStatus = (id: string, s: AlertStatus, label: string) => {
    setItems((p) => p.map((a) => a.id === id ? { ...a, status: s } : a));
    toast.success(label, id);
  };

  const counts = {
    open: items.filter((a) => a.status === "open").length,
    critical: items.filter((a) => a.severity === "critical" && a.status === "open").length,
    warning: items.filter((a) => a.severity === "warning" && a.status === "open").length,
    resolved: items.filter((a) => a.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          JetWP
        </Link>
        <div className="mt-3">
          <PageHeader title="Alerts" subtitle="Händelser från agenter, jobb och monitoring" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Öppna" value={String(counts.open)} />
        <StatCard label="Kritiska" value={String(counts.critical)} />
        <StatCard label="Varningar" value={String(counts.warning)} />
        <StatCard label="Lösta" value={String(counts.resolved)} />
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input className="pl-9" placeholder="Sök titel, beskrivning eller sajt…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["all", "critical", "warning", "info"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setSev(f)}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  sev === f ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                )}
              >
                {f === "all" ? "Alla" : f}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["all", "open", "acked", "resolved"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatus(f)}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  status === f ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                )}
              >
                {f === "all" ? "Alla" : statusLabel[f]}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map((a) => {
          const Icon = kindIcon[a.kind];
          return (
            <Card key={a.id} className={clsx("p-4 border-l-4", sevTone[a.severity])}>
              <div className="flex items-start gap-3">
                <div className={clsx("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", sevTone[a.severity])}>
                  <Icon size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-semibold">{a.title}</div>
                    <Badge tone={a.status === "open" ? "danger" : a.status === "acked" ? "warning" : "success"}>{statusLabel[a.status]}</Badge>
                    <span className="font-mono text-[11px] text-muted">{a.source}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted">{a.description}</div>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted">
                    <span>{a.createdAt}</span>
                    {a.siteId && <Link href={`/jetwp/${a.siteId}`} className="hover:text-fg">{siteName(a.siteId)} →</Link>}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  {a.status === "open" && (
                    <Button variant="secondary" onClick={() => setAlertStatus(a.id, "acked", "Bekräftad")}>
                      <Bell size={12} className="mr-1" />Ack
                    </Button>
                  )}
                  {a.status !== "resolved" && (
                    <Button variant="secondary" onClick={() => setAlertStatus(a.id, "resolved", "Löst")}>
                      <CheckCircle2 size={12} className="mr-1" />Lös
                    </Button>
                  )}
                  {a.status === "resolved" && (
                    <Button variant="secondary" onClick={() => setAlertStatus(a.id, "open", "Återöppnad")}>
                      <BellOff size={12} className="mr-1" />Återöppna
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && <Card className="p-10 text-center text-sm text-muted">Inga alerts matchade filtret.</Card>}
      </div>
    </div>
  );
}
