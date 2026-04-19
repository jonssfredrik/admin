"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ChevronUp, ExternalLink, FileText, Pencil, Plus, RefreshCw, Trash2, XCircle } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { RowMenu } from "@/components/ui/RowMenu";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AreaChart } from "@/components/charts/AreaChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { useToast } from "@/components/toast/ToastProvider";
import { AbonnemangDialog } from "@/modules/abonnemang/components/AbonnemangDialog";
import { useSubscriptions } from "@/modules/abonnemang/lib/useSubscriptions";
import {
  categoryMeta,
  computeCostTrend,
  statusMeta,
  toMonthly,
  type Subscription,
  type SubscriptionCategory,
  type SubscriptionStatus,
} from "@/modules/abonnemang/data/core";

type FilterTab = SubscriptionStatus | "all";
type SortKey = "name" | "monthly" | "renewal" | "category";

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: "all",       label: "Alla" },
  { value: "active",    label: "Aktiva" },
  { value: "trial",     label: "Testperiod" },
  { value: "paused",    label: "Pausade" },
  { value: "cancelled", label: "Avslutade" },
];

function renewalInfo(dateStr: string) {
  const d = new Date(dateStr);
  const diffDays = Math.floor((d.getTime() - Date.now()) / 86400000);
  const dateFormatted = d.toLocaleDateString("sv-SE", { day: "numeric", month: "short", year: "numeric" });
  const relative =
    diffDays < 0  ? "Förfallen" :
    diffDays === 0 ? "Idag" :
    diffDays === 1 ? "Imorgon" :
    diffDays < 31  ? `${diffDays} dagar`
    : `${Math.round(diffDays / 30)} mån`;
  return {
    dateFormatted,
    relative,
    urgent: diffDays >= 0 && diffDays < 14,
    warning: diffDays >= 14 && diffDays < 31,
    overdue: diffDays < 0,
  };
}

function formatSEK(amount: number) {
  return amount.toLocaleString("sv-SE", { maximumFractionDigits: 0 }) + " kr";
}

function SortTh({
  children,
  sortKey,
  current,
  dir,
  onSort,
  className,
}: {
  children: React.ReactNode;
  sortKey: SortKey;
  current: SortKey;
  dir: "asc" | "desc";
  onSort: (k: SortKey) => void;
  className?: string;
}) {
  const active = current === sortKey;
  return (
    <Th
      className={clsx("cursor-pointer select-none", className)}
      onClick={() => onSort(sortKey)}
    >
      <span className="flex items-center gap-1">
        {children}
        <ChevronUp
          size={10}
          className={clsx(
            "transition-transform",
            active ? "text-fg" : "opacity-30",
            active && dir === "desc" && "rotate-180",
          )}
        />
      </span>
    </Th>
  );
}

