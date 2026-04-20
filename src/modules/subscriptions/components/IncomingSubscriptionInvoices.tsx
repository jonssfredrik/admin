"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Inbox } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { useSubscriptions } from "@/modules/subscriptions/lib/useSubscriptions";
import {
  categoryMeta,
  cycleShortLabel,
  formatSEK,
  ownerMeta,
} from "@/modules/subscriptions/data/core";

interface Props {
  windowDays?: number;
}

export function IncomingSubscriptionInvoices({ windowDays = 30 }: Props) {
  const { hydrated, items } = useSubscriptions();

  const upcoming = useMemo(() => {
    const now = Date.now();
    const cutoff = now + windowDays * 86400000;
    return items
      .filter((s) => !s.archived && (s.status === "active" || s.status === "trial"))
      .filter((s) => {
        const t = new Date(s.nextRenewal).getTime();
        return t <= cutoff;
      })
      .sort((a, b) => a.nextRenewal.localeCompare(b.nextRenewal));
  }, [items, windowDays]);

  const total = upcoming.reduce((sum, s) => sum + s.amountSEK, 0);
  const businessTotal = upcoming
    .filter((s) => s.businessExpense)
    .reduce((sum, s) => sum + s.amountSEK, 0);

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <Inbox size={14} className="text-muted" />
            Inkommande från abonnemang
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Kommande {windowDays} dagar · {hydrated ? `${upcoming.length} förnyelser, ${formatSEK(total)}` : "läser in…"}
            {businessTotal > 0 && ` · varav ${formatSEK(businessTotal)} avdragsgill`}
          </p>
        </div>
        <Link
          href="/subscriptions/renewals"
          className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-fg"
        >
          Alla förnyelser
          <ArrowRight size={12} />
        </Link>
      </div>

      {!hydrated ? (
        <Card className="py-6 text-center text-sm text-muted">Läser in…</Card>
      ) : upcoming.length === 0 ? (
        <Card className="py-6 text-center text-sm text-muted">
          Inga abonnemangsförnyelser inom {windowDays} dagar.
        </Card>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Tjänst</Th>
              <Th>Kategori</Th>
              <Th>Typ</Th>
              <Th>Förnyelse</Th>
              <Th className="text-right">Belopp</Th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map((sub) => {
              const cat = categoryMeta[sub.category];
              const own = ownerMeta[sub.owner ?? "private"];
              const days = Math.floor((new Date(sub.nextRenewal).getTime() - Date.now()) / 86400000);
              const dueLabel =
                days < 0 ? "Förfallen" :
                days === 0 ? "Idag" :
                days === 1 ? "Imorgon" :
                `Om ${days} dagar`;
              return (
                <tr key={sub.id} className="transition-colors hover:bg-bg/50">
                  <Td>
                    <Link href={`/subscriptions/${sub.id}`} className="flex items-center gap-2 font-medium hover:underline">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: cat.color }} />
                      {sub.name}
                    </Link>
                  </Td>
                  <Td className="text-xs text-muted">{cat.label}</Td>
                  <Td>
                    <Badge tone={own.tone}>{own.label}</Badge>
                    {sub.businessExpense && <span className="ml-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">avdragsgill</span>}
                  </Td>
                  <Td>
                    <div className="text-xs font-medium">
                      {new Date(sub.nextRenewal).toLocaleDateString("sv-SE", { day: "numeric", month: "short" })}
                    </div>
                    <div className={clsx(
                      "text-[11px]",
                      days < 0 ? "text-red-600 dark:text-red-400" :
                      days < 7 ? "text-amber-600 dark:text-amber-400" : "text-muted",
                    )}>
                      {dueLabel}
                    </div>
                  </Td>
                  <Td className="text-right font-medium tabular-nums">
                    {formatSEK(sub.amountSEK)}
                    <span className="font-normal text-muted">{cycleShortLabel(sub.billingCycle)}</span>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </section>
  );
}
