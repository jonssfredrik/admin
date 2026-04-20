"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useSubscriptions } from "@/modules/subscriptions/lib/useSubscriptions";
import {
  advanceRenewal,
  categoryMeta,
  cycleShortLabel,
  formatSEK,
  type Subscription,
} from "@/modules/subscriptions/data/core";

const WEEKDAYS = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
const MONTHS = [
  "januari", "februari", "mars", "april", "maj", "juni",
  "juli", "augusti", "september", "oktober", "november", "december",
];

function startOfMonth(y: number, m: number) {
  return new Date(y, m, 1);
}
function endOfMonth(y: number, m: number) {
  return new Date(y, m + 1, 0);
}
function iso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function stepBack(dateStr: string, cycle: Subscription["billingCycle"]): string {
  const d = new Date(dateStr);
  switch (cycle) {
    case "monthly":   d.setMonth(d.getMonth() - 1); break;
    case "quarterly": d.setMonth(d.getMonth() - 3); break;
    case "annual":    d.setFullYear(d.getFullYear() - 1); break;
    case "biannual":  d.setFullYear(d.getFullYear() - 2); break;
  }
  return iso(d);
}

interface Entry {
  sub: Subscription;
  dateISO: string;
}

export function CalendarPage() {
  const { items } = useSubscriptions();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const prevMonth = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  };
  const today = () => { setYear(now.getFullYear()); setMonth(now.getMonth()); };

  const active = useMemo(
    () => items.filter((s) => !s.archived && (s.status === "active" || s.status === "trial")),
    [items],
  );

  const monthStart = startOfMonth(year, month);
  const monthEnd = endOfMonth(year, month);

  const entriesByDay = useMemo(() => {
    const map = new Map<string, Entry[]>();
    const startISO = iso(monthStart);
    const endISO = iso(monthEnd);
    for (const sub of active) {
      let cursor = sub.nextRenewal;
      let safety = 0;
      while (cursor > endISO && safety < 60) {
        cursor = stepBack(cursor, sub.billingCycle);
        safety++;
      }
      safety = 0;
      while (cursor >= startISO && cursor <= endISO && safety < 60) {
        const list = map.get(cursor) ?? [];
        list.push({ sub, dateISO: cursor });
        map.set(cursor, list);
        cursor = advanceRenewal(cursor, sub.billingCycle);
        safety++;
      }
    }
    return map;
  }, [active, monthStart, monthEnd]);

  const monthTotal = useMemo(() => {
    let total = 0;
    entriesByDay.forEach((list) => list.forEach((e) => (total += e.sub.amountSEK)));
    return total;
  }, [entriesByDay]);

  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const daysInMonth = monthEnd.getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const todayISO = iso(now);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Kalender"
          subtitle="Förnyelser visualiserade per månad."
        />
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={prevMonth} className="gap-1.5 px-2">
            <ChevronLeft size={14} />
          </Button>
          <Button variant="secondary" onClick={today} className="h-9 px-3 text-xs">
            Idag
          </Button>
          <Button variant="secondary" onClick={nextMonth} className="gap-1.5 px-2">
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold capitalize tracking-tight">
          {MONTHS[month]} {year}
        </h2>
        <span className="text-xs text-muted tabular-nums">
          {formatSEK(Math.round(monthTotal))} att betala den här månaden
        </span>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-7 border-b bg-bg/50">
          {WEEKDAYS.map((d) => (
            <div key={d} className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-muted">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((cell, i) => {
            if (!cell) {
              return <div key={i} className="min-h-[96px] border-b border-r bg-bg/20" />;
            }
            const cellISO = iso(cell);
            const entries = entriesByDay.get(cellISO) ?? [];
            const isToday = cellISO === todayISO;
            const isWeekend = i % 7 >= 5;
            return (
              <div
                key={i}
                className={clsx(
                  "min-h-[96px] border-b border-r p-1.5",
                  isWeekend && "bg-bg/30",
                )}
              >
                <div className="flex items-center justify-between px-1">
                  <span
                    className={clsx(
                      "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] tabular-nums",
                      isToday ? "bg-fg text-bg font-semibold" : "text-muted",
                    )}
                  >
                    {cell.getDate()}
                  </span>
                  {entries.length > 0 && (
                    <span className="text-[10px] tabular-nums text-muted">
                      {formatSEK(entries.reduce((s, e) => s + e.sub.amountSEK, 0))}
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-0.5">
                  {entries.slice(0, 3).map((e, idx) => {
                    const cat = categoryMeta[e.sub.category];
                    return (
                      <Link
                        key={idx}
                        href={`/subscriptions/${e.sub.id}`}
                        className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] transition-colors hover:bg-bg"
                        style={{ borderLeft: `3px solid ${cat.color}` }}
                        title={`${e.sub.name} — ${formatSEK(e.sub.amountSEK)}${cycleShortLabel(e.sub.billingCycle)}`}
                      >
                        <span className="truncate font-medium">{e.sub.name}</span>
                      </Link>
                    );
                  })}
                  {entries.length > 3 && (
                    <div className="px-1.5 text-[10px] text-muted">
                      +{entries.length - 3} till
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