export function AbonnemangPage() {
  const { items, add, update, remove } = useSubscriptions();
  const { success, error } = useToast();

  const [tab, setTab]               = useState<FilterTab>("all");
  const [search, setSearch]         = useState("");
  const [categoryFilter, setCategoryFilter] = useState<SubscriptionCategory | "all">("all");
  const [sortKey, setSortKey]       = useState<SortKey>("renewal");
  const [sortDir, setSortDir]       = useState<"asc" | "desc">("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Subscription | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Subscription | null>(null);

  const active = useMemo(
    () => items.filter((s) => s.status === "active" || s.status === "trial"),
    [items],
  );

  const monthlyCost = useMemo(
    () => active.reduce((sum, s) => sum + toMonthly(s.amountSEK, s.billingCycle), 0),
    [active],
  );

  const annualCost = monthlyCost * 12;

  const expiringSoon = useMemo(
    () =>
      active.filter((s) => {
        const days = Math.floor((new Date(s.nextRenewal).getTime() - Date.now()) / 86400000);
        return days >= 0 && days < 31;
      }).length,
    [active],
  );

  const trialsSoon = useMemo(
    () =>
      items.filter((s) => {
        if (s.status !== "trial") return false;
        const days = Math.floor((new Date(s.nextRenewal).getTime() - Date.now()) / 86400000);
        return days >= 0 && days <= 14;
      }),
    [items],
  );

  const donutData = useMemo(() => {
    const byCategory: Record<string, number> = {};
    active.forEach((s) => {
      byCategory[s.category] = (byCategory[s.category] ?? 0) + toMonthly(s.amountSEK, s.billingCycle);
    });
    return Object.entries(byCategory)
      .filter(([, v]) => v > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([cat, value]) => ({
        label: categoryMeta[cat as SubscriptionCategory]?.label ?? cat,
        value: Math.round(value),
        color: categoryMeta[cat as SubscriptionCategory]?.color ?? "#888",
      }));
  }, [active]);

  const costTrend = useMemo(() => computeCostTrend(items), [items]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let list = tab === "all" ? items : items.filter((s) => s.status === tab);
    if (categoryFilter !== "all") list = list.filter((s) => s.category === categoryFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name")     cmp = a.name.localeCompare(b.name, "sv");
      if (sortKey === "monthly")  cmp = toMonthly(a.amountSEK, a.billingCycle) - toMonthly(b.amountSEK, b.billingCycle);
      if (sortKey === "renewal")  cmp = a.nextRenewal.localeCompare(b.nextRenewal);
      if (sortKey === "category") cmp = categoryMeta[a.category].label.localeCompare(categoryMeta[b.category].label, "sv");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [items, tab, categoryFilter, search, sortKey, sortDir]);

  const openAdd = () => { setEditTarget(undefined); setDialogOpen(true); };
  const openEdit = (sub: Subscription) => { setEditTarget(sub); setDialogOpen(true); };

  const handleSave = (data: Omit<Subscription, "id">) => {
    if (editTarget) {
      update(editTarget.id, data);
      success("Abonnemang uppdaterat", editTarget.name);
    } else {
      add(data);
      success("Abonnemang tillagt", data.name);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    error("Abonnemang borttaget", deleteTarget.name);
    setDeleteTarget(null);
  };

  const handleCancel = () => {
    if (!cancelTarget) return;
    update(cancelTarget.id, { status: "cancelled", cancelledAt: new Date().toISOString().slice(0, 10) });
    success("Prenumeration avslutad", cancelTarget.name);
    setCancelTarget(null);
  };

  const handleStatusToggle = (sub: Subscription) => {
    const next = sub.status === "paused" ? "active" : "paused";
    update(sub.id, { status: next });
    success(next === "active" ? "Återaktiverat" : "Pausat", sub.name);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Abonnemang"
          subtitle="Prenumerationer, löpande kostnader och förnyelsedatum."
        />
        <Button variant="primary" onClick={openAdd} className="gap-1.5">
          <Plus size={14} />
          Lägg till
        </Button>
      </div>

      {/* Trial expiry banner */}
      {trialsSoon.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm">
            <span className="font-medium text-amber-700 dark:text-amber-300">
              {trialsSoon.length === 1 ? "1 testperiod" : `${trialsSoon.length} testperioder`} avslutas snart
            </span>
            <span className="text-amber-600 dark:text-amber-400">
              {" "}— {trialsSoon.map((s) => s.name).join(", ")}
            </span>
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Aktiva abonnemang" value={String(active.length)} hint={`${items.length} totalt`} />
        <StatCard label="Månadskostnad" value={formatSEK(Math.round(monthlyCost))} hint="Aktiva + testperiod" />
        <StatCard label="Årskostnad" value={formatSEK(Math.round(annualCost))} hint="Prognos helår" />
        <StatCard
          label="Förfaller inom 30 dagar"
          value={String(expiringSoon)}
          hint={expiringSoon > 0 ? "Kräver åtgärd" : "Allt är lugnt"}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <div className="mb-1 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Månadskostnad över tid</h2>
              <p className="text-xs text-muted">Senaste 8 månaderna · SEK</p>
            </div>
          </div>
          <div className="mt-4">
            <AreaChart data={costTrend} height={190} formatValue={(v) => formatSEK(v)} />
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 text-sm font-semibold tracking-tight">Kostnad per kategori</h2>
          <p className="text-xs text-muted">Månadsvis fördelning · SEK</p>
          <div className="mt-5">
            <DonutChart data={donutData} size={150} />
          </div>
        </Card>
      </div>

      {/* List */}
      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Filter tabs */}
          <div className="flex gap-1 rounded-lg border bg-bg p-0.5">
            {FILTER_TABS.map((t) => {
              const count = t.value === "all" ? items.length : items.filter((s) => s.status === t.value).length;
              return (
                <button
                  key={t.value}
                  onClick={() => setTab(t.value)}
                  className={clsx(
                    "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    tab === t.value ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                  )}
                >
                  {t.label}
                  {count > 0 && (
                    <span className={clsx(
                      "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                      tab === t.value ? "bg-fg/10 text-fg" : "text-muted",
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as SubscriptionCategory | "all")}
              className="h-8 rounded-lg border bg-bg px-2 text-xs text-fg outline-none focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
            >
              <option value="all">Alla kategorier</option>
              {Object.entries(categoryMeta).map(([val, meta]) => (
                <option key={val} value={val}>{meta.label}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Sök abonnemang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 rounded-lg border bg-bg px-3 text-sm text-fg placeholder:text-muted outline-none focus:border-fg/30 focus:ring-2 focus:ring-fg/5 sm:w-48"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-muted">Inga abonnemang matchar filtret.</p>
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <SortTh sortKey="name"     current={sortKey} dir={sortDir} onSort={toggleSort}>Tjänst</SortTh>
                <SortTh sortKey="category" current={sortKey} dir={sortDir} onSort={toggleSort}>Kategori</SortTh>
                <Th>Status</Th>
                <Th>Fakturacykel</Th>
                <SortTh sortKey="monthly" current={sortKey} dir={sortDir} onSort={toggleSort} className="text-right">Kostnad</SortTh>
                <SortTh sortKey="renewal" current={sortKey} dir={sortDir} onSort={toggleSort}>Nästa förnyelse</SortTh>
                <Th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => {
                const cat     = categoryMeta[sub.category];
                const st      = statusMeta[sub.status];
                const ren     = renewalInfo(sub.nextRenewal);
                const monthly = toMonthly(sub.amountSEK, sub.billingCycle);
                const cycleShort =
                  sub.billingCycle === "monthly"   ? "/mån" :
                  sub.billingCycle === "quarterly"  ? "/kvartal" :
                  sub.billingCycle === "annual"     ? "/år" : "/2 år";

                return (
                  <tr key={sub.id} className="group transition-colors hover:bg-bg/50">
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: cat.color }} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-medium">
                            {sub.name}
                            {sub.website && (
                              <a
                                href={sub.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-fg"
                              >
                                <ExternalLink size={11} />
                              </a>
                            )}
                            {sub.notes && (
                              <span title={sub.notes} className="text-muted opacity-0 transition-opacity group-hover:opacity-100">
                                <FileText size={11} />
                              </span>
                            )}
                          </div>
                          {sub.description && (
                            <div className="truncate text-[11px] text-muted max-w-[160px]">{sub.description}</div>
                          )}
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <span className="text-xs text-muted">{cat.label}</span>
                    </Td>
                    <Td>
                      <Badge tone={st.tone}>{st.label}</Badge>
                    </Td>
                    <Td className="text-xs text-muted">
                      {sub.billingCycle === "monthly"   ? "Månadsvis"   :
                       sub.billingCycle === "quarterly"  ? "Kvartalsvis" :
                       sub.billingCycle === "annual"     ? "Årsvis"      : "Varannat år"}
                    </Td>
                    <Td className="text-right">
                      <div className="font-medium tabular-nums">
                        {formatSEK(sub.amountSEK)}{cycleShort}
                      </div>
                      {sub.billingCycle !== "monthly" && (
                        <div className="text-[11px] text-muted tabular-nums">
                          ≈ {formatSEK(Math.round(monthly))}/mån
                        </div>
                      )}
                    </Td>
                    <Td>
                      <div className={clsx(
                        "text-xs font-medium",
                        ren.overdue ? "text-red-600 dark:text-red-400" :
                        ren.urgent  ? "text-amber-600 dark:text-amber-400" : "text-fg",
                      )}>
                        {ren.dateFormatted}
                      </div>
                      <div className={clsx(
                        "text-[11px]",
                        ren.overdue ? "text-red-500 dark:text-red-400" :
                        ren.urgent  ? "text-amber-500 dark:text-amber-400" : "text-muted",
                      )}>
                        {ren.relative}
                      </div>
                    </Td>
                    <Td>
                      <RowMenu
                        items={[
                          { label: "Redigera", icon: Pencil, onClick: () => openEdit(sub) },
                          ...(sub.status !== "cancelled" ? [
                            {
                              label: sub.status === "paused" ? "Aktivera" : "Pausa",
                              icon: RefreshCw,
                              onClick: () => handleStatusToggle(sub),
                            },
                            {
                              label: "Avsluta prenumeration",
                              icon: XCircle,
                              onClick: () => setCancelTarget(sub),
                            },
                          ] : []),
                          { divider: true as const },
                          { label: "Ta bort", icon: Trash2, danger: true, onClick: () => setDeleteTarget(sub) },
                        ]}
                      />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>

      <AbonnemangDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initial={editTarget}
      />

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Avsluta prenumeration"
        description={cancelTarget ? `"${cancelTarget.name}" markeras som avslutad. Du kan ta bort den helt via Ta bort.` : ""}
        confirmLabel="Avsluta"
        tone="danger"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Ta bort abonnemang"
        description={deleteTarget ? `"${deleteTarget.name}" tas bort permanent.` : ""}
        confirmLabel="Ta bort"
        tone="danger"
      />
    </div>
  );
}
