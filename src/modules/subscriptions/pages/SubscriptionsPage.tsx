"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Archive, ArchiveRestore, CheckCircle, CheckCircle2, ChevronUp, Copy, Download, ExternalLink, FileText, Pencil, Plus, RefreshCw, TrendingUp, Trash2, Trophy, Upload, XCircle } from "lucide-react";
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
import { SubscriptionDialog } from "@/modules/subscriptions/components/SubscriptionDialog";
import { useSubscriptions } from "@/modules/subscriptions/lib/useSubscriptions";
import {
  categoryMeta,
  computeCostTrend,
  cycleShortLabel,
  formatSEK,
  ownerMeta,
  paymentMethodMeta,
  statusMeta,
  toMonthly,
  type BillingCycle,
  type OwnerScope,
  type PaymentMethod,
  type Subscription,
  type SubscriptionCategory,
  type SubscriptionStatus,
} from "@/modules/subscriptions/data/core";

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

function parseCSV(text: string): string[][] {
  const clean = text.replace(/^\ufeff/, "");
  const firstLine = clean.split(/\r?\n/, 1)[0] ?? "";
  const delim = firstLine.includes(";") && !firstLine.includes(",") ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (inQuotes) {
      if (ch === '"') {
        if (clean[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
      } else cell += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === delim) { row.push(cell); cell = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && clean[i + 1] === "\n") i++;
        row.push(cell); cell = "";
        rows.push(row); row = [];
      } else cell += ch;
    }
  }
  if (cell.length > 0 || row.length > 0) { row.push(cell); rows.push(row); }
  return rows;
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

