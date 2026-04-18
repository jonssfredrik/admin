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
          Jobs
        </Link>
        <Card className="p-10 text-center">
          <div className="text-sm font-medium">Job not found</div>
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
          Jobs
        </Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={clsx("h-2 w-2 rounded-full", statusTone[job.status])} />
              <span className="font-mono text-xs text-muted">{job.id}</span>
              <Badge tone={job.priority === "urgent" ? "danger" : job.priority === "high" ? "warning" : "neutral"}>{job.priority}</Badge>
            </div>
            <PageHeader title={JOB_TYPE_LABEL[job.type]} subtitle={`${siteName(job.siteId)} · ${siteDomain(job.siteId)}`} />
          </div>
          <div className="flex gap-2">
            {job.status === "failed" && <Button onClick={() => toast.success("Retry queued", job.id)}><RotateCw size={14} className="mr-1.5" />Retry</Button>}
            {job.status === "running" && <Button variant="secondary" onClick={() => toast.info("Pause requested", job.id)}><Pause size={14} className="mr-1.5" />Pause</Button>}
            {(job.status === "pending" || job.status === "claimed") && <Button variant="secondary" onClick={() => toast.info("Cancel requested", job.id)}><XCircle size={14} className="mr-1.5" />Cancel</Button>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <Activity size={14} className="text-muted" />
                Progress
              </div>
              <span className="font-mono text-[11px] text-muted">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-fg/5">
              <div className={clsx("h-full", job.status === "failed" ? "bg-red-500" : job.status === "completed" ? "bg-emerald-500" : "bg-blue-500")} style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 text-[11px] text-muted">
              {job.status === "running" ? "Live log streaming active with polling every 2.5s." : "Static execution log for completed or queued work."}
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b px-5 py-3 text-sm font-semibold tracking-tight">
              <span>Execution log</span>
              {job.status === "running" && <Badge tone="warning">live</Badge>}
            </div>
            <pre className="max-h-[420px] overflow-auto bg-bg/40 p-5 font-mono text-[12px] leading-relaxed text-fg/80">{logLines.join("\n")}</pre>
          </Card>

          {job.error && (
            <Card className="border-red-500/30 bg-red-500/5 p-5">
              <div className="text-sm font-semibold text-red-600 dark:text-red-400">Error output</div>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-[12px]">{job.error}</pre>
            </Card>
          )}

          {job.output && (
            <Card className="p-5">
              <div className="text-sm font-semibold">Output</div>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-[12px] text-muted">{job.output}</pre>
            </Card>
          )}

          <Card className="p-0 overflow-hidden">
            <div className="border-b px-5 py-3 text-sm font-semibold tracking-tight">Related jobs on site</div>
            <div className="divide-y divide-border/60">
              {related.map((entry) => (
                <Link key={entry.id} href={`/jetwp/jobs/${entry.id}`} className="flex items-center gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-bg/60">
                  <span className={clsx("h-1.5 w-1.5 rounded-full", statusTone[entry.status])} />
                  <span className="font-mono text-[11px] text-muted">{entry.id}</span>
                  <span className="flex-1">{JOB_TYPE_LABEL[entry.type]}</span>
                  <span className="font-mono text-[11px] tabular-nums text-muted">{entry.createdAt}</span>
                </Link>
              ))}
              {related.length === 0 && <div className="px-5 py-6 text-center text-xs text-muted">No related jobs.</div>}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-sm font-semibold tracking-tight">Details</div>
            <dl className="mt-3 space-y-2 text-sm">
              <Row k="Status" v={job.status} />
              <Row k="Type" v={<span className="font-mono text-[12px]">{job.type}</span>} />
              <Row k="Strategy" v={job.strategy} />
              <Row k="Priority" v={job.priority} />
              <Row k="Attempts" v={`${job.attempts}/${job.maxAttempts}`} />
              <Row k="Created" v={job.createdAt} />
              {job.startedAt && <Row k="Started" v={job.startedAt} />}
              {job.finishedAt && <Row k="Finished" v={job.finishedAt} />}
              {job.duration && <Row k="Duration" v={job.duration} />}
              <Row k="Created by" v={<span className="font-mono text-[12px]">{job.createdBy}</span>} />
            </dl>
          </Card>

          {job.params && job.params.length > 0 && (
            <Card className="p-5">
              <div className="text-sm font-semibold tracking-tight">Parameters</div>
              <dl className="mt-3 space-y-2 text-sm">
                {job.params.map((param) => <Row key={param.label} k={param.label} v={<span className="font-mono text-[12px]">{param.value}</span>} />)}
              </dl>
            </Card>
          )}

          {job.workflow && (
            <Card className="p-5">
              <div className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
                <WorkflowIcon size={13} className="text-muted" />
                Workflow source
              </div>
              <Link href={`/jetwp/workflow/${job.workflow.id}`} className="mt-2 flex items-center justify-between rounded-lg border bg-bg/40 px-3 py-2 transition-colors hover:bg-bg">
                <div>
                  <div className="text-sm font-medium">{job.workflow.name}</div>
                  <div className="text-[11px] text-muted">Step {job.workflow.step}</div>
                </div>
                <ExternalLink size={13} className="text-muted" />
              </Link>
            </Card>
          )}

          <Card className="p-5">
            <div className="text-sm font-semibold tracking-tight">Site</div>
            <Link href={`/jetwp/${job.siteId}`} className="mt-2 flex items-center justify-between rounded-lg border bg-bg/40 px-3 py-2 transition-colors hover:bg-bg">
              <div>
                <div className="text-sm font-medium">{siteName(job.siteId)}</div>
                <div className="text-[11px] text-muted">{siteDomain(job.siteId)}</div>
              </div>
              <ArrowLeft size={13} className="rotate-180 text-muted" />
            </Link>
            <Button variant="secondary" className="mt-3 w-full" onClick={() => router.push(`/jetwp/jobs/new?site=${job.siteId}`)}>
              <Play size={13} className="mr-1.5" />
              New job on site
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
