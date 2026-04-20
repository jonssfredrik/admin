"use client";

import { StatCard } from "@/components/ui/StatCard";
import { daysUntil, type ResolvedCalendarEvent } from "@/modules/calendar/data/core";

interface Props {
  events: ResolvedCalendarEvent[];
}

export function CalendarSummaryCards({ events }: Props) {
  const dueToday = events.filter((event) => daysUntil(event.date) === 0).length;
  const upcomingWeek = events.filter((event) => {
    const days = daysUntil(event.date);
    return days >= 0 && days <= 7;
  }).length;
  const manualCount = events.filter((event) => event.source === "manual").length;
  const needsAction = events.filter((event) => {
    const days = daysUntil(event.date);
    return event.category === "deadline" && days >= 0 && days <= 3;
  }).length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Idag" value={String(dueToday)} hint="Händelser som inträffar i dag" />
      <StatCard label="Kommande 7 dagar" value={String(upcomingWeek)} hint="Planerat inom en vecka" />
      <StatCard label="Egna händelser" value={String(manualCount)} hint="Manuellt sparade i kalendern" />
      <StatCard label="Kräver åtgärd" value={String(needsAction)} hint="Deadlines inom tre dagar" />
    </div>
  );
}
