"use client";

import { formatTimeLabel, type ResolvedCalendarEvent } from "@/modules/calendar/data/core";
import { useCalendarSettings } from "@/modules/calendar/lib/useCalendarSettings";

interface Props {
  event: ResolvedCalendarEvent;
  compact?: boolean;
}

function buildMeta(event: ResolvedCalendarEvent, showDescriptions: boolean) {
  return [
    event.time ? formatTimeLabel(event.time, event.endTime) : null,
    showDescriptions ? event.description ?? null : null,
    event.sourceDetail ?? null,
    event.statusLabel ?? null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function EventContent({ event, compact = false }: Props) {
  const { hydrated, settings } = useCalendarSettings();
  const meta = buildMeta(event, hydrated ? settings.showEventDescriptions : true);

  return (
    <span className="min-w-0">
      <span className={compact ? "block truncate font-medium" : "block truncate text-[11px] font-medium"}>
        {event.title}
      </span>
      {meta ? (
        <span className={compact ? "block truncate text-[10px] opacity-75" : "mt-0.5 block truncate text-[10px] opacity-80"}>
          {meta}
        </span>
      ) : null}
    </span>
  );
}
