"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Search, ArrowRight, Play, Pause, RotateCw, XCircle, CheckCircle2, Clock, PlayCircle, AlertTriangle, MinusCircle } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Table";
import { RowMenu, type RowMenuEntry } from "@/components/ui/RowMenu";
import { useToast } from "@/components/toast/ToastProvider";
import { jobs, JOB_TYPE_LABEL, siteName, siteDomain, type Job, type JobStatus, type JobType } from "../fleet";
import { sites } from "../data";

const statusCfg: Record<JobStatus, { label: string; dot: string; tone: string; Icon: typeof Clock }> = {
  pending: { label: "Väntande", dot: "bg-amber-500", tone: "text-amber-600 dark:text-amber-400", Icon: Clock },
  claimed: { label: "Reserverad", dot: "bg-blue-400", tone: "text-blue-600 dark:text-blue-400", Icon: PlayCircle },
  running: { label: "Körs", dot: "bg-blue-500", tone: "text-blue-600 dark:text-blue-400", Icon: PlayCircle },
  completed: { label: "Klar", dot: "bg-emerald-500", tone: "text-emerald-600 dark:text-emerald-400", Icon: CheckCircle2 },
  failed: { label: "Misslyckad", dot: "bg-red-500", tone: "text-red-600 dark:text-red-400", Icon: AlertTriangle },
  cancelled: { label: "Avbruten", dot: "bg-fg/40", tone: "text-muted", Icon: MinusCircle },
};

export default function JobsPage() {
  const router = useRouter();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | JobStatus>("all");
  const [type, setType] = useState<"all" | JobType>("all");
  const [site, setSite] = useState<"all" | string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      if (status !== "all" && j.status !== status) return false;
      if (type !== "all" && j.type !== type) return false;
      if (site !== "all" && j.siteId !== site) return false;
      if (!q) return true;
      return j.id.includes(q) || j.type.includes(q) || siteName(j.siteId).toLowerCase().includes(q) || j.createdBy.toLowerCase().includes(q);
    });
  }, [query, status, type, site]);

  const menuFor = (j: Job): RowMenuEntry[] => [
    { label: "Öppna detaljer", icon: ArrowRight, onClick: () => router.push(`/jetwp/jobs/${j.id}`) },
    ...(j.status === "pending" || j.status === "claimed" ? [{ label: "Avbryt", icon: XCircle, onClick: () => toast.info("Avbruten", j.id), danger: true }] as RowMenuEntry[] : []),
    ...(j.status === "failed" ? [{ label: "Kör igen", icon: RotateCw, onClick: () => toast.success("Omkörd", j.id) }] as RowMenuEntry[] : []),
    ...(j.status === "running" ? [{ label: "Pausa", icon: Pause, onClick: () => toast.info("Pausad", j.id) }] as RowMenuEntry[] : []),
  ];

  const statusCounts: Record<JobStatus, number> = {
    pending: 0, claimed: 0, running: 0, completed: 0, failed: 0, cancelled: 0,
  };
  jobs.forEach((j) => { statusCounts[j.status]++; });

  const types = Array.from(new Set(jobs.map((j) => j.type))) as JobType[];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          JetWP
        </Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <PageHeader title="Jobs" subtitle="Kontrollcenter för alla köade, aktiva och historiska jobb" />
          <Button onClick={() => router.push("/jetwp/jobs/new")}>
            <Plus size={14} strokeWidth={2} className="mr-1.5" />
            Skapa jobb
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Väntande" value={String(statusCounts.pending)} hint={`${statusCounts.claimed} reserverade`} />
        <StatCard label="Körs" value={String(statusCounts.running)} />
        <StatCard label="Misslyckade" value={String(statusCounts.failed)} hint="senaste 24h" />
        <StatCard label="Klara" value={String(statusCounts.completed)} />
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input className="pl-9" placeholder="Sök id, typ, sajt, skapare…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["all", "pending", "claimed", "running", "completed", "failed", "cancelled"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatus(f)}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  status === f ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                )}
              >
                {f === "all" ? "Alla" : statusCfg[f].label}
              </button>
            ))}
          </div>
          <select value={type} onChange={(e) => setType(e.target.value as "all" | JobType)} className="rounded-lg border bg-surface px-2.5 py-1.5 text-xs font-medium">
            <option value="all">Alla typer</option>
            {types.map((t) => <option key={t} value={t}>{JOB_TYPE_LABEL[t]}</option>)}
          </select>
          <select value={site} onChange={(e) => setSite(e.target.value)} className="rounded-lg border bg-surface px-2.5 py-1.5 text-xs font-medium">
            <option value="all">Alla sajter</option>
            {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </Card>

      <div className="overflow-hidden rounded-2xl border bg-surface shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <Th>Jobb</Th>
              <Th>Typ</Th>
              <Th>Sajt</Th>
              <Th>Status</Th>
              <Th>Prio</Th>
              <Th>Tid</Th>
              <Th>Försök</Th>
              <Th>Skapare</Th>
              <th className="w-10 border-b px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((j) => {
              const cfg = statusCfg[j.status];
              return (
                <tr key={j.id} className="group transition-colors hover:bg-bg/60">
                  <td className="border-b border-border/60 px-4 py-3">
                    <Link href={`/jetwp/jobs/${j.id}`} className="font-mono text-[12px] font-medium hover:text-fg">{j.id}</Link>
                    <div className="mt-0.5 text-[11px] text-muted">{j.strategy}</div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className="text-[13px]">{JOB_TYPE_LABEL[j.type]}</div>
                    <div className="font-mono text-[11px] text-muted">{j.type}</div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <Link href={`/jetwp/${j.siteId}`} className="text-[13px] hover:text-fg">{siteName(j.siteId)}</Link>
                    <div className="text-[11px] text-muted">{siteDomain(j.siteId)}</div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={clsx("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                      <span className={cfg.tone}>{cfg.label}</span>
                    </span>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <Badge tone={j.priority === "urgent" ? "danger" : j.priority === "high" ? "warning" : "neutral"}>{j.priority}</Badge>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3 font-mono text-[11px] tabular-nums text-muted">
                    <div>{j.createdAt}</div>
                    {j.duration && <div className="text-[10px]">{j.duration}</div>}
                  </td>
                  <td className="border-b border-border/60 px-4 py-3 font-mono text-[12px] tabular-nums">{j.attempts}/{j.maxAttempts}</td>
                  <td className="border-b border-border/60 px-4 py-3 text-[12px] text-muted">{j.createdBy}</td>
                  <td className="border-b border-border/60 px-2 py-3">
                    <RowMenu items={menuFor(j)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-10 text-center text-sm text-muted">Inga jobb matchade filtret.</div>}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="border-b px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted">{children}</th>;
}
