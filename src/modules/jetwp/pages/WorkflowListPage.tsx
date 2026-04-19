"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Copy,
  Pause,
  PauseCircle,
  Play,
  Plus,
  Search,
  Trash2,
  Workflow as WorkflowIcon,
  Zap,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { RowMenu, type RowMenuEntry } from "@/components/ui/RowMenu";
import { useToast } from "@/components/toast/ToastProvider";
import { templateList, thumbnailIcons, type WorkflowTemplate, type WFStatus } from "@/modules/jetwp/workflow/templates";

const statusCfg: Record<WFStatus, { label: string; dot: string; tone: string; Icon: LucideIcon }> = {
  active: { label: "Aktiv", dot: "bg-emerald-500", tone: "text-emerald-600 dark:text-emerald-400", Icon: CheckCircle2 },
  draft: { label: "Utkast", dot: "bg-fg/40", tone: "text-muted", Icon: Clock },
  paused: { label: "Pausad", dot: "bg-amber-500", tone: "text-amber-600 dark:text-amber-400", Icon: PauseCircle },
};

export function WorkflowListPage() {
  const toast = useToast();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | WFStatus>("all");

  const filtered = useMemo(() => {
    return templateList.filter((workflow) => {
      if (filter !== "all" && workflow.status !== filter) return false;
      const normalized = query.trim().toLowerCase();
      if (!normalized) return true;
      return workflow.name.toLowerCase().includes(normalized) || workflow.description.toLowerCase().includes(normalized);
    });
  }, [filter, query]);

  const totalRuns = templateList.reduce((sum, workflow) => sum + workflow.runs30d, 0);
  const totals = {
    active: templateList.filter((workflow) => workflow.status === "active").length,
    runs: totalRuns,
    success:
      templateList.reduce((sum, workflow) => sum + workflow.successRate * workflow.runs30d, 0) / Math.max(totalRuns, 1) || 0,
  };

  const menuFor = (workflow: WorkflowTemplate): RowMenuEntry[] => [
    { label: "Öppna i canvas", icon: ArrowRight, onClick: () => router.push(`/jetwp/workflow/${workflow.id}`) },
    { label: "Kör nu", icon: Play, onClick: () => toast.success("Kör workflow", workflow.name) },
    { divider: true },
    {
      label: workflow.status === "active" ? "Pausa" : "Aktivera",
      icon: workflow.status === "active" ? Pause : Play,
      onClick: () => toast.info(workflow.status === "active" ? "Pausad" : "Aktiverad", workflow.name),
    },
    { label: "Duplicera", icon: Copy, onClick: () => toast.success("Duplicerad", workflow.name) },
    { divider: true },
    { label: "Ta bort", icon: Trash2, danger: true, onClick: () => toast.error("Borttagen", workflow.name) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          JetWP
        </Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <PageHeader title="Arbetsflöden" subtitle="Automatisera återkommande arbetsflöden över dina sajter" />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => toast.info("Mallgalleri", "Bläddra bland färdiga flöden")}>Mallar</Button>
            <Button onClick={() => router.push("/jetwp/workflow/new")}>
              <Plus size={14} strokeWidth={2} className="mr-1.5" />
              Skapa arbetsflöde
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Totalt" value={String(templateList.length)} hint={`${totals.active} aktiva`} />
        <StatCard label="Körningar (30 dgr)" value={totals.runs.toLocaleString("sv-SE")} delta={12.4} />
        <StatCard label="Framgång" value={`${totals.success.toFixed(1)}%`} delta={0.3} hint="genomsnitt över alla flöden" />
        <StatCard label="Aktiva triggers" value={String(totals.active)} hint="lyssnar just nu" />
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input className="pl-9" placeholder="Sök arbetsflöde..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["all", "active", "draft", "paused"] as const).map((value) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  filter === value ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                )}
              >
                {value === "all" ? "Alla" : statusCfg[value].label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((workflow) => {
          const cfg = statusCfg[workflow.status];
          const icons = thumbnailIcons(workflow);
          return (
            <Card key={workflow.id} className="group relative overflow-hidden p-0 transition-shadow hover:shadow-pop">
              <Link href={`/jetwp/workflow/${workflow.id}`} className="block">
                <div className={clsx("relative h-28 border-b bg-gradient-to-br", workflow.accent)}>
                  <div className="absolute inset-0 flex items-center justify-center gap-2">
                    {icons.map((Icon, index) => (
                      <div
                        key={index}
                        className="flex h-8 w-8 items-center justify-center rounded-md border bg-surface/90 shadow-soft backdrop-blur-sm"
                        style={{ transform: `translateY(${index % 2 === 0 ? -4 : 4}px)` }}
                      >
                        <Icon size={14} className="text-fg/70" strokeWidth={1.75} />
                      </div>
                    ))}
                  </div>
                  <div className="absolute right-2 top-2 flex items-center gap-1.5 rounded-md border bg-surface/90 px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm">
                    <span className={clsx("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                    <span className={cfg.tone}>{cfg.label}</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start gap-2">
                    <WorkflowIcon size={14} className="mt-0.5 shrink-0 text-muted" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold tracking-tight">{workflow.name}</div>
                      <div className="mt-0.5 line-clamp-2 text-xs text-muted">{workflow.description}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 rounded-md border bg-bg px-2 py-1 text-[11px]">
                    <Zap size={11} className="shrink-0 text-muted" />
                    <span className="truncate font-mono text-muted">{workflow.trigger}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-center">
                    <Metric label="Noder" value={String(workflow.nodes.length)} />
                    <Metric label="Körn. 30 dgr" value={workflow.runs30d.toLocaleString("sv-SE")} />
                    <Metric label="Framgång" value={workflow.runs30d > 0 ? `${workflow.successRate}%` : "—"} />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
                    <span>Senaste körning: {workflow.lastRun}</span>
                    <span>{workflow.owner}</span>
                  </div>
                </div>
              </Link>

              <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="pointer-events-auto" onClick={(event) => event.preventDefault()}>
                  <RowMenu items={menuFor(workflow)} />
                </div>
              </div>
            </Card>
          );
        })}

        <button
          onClick={() => router.push("/jetwp/workflow/new")}
          className="flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-bg/40 p-6 text-center transition-colors hover:border-fg/40 hover:bg-bg"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fg/5">
            <Plus size={18} className="text-muted" />
          </div>
          <div className="text-sm font-medium">Skapa nytt arbetsflöde</div>
          <div className="text-xs text-muted">Börja från en tom canvas eller välj en mall</div>
        </button>
      </div>

      {filtered.length === 0 && (
        <Card className="p-10 text-center">
          <div className="text-sm font-medium">Inga arbetsflöden matchade</div>
          <div className="mt-1 text-xs text-muted">Justera filter eller sökterm.</div>
        </Card>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}
