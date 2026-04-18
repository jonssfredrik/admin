"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Play,
  RefreshCw,
  Archive,
  Power,
  Trash2,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Table";
import { RowMenu, type RowMenuEntry } from "@/components/ui/RowMenu";
import { useToast } from "@/components/toast/ToastProvider";
import { AddSiteDialog } from "../AddSiteDialog";
import { SiteThumb } from "../SiteThumb";
import { sites, type Site, type SiteStatus, type Plan } from "../data";
import { jobsForSite } from "../fleet";

type StatusFilter = "all" | SiteStatus | "stale" | "updates";
type SortKey = "name" | "health" | "heartbeat" | "updates" | "visits";
type SortDir = "asc" | "desc";
const PAGE_SIZE = 4;

const statusCfg: Record<SiteStatus, { label: string; dot: string; tone: string }> = {
  online: { label: "Online", dot: "bg-emerald-500", tone: "text-emerald-600 dark:text-emerald-400" },
  warning: { label: "Varning", dot: "bg-amber-500", tone: "text-amber-600 dark:text-amber-400" },
  maintenance: { label: "Underhåll", dot: "bg-blue-500", tone: "text-blue-600 dark:text-blue-400" },
  offline: { label: "Offline", dot: "bg-red-500", tone: "text-red-600 dark:text-red-400" },
};

const plans: ("all" | Plan)[] = ["all", "Starter", "Business", "Scale", "Enterprise"];

