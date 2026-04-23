"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpDown,
  ExternalLink,
  Play,
  Plus,
  Power,
  RefreshCw,
  Search,
  Trash2,
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
import { AddSiteDialog } from "@/modules/jetwp/components/AddSiteDialog";
import { SiteThumb } from "@/modules/jetwp/components/SiteThumb";
import { jobsForSite, sites, type Plan, type SiteRecord, type SiteStatus } from "@/modules/jetwp/data";
import { getFilteredSites, getSiteListStats, type SiteSortDir, type SiteSortKey } from "@/modules/jetwp/selectors/sites";

type StatusFilter = "all" | SiteStatus | "stale" | "updates";

const PAGE_SIZE = 4;

const statusCfg: Record<SiteStatus, { label: string; dot: string; tone: string }> = {
  online: { label: "Tillgänglig", dot: "bg-emerald-500", tone: "text-emerald-600 dark:text-emerald-400" },
  warning: { label: "Varning", dot: "bg-amber-500", tone: "text-amber-600 dark:text-amber-400" },
  maintenance: { label: "Underhåll", dot: "bg-blue-500", tone: "text-blue-600 dark:text-blue-400" },
  offline: { label: "Nere", dot: "bg-red-500", tone: "text-red-600 dark:text-red-400" },
};

const envLabels = {
  production: "produktion",
  staging: "testmiljö",
} as const;

const plans: ("all" | Plan)[] = ["all", "Starter", "Business", "Scale", "Enterprise"];

