"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, CheckCircle, CheckCircle2, Pencil } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Table";
import { RowMenu } from "@/components/ui/RowMenu";
import { useSubscriptions } from "@/modules/subscriptions/lib/useSubscriptions";
import { SubscriptionDialog } from "@/modules/subscriptions/components/SubscriptionDialog";
import { categoryMeta, statusMeta, toMonthly, type Subscription } from "@/modules/subscriptions/data/core";
import { useToast } from "@/components/toast/ToastProvider";

function formatSEK(n: number) {
  return n.toLocaleString("sv-SE", { maximumFractionDigits: 0 }) + " kr";
}

function monthLabel(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sv-SE", { month: "long", year: "numeric" });
}

function dayLabel(dateStr: string) {
  const d = new Date(dateStr);
  const diffDays = Math.floor((d.getTime() - Date.now()) / 86400000);
  const day = d.toLocaleDateString("sv-SE", { weekday: "short", day: "numeric", month: "short" });
  if (diffDays < 0)  return { day, badge: "Förfallen",        tone: "danger"  as const };
  if (diffDays === 0) return { day, badge: "Idag",            tone: "danger"  as const };
  if (diffDays === 1) return { day, badge: "Imorgon",         tone: "warning" as const };
  if (diffDays < 8)  return { day, badge: `${diffDays} dagar`, tone: "warning" as const };
  return { day, badge: `${diffDays} dagar`, tone: "neutral" as const };
}

export function RenewalsPage() {
  const { items: rawItems, update, markPaid } = useSubscriptions();
  const items = useMemo(() => rawItems.filter((s) => !s.archived), [rawItems]);
  const { success } = useToast();
  const [editTarget, setEditTarget] = useState<Subscription | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const sorted = useMemo(
    () =>
      items
        .filter((s) => s.status === "active" || s.status === "trial")
        .sort((a, b) => a.nextRenewal.localeCompare(b.nextRenewal)),
    [items],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, typeof sorted>();
    sorted.forEach((s) => {
      const key = s.nextRenewal.slice(0, 7);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    return Array.from(map.entries());
  }, [sorted]);

  const overdueCount = sorted.filter(
    (s) => new Date(s.nextRenewal).getTime() < Date.now(),
  ).length;

  const thisMonth = new Date().toISOString().slice(0, 7);
  const thisMonthSubs = grouped.find(([k]) => k === thisMonth)?.[1] ?? [];
  const thisMonthTotal = thisMonthSubs.reduce((sum, s) => sum + s.amountSEK, 0);

  const allActiveMonthly = items
    .filter((s) => s.status === "active" || s.status === "trial")
    .reduce((sum, s) => sum + toMonthly(s.amountSEK, s.billingCycle), 0);

  const openEdit = (sub: Subscription) => { setEditTarget(sub); setDialogOpen(true); };

  const handleSave = (data: Omit<Subscription, "id">) => {
    if (!editTarget) return;
    update(editTarget.id, data);
    success("Abonnemang uppdaterat", editTarget.name);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Förnyelser"
        subtitle="Kommande förnyelsedatum för alla aktiva prenumerationer."
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4 p-4">
          <div className={clsx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            overdueCount > 0 ? "bg-red-500/10" : "bg-emerald-500/10",
          )}>
            {overdueCount > 0
              ? <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />
              : <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
            }
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted">Förfallna</div>
            <div className="mt-0.5 text-2xl font-semibold tabular-nums">{overdueCount}</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <CalendarDays size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted">Denna månad</div>
            <div className="mt-0.5 text-2xl font-semibold tabular-nums">{thisMonthSubs.length}</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fg/8">
            <CalendarDays size={18} className="text-muted" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted">
              Löpande månadskostnad
            </div>
            <div className="mt-0.5 text-2xl font-semibold tabular-nums">
              {formatSEK(Math.round(allActiveMonthly))}
            </div>
          </div>
        </Card>
      </div>

      {/* Timeline */}
      {grouped.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <CheckCircle2 size={28} className="text-muted" />
            <p className="text-sm text-muted">Inga aktiva abonnemang att visa.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map(([monthKey, subs]) => {
            const isThisMonth = monthKey === thisMonth;
            const isPast = monthKey < thisMonth;
            const monthTotal = isThisMonth
              ? thisMonthTotal
              : subs.reduce((sum, s) => sum + s.amountSEK, 0);

            return (
              <div key={monthKey}>
                <div className="mb-3 flex items-center gap-3">
                  <h2 className={clsx(
                    "text-sm font-semibold capitalize",
                    isThisMonth ? "text-fg" : isPast ? "text-red-600 dark:text-red-400" : "text-muted",
                  )}>
                    {monthLabel(monthKey + "-01")}
                  </h2>
                  {isThisMonth && (
                    <span className="rounded-full bg-fg px-2 py-0.5 text-[10px] font-medium text-bg">
                      Aktuell
                    </span>
                  )}
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted tabular-nums">
                    {formatSEK(monthTotal)} att betala
                  </span>
                </div>

                <Card className="divide-y p-0 overflow-hidden">
                  {subs.map((sub) => {
                    const cat = categoryMeta[sub.category];
                    const st  = statusMeta[sub.status];
                    const { day, badge, tone } = dayLabel(sub.nextRenewal);
                    const cycleShort =
                      sub.billingCycle === "monthly"   ? "/mån" :
                      sub.billingCycle === "quarterly"  ? "/kvartal" :
                      sub.billingCycle === "annual"     ? "/år" : "/2 år";

                    return (
                      <div
                        key={sub.id}
                        className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-bg/50"
                      >
                        {/* Color dot */}
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ background: cat.color }}
                        />

                        {/* Name + category + notes */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{sub.name}</span>
                            <span className="text-[11px] text-muted">{cat.label}</span>
                          </div>
                          {sub.notes && (
                            <div className="text-xs text-muted">{sub.notes}</div>
                          )}
                        </div>

                        {/* Status */}
                        {sub.status === "trial" && (
                          <Badge tone={st.tone}>{st.label}</Badge>
                        )}

                        {/* Amount */}
                        <div className="text-right">
                          <div className="font-medium tabular-nums">
                            {formatSEK(sub.amountSEK)}{cycleShort}
                          </div>
                        </div>

                        {/* Renewal date */}
                        <div className="w-28 text-right">
                          <div className="text-xs font-medium text-muted">{day}</div>
                          <Badge tone={tone}>{badge}</Badge>
                        </div>

                        {/* Row menu */}
                        <div className="opacity-0 transition-opacity group-hover:opacity-100">
                          <RowMenu
                            items={[
                              {
                                label: "Markera som betald",
                                icon: CheckCircle,
                                onClick: () => {
                                  markPaid(sub.id);
                                  success("Markerad som betald", `${sub.name} — nästa förnyelse framflyttad`);
                                },
                              },
                              { label: "Redigera", icon: Pencil, onClick: () => openEdit(sub) },
                            ]}
                          />
                        </div>
                      </div>
                    );
                  })}
                </Card>
              </div>
            );
          })}
        </div>
      )}

      <SubscriptionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initial={editTarget}
      />
    </div>
  );
}