export default function SitesPage() {
  const toast = useToast();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [plan, setPlan] = useState<"all" | Plan>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [addOpen, setAddOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = sites.filter((s) => {
      if (plan !== "all" && s.plan !== plan) return false;
      if (status === "stale") {
        if (!s.heartbeatStale) return false;
      } else if (status === "updates") {
        if (s.updatesAvailable === 0 && !s.wpUpdateAvailable && !s.themeUpdateAvailable) return false;
      } else if (status !== "all" && s.status !== status) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.domain.toLowerCase().includes(q) ||
        s.server.toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "name": return a.name.localeCompare(b.name, "sv") * dir;
        case "health": return (a.healthScore - b.healthScore) * dir;
        case "heartbeat": return ((a.heartbeatStale ? 1 : 0) - (b.heartbeatStale ? 1 : 0)) * dir;
        case "updates": return (a.updatesAvailable - b.updatesAvailable) * dir;
        case "visits": return (a.visits30d - b.visits30d) * dir;
      }
    });
    return list;
  }, [query, status, plan, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allSelected = filtered.length > 0 && filtered.every((s) => selected[s.id]);
  const toggleAll = () => {
    if (allSelected) setSelected({});
    else setSelected(Object.fromEntries(filtered.map((s) => [s.id, true])));
  };
  const toggleOne = (id: string) => setSelected((p) => ({ ...p, [id]: !p[id] }));

  const bulkAction = (label: string) => {
    toast.success(label, `${selectedIds.length} sajter`);
    setSelected({});
  };

  const menuFor = (s: Site): RowMenuEntry[] => [
    { label: "Öppna detaljer", icon: ExternalLink, onClick: () => router.push(`/jetwp/${s.id}`) },
    { label: "Kör sync", icon: RefreshCw, onClick: () => toast.success("Synk startad", s.name) },
    { label: "Ny backup", icon: Archive, onClick: () => toast.success("Backup köad", s.name) },
    { divider: true },
    { label: "Queue job", icon: Play, onClick: () => router.push(`/jetwp/jobs/new?site=${s.id}`) },
    { divider: true },
    { label: s.status === "maintenance" ? "Avsluta underhåll" : "Underhållsläge", icon: Power, onClick: () => toast.info("Underhåll", s.name) },
    { label: "Ta bort sajt", icon: Trash2, danger: true, onClick: () => toast.error("Borttagen", s.name) },
  ];

  const totalUpdates = sites.reduce((s, x) => s + x.updatesAvailable, 0);
  const stale = sites.filter((s) => s.heartbeatStale).length;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          JetWP
        </Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <PageHeader title="Sites" subtitle="Hela flottan av WordPress-sajter som hanteras av JetWP-agenten" />
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={14} strokeWidth={2} className="mr-1.5" />
            Lägg till sajt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Totalt sajter" value={String(sites.length)} />
        <StatCard label="Online" value={String(sites.filter((s) => s.status === "online").length)} />
        <StatCard label="Stale heartbeats" value={String(stale)} />
        <StatCard label="Väntande uppdateringar" value={String(totalUpdates)} />
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input className="pl-9" placeholder="Sök namn, domän eller server…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["all", "online", "warning", "maintenance", "offline", "stale", "updates"] as StatusFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setStatus(f)}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  status === f ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                )}
              >
                {f === "all" ? "Alla" : f === "stale" ? "Stale" : f === "updates" ? "Uppdateringar" : statusCfg[f as SiteStatus].label}
              </button>
            ))}
          </div>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as "all" | Plan)}
            className="rounded-lg border bg-surface px-2.5 py-1.5 text-xs font-medium"
          >
            {plans.map((p) => (
              <option key={p} value={p}>{p === "all" ? "Alla planer" : p}</option>
            ))}
          </select>
        </div>
      </Card>

      {selectedIds.length > 0 && (
        <Card className="flex items-center justify-between p-3 px-4">
          <span className="text-sm"><strong>{selectedIds.length}</strong> sajter markerade</span>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => bulkAction("Synk körd")}>
              <RefreshCw size={13} className="mr-1.5" />Synk
            </Button>
            <Button variant="secondary" onClick={() => bulkAction("Backup köad")}>
              <Archive size={13} className="mr-1.5" />Backup
            </Button>
            <Button variant="secondary" onClick={() => bulkAction("Uppdateringar köade")}>
              <Play size={13} className="mr-1.5" />Kör uppdateringar
            </Button>
            <Button variant="secondary" onClick={() => setSelected({})}>Avmarkera</Button>
          </div>
        </Card>
      )}

      <div className="overflow-hidden rounded-2xl border bg-surface shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="w-10 border-b px-4 py-2.5">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-3.5 w-3.5 cursor-pointer" />
              </th>
              <SortTh label="Sajt" active={sortKey === "name"} dir={sortDir} onClick={() => toggleSort("name")} />
              <Th>Status</Th>
              <Th>Server · Stack</Th>
              <SortTh label="Heartbeat" active={sortKey === "heartbeat"} dir={sortDir} onClick={() => toggleSort("heartbeat")} />
              <SortTh label="Health" active={sortKey === "health"} dir={sortDir} onClick={() => toggleSort("health")} />
              <SortTh label="Updates" active={sortKey === "updates"} dir={sortDir} onClick={() => toggleSort("updates")} />
              <Th>Lagring</Th>
              <Th>SSL</Th>
              <Th>Jobs</Th>
              <SortTh label="Visits 30d" active={sortKey === "visits"} dir={sortDir} onClick={() => toggleSort("visits")} />
              <th className="w-10 border-b px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {paged.map((s) => {
              const cfg = statusCfg[s.status];
              const jobsCount = jobsForSite(s.id).length;
              const storagePct = Math.round((s.storageGB / s.storageLimitGB) * 100);
              return (
                <tr key={s.id} className={clsx("group transition-colors hover:bg-bg/60", selected[s.id] && "bg-bg")}>
                  <td className="border-b border-border/60 px-4 py-3">
                    <input type="checkbox" checked={!!selected[s.id]} onChange={() => toggleOne(s.id)} className="h-3.5 w-3.5 cursor-pointer" />
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <Link href={`/jetwp/${s.id}`} className="flex items-center gap-3">
                      <SiteThumb screenshot={s.screenshot} domain={s.domain} size="sm" />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{s.name}</div>
                        <div className="truncate text-[11px] text-muted">{s.domain}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      <span className={clsx("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                      <span className={cfg.tone}>{cfg.label}</span>
                    </span>
                    <div className="mt-0.5 text-[11px] text-muted">{s.plan} · {s.environment}</div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className="font-mono text-[11px]">{s.server}</div>
                    <div className="text-[11px] text-muted">WP {s.wp} · PHP {s.php}</div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={clsx("h-1.5 w-1.5 rounded-full", s.heartbeatStale ? "bg-amber-500" : "bg-emerald-500")} />
                      <span className="text-[12px]">{s.lastHeartbeat}</span>
                    </div>
                    <div className="text-[11px] text-muted">agent {s.agentVersion}</div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <HealthBar score={s.healthScore} />
                      <span className="w-8 text-right font-mono text-[12px] tabular-nums">{s.healthScore}</span>
                    </div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.wpUpdateAvailable && <Badge tone="warning">WP</Badge>}
                      {s.updatesAvailable > 0 && <Badge tone="warning">{s.updatesAvailable} plugin</Badge>}
                      {s.themeUpdateAvailable && <Badge tone="warning">tema</Badge>}
                      {s.securityUpdates > 0 && <Badge tone="danger">{s.securityUpdates} säk</Badge>}
                      {!s.wpUpdateAvailable && s.updatesAvailable === 0 && !s.themeUpdateAvailable && s.securityUpdates === 0 && (
                        <span className="text-[11px] text-muted">—</span>
                      )}
                    </div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className="text-[12px] font-medium tabular-nums">{s.storageGB}/{s.storageLimitGB} GB</div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-fg/5">
                      <div className={clsx("h-full", storagePct > 85 ? "bg-amber-500" : "bg-fg/60")} style={{ width: `${storagePct}%` }} />
                    </div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className={clsx("text-[12px] font-medium", s.sslDays < 30 && "text-amber-600 dark:text-amber-400")}>
                      {s.sslDays} dagar
                    </div>
                    <div className="text-[11px] text-muted">auto-renew</div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.failingJobs > 0 && <Badge tone="danger">{s.failingJobs} failed</Badge>}
                      {s.pendingJobs > 0 && <Badge tone="neutral">{s.pendingJobs} pending</Badge>}
                      {s.failingJobs === 0 && s.pendingJobs === 0 && (
                        <span className="text-[11px] text-muted">{jobsCount} totalt</span>
                      )}
                    </div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3 font-mono text-[12px] tabular-nums text-muted">
                    {s.visits30d.toLocaleString("sv-SE")}
                  </td>
                  <td className="border-b border-border/60 px-2 py-3">
                    <RowMenu items={menuFor(s)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-muted">Inga sajter matchade filtret.</div>
        )}
      </div>

      {filtered.length > 0 && (
        <Card className="flex items-center justify-between p-3 px-4">
          <span className="text-sm text-muted">
            Sida {page} av {totalPages} · visar {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} av {filtered.length}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Föregående
            </Button>
            <Button variant="secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Nästa
            </Button>
          </div>
        </Card>
      )}

      <AddSiteDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="border-b px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted">{children}</th>;
}

function SortTh({ label, active, dir, onClick }: { label: string; active: boolean; dir: SortDir; onClick: () => void }) {
  return (
    <th className="border-b px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted">
      <button onClick={onClick} className={clsx("inline-flex items-center gap-1 transition-colors hover:text-fg", active && "text-fg")}>
        {label}
        {active ? (dir === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} />) : <ArrowUpDown size={11} className="opacity-40" />}
      </button>
    </th>
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