export function SitesPage() {
  const toast = useToast();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [plan, setPlan] = useState<"all" | Plan>("all");
  const [sortKey, setSortKey] = useState<SiteSortKey>("name");
  const [sortDir, setSortDir] = useState<SiteSortDir>("asc");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [addOpen, setAddOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => getFilteredSites(sites, { query, status, plan }, sortKey, sortDir),
    [plan, query, sortDir, sortKey, status],
  );

  const toggleSort = (key: SiteSortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const selectedIds = Object.keys(selected).filter((key) => selected[key]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allSelected = filtered.length > 0 && filtered.every((site) => selected[site.id]);

  const toggleAll = () => {
    if (allSelected) setSelected({});
    else setSelected(Object.fromEntries(filtered.map((site) => [site.id, true])));
  };

  const toggleOne = (id: string) => setSelected((current) => ({ ...current, [id]: !current[id] }));

  const bulkAction = (label: string) => {
    toast.success(label, `${selectedIds.length} sajter`);
    setSelected({});
  };

  const menuFor = (site: SiteRecord): RowMenuEntry[] => [
    { label: "Öppna detaljer", icon: ExternalLink, onClick: () => router.push(`/jetwp/${site.id}`) },
    { label: "Kör synk", icon: RefreshCw, onClick: () => toast.success("Synk startad", site.name) },
    { label: "Nytt jobb", icon: Play, onClick: () => router.push(`/jetwp/jobs/new?site=${site.id}`) },
    { divider: true },
    {
      label: site.status === "maintenance" ? "Avsluta underhåll" : "Underhållsläge",
      icon: Power,
      onClick: () => toast.info("Underhåll", site.name),
    },
    { label: "Ta bort sajt", icon: Trash2, danger: true, onClick: () => toast.error("Borttagen", site.name) },
  ];

  const stats = useMemo(() => getSiteListStats(sites), []);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          JetWP
        </Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <PageHeader title="Sajter" subtitle="WordPress-installationer som hanteras av JetWP-agenten" />
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={14} strokeWidth={2} className="mr-1.5" />
            Lägg till sajt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Totalt sajter" value={String(stats.total)} />
        <StatCard label="Tillgängliga" value={String(stats.online)} />
        <StatCard label="Fördröjda incheckningar" value={String(stats.stale)} />
        <StatCard label="Väntande uppdateringar" value={String(stats.totalUpdates)} />
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input className="pl-9" placeholder="Sök namn, domän eller plan..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["all", "online", "warning", "maintenance", "offline", "stale", "updates"] as StatusFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatus(filter)}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  status === filter ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                )}
              >
                {filter === "all" ? "Alla" : filter === "stale" ? "Fördröjda" : filter === "updates" ? "Uppdateringar" : statusCfg[filter as SiteStatus].label}
              </button>
            ))}
          </div>
          <select
            value={plan}
            onChange={(event) => setPlan(event.target.value as "all" | Plan)}
            className="rounded-lg border bg-surface px-2.5 py-1.5 text-xs font-medium"
          >
            {plans.map((item) => (
              <option key={item} value={item}>{item === "all" ? "Alla planer" : item}</option>
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
              <Th>Miljö · stack</Th>
              <SortTh label="Incheckning" active={sortKey === "heartbeat"} dir={sortDir} onClick={() => toggleSort("heartbeat")} />
              <SortTh label="Statuspoäng" active={sortKey === "health"} dir={sortDir} onClick={() => toggleSort("health")} />
              <SortTh label="Uppdateringar" active={sortKey === "updates"} dir={sortDir} onClick={() => toggleSort("updates")} />
              <Th>Lagring</Th>
              <Th>SSL</Th>
              <Th>Jobb</Th>
              <SortTh label="Besök 30 dgr" active={sortKey === "visits"} dir={sortDir} onClick={() => toggleSort("visits")} />
              <th className="w-10 border-b px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {paged.map((site) => {
              const cfg = statusCfg[site.status];
              const jobsCount = jobsForSite(site.id).length;
              const storagePct = Math.round((site.storageGB / site.storageLimitGB) * 100);
              return (
                <tr key={site.id} className={clsx("group transition-colors hover:bg-bg/60", selected[site.id] && "bg-bg")}>
                  <td className="border-b border-border/60 px-4 py-3">
                    <input type="checkbox" checked={!!selected[site.id]} onChange={() => toggleOne(site.id)} className="h-3.5 w-3.5 cursor-pointer" />
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <Link href={`/jetwp/${site.id}`} className="flex items-center gap-3">
                      <SiteThumb screenshot={site.screenshot} domain={site.domain} size="sm" />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{site.name}</div>
                        <div className="truncate text-[11px] text-muted">{site.domain}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      <span className={clsx("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                      <span className={cfg.tone}>{cfg.label}</span>
                    </span>
                    <div className="mt-0.5 text-[11px] text-muted">{site.plan} · {envLabels[site.environment]}</div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className="font-mono text-[11px]">{site.server}</div>
                    <div className="text-[11px] text-muted">WP {site.wp} · PHP {site.php}</div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={clsx("h-1.5 w-1.5 rounded-full", site.heartbeatStale ? "bg-amber-500" : "bg-emerald-500")} />
                      <span className="text-[12px]">{site.lastHeartbeat}</span>
                    </div>
                    <div className="text-[11px] text-muted">agent {site.agentVersion}</div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <HealthBar score={site.healthScore} />
                      <span className="w-8 text-right font-mono text-[12px] tabular-nums">{site.healthScore}</span>
                    </div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {site.wpUpdateAvailable && <Badge tone="warning">WP</Badge>}
                      {site.updatesAvailable > 0 && <Badge tone="warning">{site.updatesAvailable} plugin</Badge>}
                      {site.themeUpdateAvailable && <Badge tone="warning">tema</Badge>}
                      {site.securityUpdates > 0 && <Badge tone="danger">{site.securityUpdates} säkerhet</Badge>}
                      {!site.wpUpdateAvailable && site.updatesAvailable === 0 && !site.themeUpdateAvailable && site.securityUpdates === 0 && (
                        <span className="text-[11px] text-muted">—</span>
                      )}
                    </div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className="text-[12px] font-medium tabular-nums">{site.storageGB}/{site.storageLimitGB} GB</div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-fg/5">
                      <div className={clsx("h-full", storagePct > 85 ? "bg-amber-500" : "bg-fg/60")} style={{ width: `${storagePct}%` }} />
                    </div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className={clsx("text-[12px] font-medium", site.sslDays < 30 && "text-amber-600 dark:text-amber-400")}>
                      {site.sslDays} dagar
                    </div>
                    <div className="text-[11px] text-muted">automatisk förnyelse</div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {site.failingJobs > 0 && <Badge tone="danger">{site.failingJobs} fel</Badge>}
                      {site.pendingJobs > 0 && <Badge tone="neutral">{site.pendingJobs} väntar</Badge>}
                      {site.failingJobs === 0 && site.pendingJobs === 0 && <span className="text-[11px] text-muted">{jobsCount} totalt</span>}
                    </div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3 font-mono text-[12px] tabular-nums text-muted">
                    {site.visits30d.toLocaleString("sv-SE")}
                  </td>
                  <td className="border-b border-border/60 px-2 py-3">
                    <RowMenu items={menuFor(site)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-10 text-center text-sm text-muted">Inga sajter matchade filtret.</div>}
      </div>

      {filtered.length > 0 && (
        <Card className="flex items-center justify-between p-3 px-4">
          <span className="text-sm text-muted">
            Sida {page} av {totalPages} · visar {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} av {filtered.length}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
              Föregående
            </Button>
            <Button variant="secondary" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>
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

function SortTh({ label, active, dir, onClick }: { label: string; active: boolean; dir: SiteSortDir; onClick: () => void }) {
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
