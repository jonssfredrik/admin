"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  BellOff,
  CheckCircle2,
  Clock3,
  HardDrive,
  HeartPulse,
  Lock,
  MessageSquare,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { alerts, siteName, type Alert, type AlertKind, type AlertSeverity, type AlertStatus } from "@/modules/mwp/data";
import { createAlertItems, getAlertCounts, getFilteredAlerts, type AlertItem } from "@/modules/mwp/selectors/alerts";

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

const statusLabel: Record<AlertStatus, string> = {
  open: "Öppen",
  acked: "Bekräftad",
  resolved: "Löst",
};

export function AlertsPage() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [sev, setSev] = useState<"all" | AlertSeverity>("all");
  const [status, setStatus] = useState<"all" | AlertStatus>("all");
  const [items, setItems] = useState<AlertItem[]>(() => createAlertItems(alerts));
  const [resolveTarget, setResolveTarget] = useState<AlertItem | null>(null);
  const [resolveComment, setResolveComment] = useState("");

  const filtered = useMemo(
    () => getFilteredAlerts(items, query, sev, status, siteName),
    [items, query, sev, status],
  );

  const setAlertStatus = (id: string, nextStatus: AlertStatus, label: string) => {
    setItems((current) => current.map((alert) => alert.id === id ? { ...alert, status: nextStatus } : alert));
    toast.success(label, id);
  };

  const openResolveModal = (alert: AlertItem) => {
    setResolveTarget(alert);
    setResolveComment("");
  };

  const submitResolve = () => {
    if (!resolveTarget) return;
    const body = resolveComment.trim();
    setItems((current) =>
      current.map((alert) =>
        alert.id === resolveTarget.id
          ? {
              ...alert,
              status: "resolved",
              comments: body
                ? [
                    { id: `comment-${Date.now()}`, body, author: "Fredrik Jonsson", createdAt: "just nu", kind: "resolution" },
                    ...alert.comments,
                  ]
                : alert.comments,
            }
          : alert,
      ),
    );
    toast.success("Löst", body ? "Kommentar sparad tillsammans med lösningen" : resolveTarget.id);
    setResolveTarget(null);
    setResolveComment("");
  };

  const counts = useMemo(() => getAlertCounts(items), [items]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/mwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          MWP
        </Link>
        <div className="mt-3">
          <PageHeader title="Alerts" subtitle="Händelser från agenter, jobb och monitoring." />
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
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              className="pl-9"
              placeholder="Sök titel, beskrivning, kommentar eller sajt..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["all", "critical", "warning", "info"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSev(filter)}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  sev === filter ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                )}
              >
                {filter === "all" ? "Alla" : filter}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["all", "open", "acked", "resolved"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatus(filter)}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  status === filter ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                )}
              >
                {filter === "all" ? "Alla" : statusLabel[filter]}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setItems((current) => current.map((alert) => alert.status === "open" ? { ...alert, status: "acked" } : alert));
                toast.success("Alla öppna alerts ackade");
              }}
            >
              <Bell size={12} className="mr-1" />
              Ack alla
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setItems((current) => current.map((alert) => alert.status !== "resolved" ? { ...alert, status: "resolved" } : alert));
                toast.success("Alla alerts lösta");
              }}
            >
              <CheckCircle2 size={12} className="mr-1" />
              Lös alla
            </Button>
            <Link href="/mwp/notifications" className="inline-flex h-9 items-center rounded-lg border bg-surface px-3.5 text-sm font-medium hover:bg-bg">
              Alert rules
            </Link>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map((alert) => {
          const Icon = kindIcon[alert.kind];
          const latestComment = alert.comments[0];

          return (
            <Card key={alert.id} className={clsx("border-l-4 p-4", sevTone[alert.severity])}>
              <div className="flex items-start gap-3">
                <div className={clsx("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", sevTone[alert.severity])}>
                  <Icon size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-semibold">{alert.title}</div>
                    <Badge tone={alert.status === "open" ? "danger" : alert.status === "acked" ? "warning" : "success"}>
                      {statusLabel[alert.status]}
                    </Badge>
                    <span className="font-mono text-[11px] text-muted">{alert.source}</span>
                  </div>

                  <div className="mt-1 text-sm text-muted">{alert.description}</div>

                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted">
                    <span>{alert.createdAt}</span>
                    {alert.siteId && (
                      <Link href={`/mwp/${alert.siteId}`} className="hover:text-fg">
                        {siteName(alert.siteId)} →
                      </Link>
                    )}
                  </div>

                  {latestComment && (
                    <div className="mt-3 overflow-hidden rounded-xl border bg-surface/90 shadow-soft">
                      <div className="flex items-center justify-between border-b bg-bg/50 px-3 py-2">
                        <div className="flex items-center gap-2 text-xs font-medium">
                          <MessageSquare size={12} className="text-muted" />
                          Kommentar vid lösning
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted">
                          <Clock3 size={11} />
                          <span>{latestComment.createdAt}</span>
                        </div>
                      </div>
                      <div className="px-3 py-3">
                        <div className="text-sm leading-6 text-fg/90">{latestComment.body}</div>
                        <div className="mt-2 text-[11px] text-muted">{latestComment.author}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  {alert.status === "open" && (
                    <Button variant="secondary" onClick={() => setAlertStatus(alert.id, "acked", "Bekräftad")}>
                      <Bell size={12} className="mr-1" />
                      Ack
                    </Button>
                  )}
                  {alert.status !== "resolved" && (
                    <Button variant="secondary" onClick={() => openResolveModal(alert)}>
                      <CheckCircle2 size={12} className="mr-1" />
                      Lös
                    </Button>
                  )}
                  {alert.status === "resolved" && (
                    <Button variant="secondary" onClick={() => setAlertStatus(alert.id, "open", "Återöppnad")}>
                      <BellOff size={12} className="mr-1" />
                      Återöppna
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        {filtered.length === 0 && <Card className="p-10 text-center text-sm text-muted">Inga alerts matchade filtret.</Card>}
      </div>

      <Dialog
        open={!!resolveTarget}
        onClose={() => {
          setResolveTarget(null);
          setResolveComment("");
        }}
        title={resolveTarget ? `Lös alert: ${resolveTarget.title}` : "Lös alert"}
        description="Valfri kommentar som sparas på alerten när den löses."
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setResolveTarget(null);
                setResolveComment("");
              }}
            >
              Avbryt
            </Button>
            <Button onClick={submitResolve}>
              <CheckCircle2 size={13} className="mr-1.5" />
              Lös alert
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="rounded-xl border bg-bg/40 px-3 py-2.5 text-sm text-muted">
            Kommentaren är frivillig. Lämna fältet tomt om du bara vill markera alerten som löst.
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-fg">Kommentar</label>
            <textarea
              value={resolveComment}
              onChange={(event) => setResolveComment(event.target.value)}
              placeholder="Beskriv vad som gjordes, om någon åtgärd togs eller varför alerten kan stängas."
              className="min-h-[140px] w-full rounded-xl border bg-surface px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
