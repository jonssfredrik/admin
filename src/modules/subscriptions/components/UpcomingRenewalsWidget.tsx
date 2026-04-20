"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, CalendarClock } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { useSubscriptions } from "@/modules/subscriptions/lib/useSubscriptions";
import {
  categoryMeta,
  cycleShortLabel,
  formatSEK,
  toMonthly,
} from "@/modules/subscriptions/data/core";

interface Props {
  limit?: number;
}

export function UpcomingRenewalsWidget({ limit = 3 }: Props) {
  const { hydrated, items } = useSubscriptions();

  const upcoming = useMemo(
    () =>
      items
        .filter((s) => !s.archived && (s.status === "active" || s.status === "trial"))
        .sort((a, b) => a.nextRenewal.localeCompare(b.nextRenewal))
        .slice(0, limit),
    [items, limit],
  );

  const monthlyTotal = useMemo(
    () =>
      items
        .filter((s) => !s.archived && (s.status === "active" || s.status === "trial"))
        .reduce((sum, s) => sum + toMonthly(s.amountSEK, s.billingCycle), 0),
    [items],
  );

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-2">
          <CalendarClock size={15} className="text-muted" />
          <h2 className="text-sm font-semibold tracking-tight">Abonnemang</h2>
        </div>
        <Link
          href="/subscriptions"
          className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-fg"
        >
          Öppna
          <ArrowRight size={12} />
        </Link>
      </div>

      <div className="flex items-baseline justify-between border-b px-5 py-3">
        <span className="text-xs text-muted">Löpande månadskostnad</span>
        <span className="text-sm font-semibold tabular-nums">
          {hydrated ? formatSEK(Math.round(monthlyTotal)) : "—"}
        </span>
      </div>

      <div className="px-5 py-3">
        <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
          Nästa förnyelser
        </div>
        {!hydrated ? (
          <div className="py-3 text-sm text-muted">Läser in…</div>
        ) : upcoming.length === 0 ? (
          <div className="py-3 text-sm text-muted">Inga aktiva abonnemang.</div>
        ) : (
          <div className="space-y-1.5">
            {upcoming.map((sub) => {
              const cat = categoryMeta[sub.category];
              const days = Math.floor((new Date(sub.nextRenewal).getTime() - Date.now()) / 86400000);
              const label =
                days < 0 ? "Förfallen" :
                days === 0 ? "Idag" :
                days === 1 ? "Imorgon" :
                `${days} dagar`;
              return (
                <Link
                  key={sub.id}
                  href={`/subscriptions/${sub.id}`}
                  className="flex items-center gap-2.5 rounded-md px-1 py-1.5 transition-colors hover:bg-bg"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: cat.color }} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{sub.name}</div>
                    <div className={clsx(
                      "text-[11px]",
                      days < 0 ? "text-red-600 dark:text-red-400" :
                      days < 14 ? "text-amber-600 dark:text-amber-400" : "text-muted",
                    )}>
                      {label}
                    </div>
                  </div>
                  <div className="text-right text-xs font-medium tabular-nums">
                    {formatSEK(sub.amountSEK)}
                    <span className="font-normal text-muted">{cycleShortLabel(sub.billingCycle)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