export function SubscriptionsPage() {
  const { items: rawItems, add, update, remove, duplicate, markPaid, setArchived, replaceAll } = useSubscriptions();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { success, error, info } = useToast();

  const [donutView, setDonutView]   = useState<"monthly" | "annual">("monthly");
  const [tab, setTab]               = useState<FilterTab>("all");
  const [search, setSearch]         = useState("");
  const [categoryFilter, setCategoryFilter] = useState<SubscriptionCategory | "all">("all");
  const [ownerFilter, setOwnerFilter] = useState<OwnerScope | "all">("all");
  const [showArchived, setShowArchived] = useState(false);
  const [sortKey, setSortKey]       = useState<SortKey>("renewal");
  const [sortDir, setSortDir]       = useState<"asc" | "desc">("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Subscription | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Subscription | null>(null);

  const items = useMemo(
    () => (showArchived ? rawItems : rawItems.filter((s) => !s.archived)),
    [rawItems, showArchived],
  );

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
    const multiplier = donutView === "annual" ? 12 : 1;
    active.forEach((s) => {
      byCategory[s.category] = (byCategory[s.category] ?? 0) + toMonthly(s.amountSEK, s.billingCycle) * multiplier;
    });
    return Object.entries(byCategory)
      .filter(([, v]) => v > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([cat, value]) => ({
        label: categoryMeta[cat as SubscriptionCategory]?.label ?? cat,
        value: Math.round(value),
        color: categoryMeta[cat as SubscriptionCategory]?.color ?? "#888",
      }));
  }, [active, donutView]);

  const priciestByCategory = useMemo(() => {
    const map = new Map<SubscriptionCategory, Subscription>();
    active.forEach((s) => {
      const curr = map.get(s.category);
      if (!curr || toMonthly(s.amountSEK, s.billingCycle) > toMonthly(curr.amountSEK, curr.billingCycle)) {
        map.set(s.category, s);
      }
    });
    return Array.from(map.values())
      .sort((a, b) => toMonthly(b.amountSEK, b.billingCycle) - toMonthly(a.amountSEK, a.billingCycle))
      .slice(0, 5);
  }, [active]);

  const biggestChanges = useMemo(() => {
    return active
      .filter((s) => s.priceHistory && s.priceHistory.length >= 2)
      .map((s) => {
        const h = s.priceHistory!;
        const first = h[0].amountSEK;
        const last = h[h.length - 1].amountSEK;
        return { sub: s, diff: last - first, pct: first > 0 ? ((last - first) / first) * 100 : 0 };
      })
      .filter((x) => x.diff !== 0)
      .sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))
      .slice(0, 5);
  }, [active]);

  const costTrend = useMemo(() => computeCostTrend(items), [items]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let list = tab === "all" ? items : items.filter((s) => s.status === tab);
    if (categoryFilter !== "all") list = list.filter((s) => s.category === categoryFilter);
    if (ownerFilter !== "all") list = list.filter((s) => (s.owner ?? "private") === ownerFilter);
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
  }, [items, tab, categoryFilter, ownerFilter, search, sortKey, sortDir]);

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

  const handleMarkPaid = (sub: Subscription) => {
    markPaid(sub.id);
    success("Markerad som betald", `${sub.name} — nästa förnyelse framflyttad`);
  };

  const handleDuplicate = (sub: Subscription) => {
    duplicate(sub.id);
    info("Abonnemang duplicerat", `${sub.name} (kopia)`);
  };

  const handleArchiveToggle = (sub: Subscription) => {
    const next = !sub.archived;
    setArchived(sub.id, next);
    success(next ? "Arkiverat" : "Återställt", sub.name);
  };

  const handleKeepTrial = (sub: Subscription) => {
    update(sub.id, { status: "active" });
    success("Behållen", `${sub.name} — nu aktiv prenumeration`);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (rows.length < 2) {
        error("Import misslyckades", "Filen innehåller inga rader");
        return;
      }
      const header = rows[0].map((h) => h.trim().toLowerCase());
      const col = (name: string) => header.indexOf(name);
      const idx = {
        namn: col("namn"),
        beskrivning: col("beskrivning"),
        kategori: col("kategori"),
        status: col("status"),
        belopp: col("belopp_sek"),
        cykel: col("cykel"),
        start: col("start"),
        nasta: col("nasta_fornyelse"),
        avslutad: col("avslutad"),
        betalmetod: col("betalmetod"),
        typ: col("typ"),
        foretag: col("foretag"),
        paminn: col("paminn_dagar"),
        arkiverad: col("arkiverad"),
        webb: col("webbplats"),
        noter: col("anteckningar"),
      };
      if (idx.namn < 0 || idx.belopp < 0 || idx.nasta < 0) {
        error("Import misslyckades", "Saknar obligatoriska kolumner: namn, belopp_sek, nasta_fornyelse");
        return;
      }
      const validCats = Object.keys(categoryMeta) as SubscriptionCategory[];
      const validCycles: BillingCycle[] = ["monthly", "quarterly", "annual", "biannual"];
      const validStatuses: SubscriptionStatus[] = ["active", "trial", "paused", "cancelled"];
      const validMethods = Object.keys(paymentMethodMeta) as PaymentMethod[];
      const validOwners = Object.keys(ownerMeta) as OwnerScope[];

      const imported: Subscription[] = [];
      let skipped = 0;
      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (row.length === 1 && row[0].trim() === "") continue;
        const name = row[idx.namn]?.trim();
        const amount = parseFloat(row[idx.belopp] ?? "");
        const nasta = row[idx.nasta]?.trim();
        if (!name || !Number.isFinite(amount) || !nasta) { skipped++; continue; }
        const cat = row[idx.kategori]?.trim() as SubscriptionCategory;
        const cycle = row[idx.cykel]?.trim() as BillingCycle;
        const status = row[idx.status]?.trim() as SubscriptionStatus;
        const sub: Subscription = {
          id: `sub-${Date.now()}-${r}`,
          name,
          description: (idx.beskrivning >= 0 ? row[idx.beskrivning] : "") ?? "",
          category: validCats.includes(cat) ? cat : "saas",
          status: validStatuses.includes(status) ? status : "active",
          amountSEK: Math.round(amount),
          billingCycle: validCycles.includes(cycle) ? cycle : "monthly",
          startedAt: row[idx.start]?.trim() || new Date().toISOString().slice(0, 10),
          nextRenewal: nasta,
        };
        if (idx.avslutad >= 0 && row[idx.avslutad]?.trim()) sub.cancelledAt = row[idx.avslutad].trim();
        if (idx.betalmetod >= 0) {
          const pm = row[idx.betalmetod]?.trim() as PaymentMethod;
          if (validMethods.includes(pm)) sub.paymentMethod = pm;
        }
        if (idx.typ >= 0) {
          const own = row[idx.typ]?.trim() as OwnerScope;
          if (validOwners.includes(own)) sub.owner = own;
        }
        if (idx.foretag >= 0) sub.businessExpense = /ja|true|1/i.test(row[idx.foretag] ?? "");
        if (idx.paminn >= 0) {
          const n = parseInt(row[idx.paminn] ?? "");
          if (Number.isFinite(n)) sub.reminderDaysBefore = n;
        }
        if (idx.arkiverad >= 0) sub.archived = /ja|true|1/i.test(row[idx.arkiverad] ?? "");
        if (idx.webb >= 0 && row[idx.webb]?.trim()) sub.website = row[idx.webb].trim();
        if (idx.noter >= 0 && row[idx.noter]?.trim()) sub.notes = row[idx.noter].trim();
        imported.push(sub);
      }
      if (imported.length === 0) {
        error("Import misslyckades", `Inga giltiga rader (${skipped} hoppade över)`);
        return;
      }
      replaceAll([...imported, ...rawItems]);
      success("Import klar", `${imported.length} abonnemang importerade${skipped ? ` · ${skipped} hoppade över` : ""}`);
    } catch (err) {
      error("Import misslyckades", err instanceof Error ? err.message : "Okänt fel");
    }
  };

  const handleExportCSV = () => {
    const header = [
      "namn","beskrivning","kategori","status","belopp_sek","cykel",
      "start","nasta_fornyelse","avslutad","betalmetod","typ","foretag",
      "paminn_dagar","arkiverad","webbplats","anteckningar",
    ];
    const rows = rawItems.map((s) => [
      s.name, s.description, s.category, s.status, String(s.amountSEK), s.billingCycle,
      s.startedAt, s.nextRenewal, s.cancelledAt ?? "", s.paymentMethod ?? "", s.owner ?? "",
      s.businessExpense ? "ja" : "nej", String(s.reminderDaysBefore ?? ""),
      s.archived ? "ja" : "nej", s.website ?? "", s.notes ?? "",
    ]);
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map((r) => r.map(escape).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `abonnemang-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    info("CSV exporterad", `${rawItems.length} rader`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Abonnemang"
          subtitle="Prenumerationer, löpande kostnader och förnyelsedatum."
        />
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleImportFile}
            className="hidden"
          />
          <Button variant="secondary" onClick={handleImportClick} className="gap-1.5">
            <Upload size={14} />
            Importera
          </Button>
          <Button variant="secondary" onClick={handleExportCSV} className="gap-1.5">
            <Download size={14} />
            Exportera
          </Button>
          <Button variant="primary" onClick={openAdd} className="gap-1.5">
            <Plus size={14} />
            Lägg till
          </Button>
        </div>
      </div>

      {/* Trial expiry banner */}
      {trialsSoon.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                {trialsSoon.length === 1 ? "1 testperiod" : `${trialsSoon.length} testperioder`} avslutas snart
              </p>
              <div className="mt-2 space-y-1.5">
                {trialsSoon.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-2 rounded-md bg-amber-500/10 px-2.5 py-1.5 text-sm">
                    <span className="truncate text-amber-800 dark:text-amber-200">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-amber-600/80 dark:text-amber-400/80">
                        {" "}· {formatSEK(s.amountSEK)}{cycleShortLabel(s.billingCycle)}
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleKeepTrial(s)}
                        className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
                      >
                        <CheckCircle size={11} /> Behåll
                      </button>
                      <button
                        onClick={() => setCancelTarget(s)}
                        className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-700 hover:bg-red-500/20 dark:text-red-300"
                      >
                        <XCircle size={11} /> Avsluta
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Kostnad per kategori</h2>
              <p className="text-xs text-muted">
                {donutView === "monthly" ? "Månadsvis" : "Årsvis"} fördelning · SEK
              </p>
            </div>
            <div className="flex rounded-lg border bg-bg p-0.5 text-[11px]">
              {(["monthly", "annual"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setDonutView(v)}
                  className={clsx(
                    "rounded-md px-2 py-0.5 font-medium transition-colors",
                    donutView === v ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                  )}
                >
                  {v === "monthly" ? "Mån" : "År"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <DonutChart data={donutData} size={150} />
          </div>
        </Card>
      </div>

      {/* Insights */}
      {(priciestByCategory.length > 0 || biggestChanges.length > 0) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="p-0">
            <div className="flex items-center gap-2 border-b px-5 py-3.5">
              <Trophy size={14} className="text-amber-500" />
              <h2 className="text-sm font-semibold tracking-tight">Dyrast per kategori</h2>
            </div>
            {priciestByCategory.length === 0 ? (
              <div className="px-5 py-6 text-sm text-muted">Inga aktiva abonnemang.</div>
            ) : (
              <div className="divide-y">
                {priciestByCategory.map((sub) => {
                  const cat = categoryMeta[sub.category];
                  return (
                    <Link
                      key={sub.id}
                      href={`/subscriptions/${sub.id}`}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-bg/50"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: cat.color }} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{sub.name}</div>
                        <div className="text-xs text-muted">{cat.label}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium tabular-nums">
                          {formatSEK(sub.amountSEK)}{cycleShortLabel(sub.billingCycle)}
                        </div>
                        {sub.billingCycle !== "monthly" && (
                          <div className="text-[11px] text-muted tabular-nums">
                            ≈ {formatSEK(Math.round(toMonthly(sub.amountSEK, sub.billingCycle)))}/mån
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="p-0">
            <div className="flex items-center gap-2 border-b px-5 py-3.5">
              <TrendingUp size={14} className="text-muted" />
              <h2 className="text-sm font-semibold tracking-tight">Största prisändringar</h2>
            </div>
            {biggestChanges.length === 0 ? (
              <div className="px-5 py-6 text-sm text-muted">
                Inga loggade prisändringar ännu. Priset loggas automatiskt när du redigerar beloppet.
              </div>
            ) : (
              <div className="divide-y">
                {biggestChanges.map(({ sub, diff, pct }) => (
                  <Link
                    key={sub.id}
                    href={`/subscriptions/${sub.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-bg/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{sub.name}</div>
                      <div className="text-xs text-muted">
                        {sub.priceHistory!.length} prispunkter · sedan {new Date(sub.priceHistory![0].date).toLocaleDateString("sv-SE", { month: "short", year: "2-digit" })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={clsx(
                        "text-sm font-medium tabular-nums",
                        diff > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400",
                      )}>
                        {diff > 0 ? "+" : ""}{formatSEK(diff)}
                      </div>
                      <div className="text-[11px] text-muted tabular-nums">
                        {pct > 0 ? "+" : ""}{pct.toFixed(0)} %
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

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
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border"
              />
              Visa arkiverade
            </label>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value as OwnerScope | "all")}
              className="h-8 rounded-lg border bg-bg px-2 text-xs text-fg outline-none focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
            >
              <option value="all">Alla typer</option>
              {Object.entries(ownerMeta).map(([val, meta]) => (
                <option key={val} value={val}>{meta.label}</option>
              ))}
            </select>
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
                const cycleShort = cycleShortLabel(sub.billingCycle);

                return (
                  <tr key={sub.id} className="group transition-colors hover:bg-bg/50">
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: cat.color }} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Link href={`/subscriptions/${sub.id}`} className="hover:underline">
                              {sub.name}
                            </Link>
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
                          ...(sub.status === "active" || sub.status === "trial" ? [
                            { label: "Markera som betald", icon: CheckCircle2, onClick: () => handleMarkPaid(sub) },
                          ] : []),
                          { label: "Duplicera", icon: Copy, onClick: () => handleDuplicate(sub) },
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
                          {
                            label: sub.archived ? "Återställ från arkiv" : "Arkivera",
                            icon: sub.archived ? ArchiveRestore : Archive,
                            onClick: () => handleArchiveToggle(sub),
                          },
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

      <SubscriptionDialog
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
