"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Search,
  Workflow as WorkflowIcon,
  Play,
  Pause,
  Copy,
  Trash2,
  ArrowRight,
  CheckCircle2,
  Clock,
  PauseCircle,
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
import { templateList, thumbnailIcons, type WorkflowTemplate, type WFStatus } from "./templates";

const statusCfg: Record<WFStatus, { label: string; dot: string; tone: string; Icon: LucideIcon }> = {
  active: { label: "Aktiv", dot: "bg-emerald-500", tone: "text-emerald-600 dark:text-emerald-400", Icon: CheckCircle2 },
  draft: { label: "Utkast", dot: "bg-fg/40", tone: "text-muted", Icon: Clock },
  paused: { label: "Pausad", dot: "bg-amber-500", tone: "text-amber-600 dark:text-amber-400", Icon: PauseCircle },
};

export default function WorkflowListPage() {
  const toast = useToast();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | WFStatus>("all");

  const filtered = useMemo(() => {
    return templateList.filter((w) => {
      if (filter !== "all" && w.status !== filter) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q);
    });
  }, [query, filter]);

  const totalRuns = templateList.reduce((s, w) => s + w.runs30d, 0);
  const totals = {
    active: templateList.filter((w) => w.status === "active").length,
    runs: totalRuns,
    success:
      templateList.reduce((s, w) => s + w.successRate * w.runs30d, 0) / Math.max(totalRuns, 1) || 0,
  };

  const menuFor = (w: WorkflowTemplate): RowMenuEntry[] => [
    { label: "Öppna i canvas", icon: ArrowRight, onClick: () => router.push(`/jetwp/workflow/${w.id}`) },
    { label: "Kör nu", icon: Play, onClick: () => toast.success("Kör workflow", w.name) },
    { divider: true },
    { label: w.status === "active" ? "Pausa" : "Aktivera", icon: w.status === "active" ? Pause : Play, onClick: () => toast.info(w.status === "active" ? "Pausad" : "Aktiverad", w.name) },
    { label: "Duplicera", icon: Copy, onClick: () => toast.success("Duplicerad", w.name) },
    { divider: true },
    { label: "Ta bort", icon: Trash2, danger: true, onClick: () => toast.error("Borttagen", w.name) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          JetWP
        </Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <PageHeader title="Workflows" subtitle="Automatisera återkommande arbetsflöden över dina sajter" />
          <div className="flex gap-2">
          <Button variant="secondary" onClick={() => toast.info("Mall-galleri", "Bläddra bland färdiga flöden")}>
            Mallar
          </Button>
          <Button onClick={() => router.push("/jetwp/workflow/new")}>
            <Plus size={14} strokeWidth={2} className="mr-1.5" />
            Skapa workflow
          </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Totalt" value={String(templateList.length)} hint={`${totals.active} aktiva`} />
        <StatCard label="Körningar (30d)" value={totals.runs.toLocaleString("sv-SE")} delta={12.4} />
        <StatCard label="Framgång" value={`${totals.success.toFixed(1)}%`} delta={0.3} hint="genomsnitt alla flöden" />
        <StatCard label="Aktiva triggers" value={String(totals.active)} hint="lyssnar just nu" />
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input className="pl-9" placeholder="Sök workflow…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["all", "active", "draft", "paused"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  filter === f ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                )}
              >
                {f === "all" ? "Alla" : statusCfg[f].label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((w) => {
          const cfg = statusCfg[w.status];
          const icons = thumbnailIcons(w);
          return (
            <Card key={w.id} className="group relative overflow-hidden p-0 transition-shadow hover:shadow-pop">
              <Link href={`/jetwp/workflow/${w.id}`} className="block">
                <div className={clsx("relative h-28 border-b bg-gradient-to-br", w.accent)}>
                  <div className="absolute inset-0 flex items-center justify-center gap-2">
                    {icons.map((Icon, i) => (
                      <div
                        key={i}
                        className="flex h-8 w-8 items-center justify-center rounded-md border bg-surface/90 shadow-soft backdrop-blur-sm"
                        style={{ transform: `translateY(${i % 2 === 0 ? -4 : 4}px)` }}
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
                      <div className="truncate text-sm font-semibold tracking-tight">{w.name}</div>
                      <div className="mt-0.5 line-clamp-2 text-xs text-muted">{w.description}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 rounded-md border bg-bg px-2 py-1 text-[11px]">
                    <Zap size={11} className="shrink-0 text-muted" />
                    <span className="truncate font-mono text-muted">{w.trigger}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-center">
                    <Metric label="Noder" value={String(w.nodes.length)} />
                    <Metric label="Körn. 30d" value={w.runs30d.toLocaleString("sv-SE")} />
                    <Metric label="Framgång" value={w.runs30d > 0 ? `${w.successRate}%` : "—"} />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
                    <span>Senaste körning: {w.lastRun}</span>
                    <span>{w.owner}</span>
                  </div>
                </div>
              </Link>

              <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="pointer-events-auto" onClick={(e) => e.preventDefault()}>
                  <RowMenu items={menuFor(w)} />
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
          <div className="text-sm font-medium">Skapa nytt workflow</div>
          <div className="text-xs text-muted">Börja från en tom canvas eller välj en mall</div>
        </button>
      </div>

      {filtered.length === 0 && (
        <Card className="p-10 text-center">
          <div className="text-sm font-medium">Inga workflows matchade</div>
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
