"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCw, XCircle, Pause, Play, Workflow as WorkflowIcon, ExternalLink, Activity } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { jobs, JOB_TYPE_LABEL, siteName, siteDomain } from "../../fleet";

const statusTone: Record<string, string> = {
  pending: "bg-amber-500",
  claimed: "bg-blue-400",
  running: "bg-blue-500",
  completed: "bg-emerald-500",
  failed: "bg-red-500",
  cancelled: "bg-fg/40",
};

const statusLabels: Record<string, string> = {
  pending: "väntar",
  claimed: "hämtad",
  running: "körs",
  completed: "klar",
  failed: "misslyckad",
  cancelled: "avbruten",
};

const priorityLabels: Record<string, string> = {
  low: "låg",
  normal: "normal",
  high: "hög",
  urgent: "akut",
};

const strategyLabels: Record<string, string> = {
  immediate: "direkt",
  serial: "seriell",
  canary: "kanarie",
  scheduled: "schemalagd",
};

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();
  const job = jobs.find((entry) => entry.id === id);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!job || job.status !== "running") return;
    const timer = window.setInterval(() => setTick((current) => current + 1), 2500);
    return () => window.clearInterval(timer);
  }, [job]);

  if (!job) {
    return (
      <div className="space-y-6">
        <Link href="/jetwp/jobs" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          Jobb
        </Link>
        <Card className="p-10 text-center">
          <div className="text-sm font-medium">Jobbet hittades inte</div>
          <div className="mt-1 text-xs text-muted">Id: {id}</div>
        </Card>
      </div>
    );
  }

  const related = jobs.filter((entry) => entry.siteId === job.siteId && entry.id !== job.id).slice(0, 6);
  const progress = job.status === "completed" ? 100 : job.status === "failed" ? 100 : job.status === "running" ? Math.min(92, 34 + tick * 9) : job.status === "claimed" ? 18 : 8;
  const logLines = useMemo(() => {
    const base = [
      `[${job.createdAt}] job.queued id=${job.id} type=${job.type} site=${job.siteId} strategy=${job.strategy}`,
      job.startedAt && `[${job.startedAt}] agent.claimed server=${siteName(job.siteId)} attempt=${job.attempts}/${job.maxAttempts}`,
      job.startedAt && `[${job.startedAt}] exec.begin`,
      ...(job.params ?? []).map((param) => `  param ${param.label}=${param.value}`),
    ].filter(Boolean) as string[];

    if (job.status === "running") {
      return [...base, `[live ${tick}] exec.progress step=${Math.min(5, tick + 1)} state=running`, `[live ${tick}] stream.output heartbeat=ok latency=${160 + tick * 12}ms`];
    }
    if (job.finishedAt && job.status === "completed") return [...base, `[${job.finishedAt}] exec.complete duration=${job.duration}`];
    if (job.finishedAt && job.status === "failed") return [...base, `[${job.finishedAt}] exec.failed ${job.error}`];
    if (job.finishedAt && job.status === "cancelled") return [...base, `[${job.finishedAt}] exec.cancelled ${job.output ?? ""}`];
    return base;
  }, [job, tick]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp/jobs" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          Jobb
        </Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={clsx("h-2 w-2 rounded-full", statusTone[job.status])} />
              <span className="font-mono text-xs text-muted">{job.id}</span>
              <Badge tone={job.priority === "urgent" ? "danger" : job.priority === "high" ? "warning" : "neutral"}>{priorityLabels[job.priority] ?? job.priority}</Badge>
            </div>
            <PageHeader title={JOB_TYPE_LABEL[job.type]} subtitle={`${siteName(job.siteId)} · ${siteDomain(job.siteId)}`} />
          </div>
          <div className="flex gap-2">
            {job.status === "failed" && <Button onClick={() => toast.success("Omkörning köad", job.id)}><RotateCw size={14} className="mr-1.5" />Kör igen</Button>}
            {job.status === "running" && <Button variant="secondary" onClick={() => toast.info("Paus begärd", job.id)}><Pause size={14} className="mr-1.5" />Pausa</Button>}
            {(job.status === "pending" || job.status === "claimed") && <Button variant="secondary" onClick={() => toast.info("Avbrytning begärd", job.id)}><XCircle size={14} className="mr-1.5" />Avbryt</Button>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <Activity size={14} className="text-muted" />
                Förlopp
              </div>
              <span className="font-mono text-[11px] text-muted">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-fg/5">
              <div className={clsx("h-full", job.status === "failed" ? "bg-red-500" : job.status === "completed" ? "bg-emerald-500" : "bg-blue-500")} style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 text-[11px] text-muted">
              {job.status === "running" ? "Live-loggning är aktiv med polling var 2,5 sekund." : "Statisk körlogg för färdigt eller köat arbete."}
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b px-5 py-3 text-sm font-semibold tracking-tight">
              <span>Körlogg</span>
              {job.status === "running" && <Badge tone="warning">live</Badge>}
            </div>
            <pre className="max-h-[420px] overflow-auto bg-bg/40 p-5 font-mono text-[12px] leading-relaxed text-fg/80">{logLines.join("\n")}</pre>
          </Card>

          {job.error && (
            <Card className="border-red-500/30 bg-red-500/5 p-5">
              <div className="text-sm font-semibold text-red-600 dark:text-red-400">Felutskrift</div>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-[12px]">{job.error}</pre>
            </Card>
          )}

          {job.output && (
            <Card className="p-5">
              <div className="text-sm font-semibold">Utdata</div>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-[12px] text-muted">{job.output}</pre>
            </Card>
          )}

          <Card className="overflow-hidden p-0">
            <div className="border-b px-5 py-3 text-sm font-semibold tracking-tight">Relaterade jobb på sajten</div>
            <div className="divide-y divide-border/60">
              {related.map((entry) => (
                <Link key={entry.id} href={`/jetwp/jobs/${entry.id}`} className="flex items-center gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-bg/60">
                  <span className={clsx("h-1.5 w-1.5 rounded-full", statusTone[entry.status])} />
                  <span className="font-mono text-[11px] text-muted">{entry.id}</span>
                  <span className="flex-1">{JOB_TYPE_LABEL[entry.type]}</span>
                  <span className="font-mono text-[11px] tabular-nums text-muted">{entry.createdAt}</span>
                </Link>
              ))}
              {related.length === 0 && <div className="px-5 py-6 text-center text-xs text-muted">Inga relaterade jobb.</div>}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-sm font-semibold tracking-tight">Detaljer</div>
            <dl className="mt-3 space-y-2 text-sm">
              <Row k="Status" v={statusLabels[job.status] ?? job.status} />
              <Row k="Typ" v={<span className="font-mono text-[12px]">{job.type}</span>} />
              <Row k="Strategi" v={strategyLabels[job.strategy] ?? job.strategy} />
              <Row k="Prioritet" v={priorityLabels[job.priority] ?? job.priority} />
              <Row k="Försök" v={`${job.attempts}/${job.maxAttempts}`} />
              <Row k="Skapad" v={job.createdAt} />
              {job.startedAt && <Row k="Startad" v={job.startedAt} />}
              {job.finishedAt && <Row k="Avslutad" v={job.finishedAt} />}
              {job.duration && <Row k="Varaktighet" v={job.duration} />}
              <Row k="Skapad av" v={<span className="font-mono text-[12px]">{job.createdBy}</span>} />
            </dl>
          </Card>

          {job.params && job.params.length > 0 && (
            <Card className="p-5">
              <div className="text-sm font-semibold tracking-tight">Parametrar</div>
              <dl className="mt-3 space-y-2 text-sm">
                {job.params.map((param) => <Row key={param.label} k={param.label} v={<span className="font-mono text-[12px]">{param.value}</span>} />)}
              </dl>
            </Card>
          )}

          {job.workflow && (
            <Card className="p-5">
              <div className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
                <WorkflowIcon size={13} className="text-muted" />
                Arbetsflödeskälla
              </div>
              <Link href={`/jetwp/workflow/${job.workflow.id}`} className="mt-2 flex items-center justify-between rounded-lg border bg-bg/40 px-3 py-2 transition-colors hover:bg-bg">
                <div>
                  <div className="text-sm font-medium">{job.workflow.name}</div>
                  <div className="text-[11px] text-muted">Steg {job.workflow.step}</div>
                </div>
                <ExternalLink size={13} className="text-muted" />
              </Link>
            </Card>
          )}

          <Card className="p-5">
            <div className="text-sm font-semibold tracking-tight">Sajt</div>
            <Link href={`/jetwp/${job.siteId}`} className="mt-2 flex items-center justify-between rounded-lg border bg-bg/40 px-3 py-2 transition-colors hover:bg-bg">
              <div>
                <div className="text-sm font-medium">{siteName(job.siteId)}</div>
                <div className="text-[11px] text-muted">{siteDomain(job.siteId)}</div>
              </div>
              <ArrowLeft size={13} className="rotate-180 text-muted" />
            </Link>
            <Button variant="secondary" className="mt-3 w-full" onClick={() => router.push(`/jetwp/jobs/new?site=${job.siteId}`)}>
              <Play size={13} className="mr-1.5" />
              Nytt jobb på sajten
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  );
}
