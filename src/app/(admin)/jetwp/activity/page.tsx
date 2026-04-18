"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  HardDrive,
  Shield,
  RefreshCw,
  Lock,
  Zap,
  UploadCloud,
  User,
  Download,
  Search,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/toast/ToastProvider";
import { events, type ActivityEvent, type EventCategory, type EventLevel } from "./data";
import { sites } from "../data";

const categoryIcon: Record<EventCategory, LucideIcon> = {
  backup: HardDrive,
  security: Shield,
  update: RefreshCw,
  ssl: Lock,
  performance: Zap,
  deploy: UploadCloud,
  user: User,
};

const categoryLabel: Record<EventCategory, string> = {
  backup: "Backup",
  security: "Säkerhet",
  update: "Uppdatering",
  ssl: "SSL",
  performance: "Prestanda",
  deploy: "Deploy",
  user: "Användare",
};

const levelTone: Record<EventLevel, { bg: string; text: string; ring: string }> = {
  info: { bg: "bg-fg/5", text: "text-muted", ring: "ring-fg/10" },
  success: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/20" },
  warning: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-500/20" },
  error: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", ring: "ring-red-500/20" },
};

const levels: (EventLevel | "all")[] = ["all", "info", "success", "warning", "error"];
const levelLabel: Record<EventLevel | "all", string> = {
  all: "Alla",
  info: "Info",
  success: "OK",
  warning: "Varning",
  error: "Fel",
};

export default function ActivityPage() {
  const [level, setLevel] = useState<EventLevel | "all">("all");
  const [siteFilter, setSiteFilter] = useState<string>("all");
  const [category, setCategory] = useState<EventCategory | "all">("all");
  const [query, setQuery] = useState("");
  const toast = useToast();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (level !== "all" && e.level !== level) return false;
      if (siteFilter !== "all" && e.siteId !== siteFilter) return false;
      if (category !== "all" && e.category !== category) return false;
      if (q && !(e.title.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q) || e.siteName.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [level, siteFilter, category, query]);

  const counts = useMemo(() => {
    const c: Record<EventLevel, number> = { info: 0, success: 0, warning: 0, error: 0 };
    events.forEach((e) => c[e.level]++);
    return c;
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          JetWP
        </Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <PageHeader title="Aktivitet" subtitle="Realtidsström av händelser över alla hanterade sajter" />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => toast.info("Exporterar…", "CSV för senaste 24h")}>
              <Download size={14} strokeWidth={2} className="mr-1.5" />
              Exportera
            </Button>
            <Button onClick={() => toast.info("Uppdaterar…")}>
              <RefreshCw size={14} strokeWidth={2} className="mr-1.5" />
              Uppdatera
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniCount tone="info" label="Info" count={counts.info} />
        <MiniCount tone="success" label="Lyckade" count={counts.success} />
        <MiniCount tone="warning" label="Varningar" count={counts.warning} />
        <MiniCount tone="error" label="Fel" count={counts.error} />
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              className="pl-9"
              placeholder="Sök händelser…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex rounded-lg border bg-bg p-0.5">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  level === l ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                )}
              >
                {levelLabel[l]}
              </button>
            ))}
          </div>

          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="h-9 rounded-lg border bg-surface px-3 text-sm outline-none focus:border-fg/30"
          >
            <option value="all">Alla sajter</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as EventCategory | "all")}
            className="h-9 rounded-lg border bg-surface px-3 text-sm outline-none focus:border-fg/30"
          >
            <option value="all">Alla kategorier</option>
            {(Object.keys(categoryLabel) as EventCategory[]).map((c) => (
              <option key={c} value={c}>{categoryLabel[c]}</option>
            ))}
          </select>
        </div>
      </Card>

      <div className="text-xs text-muted">
        Visar {filtered.length} av {events.length} händelser
      </div>

      <div className="relative">
        <div className="absolute bottom-4 left-[23px] top-4 w-px bg-border" aria-hidden />
        <div className="space-y-1.5">
          {filtered.map((e) => (
            <EventRow key={e.id} event={e} />
          ))}
          {filtered.length === 0 && (
            <Card className="p-10 text-center text-sm text-muted">
              Inga händelser matchar dina filter
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniCount({ tone, label, count }: { tone: EventLevel; label: string; count: number }) {
  const t = levelTone[tone];
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className={clsx("h-2 w-2 rounded-full", t.bg.replace("/10", ""))} />
      <div>
        <div className="text-xs text-muted">{label}</div>
        <div className="text-lg font-semibold tabular-nums">{count}</div>
      </div>
    </Card>
  );
}

function EventRow({ event }: { event: ActivityEvent }) {
  const Icon = categoryIcon[event.category];
  const tone = levelTone[event.level];

  return (
    <div className="relative flex items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface">
      <div
        className={clsx(
          "relative z-10 mt-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-bg",
          tone.bg,
        )}
      >
        <Icon size={14} strokeWidth={2} className={tone.text} />
      </div>

      <div className="min-w-0 flex-1 py-1">
        <div className="flex items-baseline gap-2">
          <Link href={`/jetwp/${event.siteId}`} className="truncate text-sm font-medium hover:underline">
            {event.title}
          </Link>
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted">{event.time}</span>
        </div>
        {event.description && (
          <div className="mt-0.5 text-xs text-muted">{event.description}</div>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
          <Link
            href={`/jetwp/${event.siteId}`}
            className="inline-flex items-center gap-1 rounded-md border bg-surface px-1.5 py-0.5 font-medium hover:bg-bg"
          >
            <span className="h-1 w-1 rounded-full bg-fg" />
            {event.siteName}
          </Link>
          <span className="text-muted">{categoryLabel[event.category]}</span>
          {event.actor && (
            <>
              <span className="text-muted">·</span>
              <span className="text-muted">av {event.actor}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
