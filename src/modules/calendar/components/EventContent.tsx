"use client";

import { formatTimeLabel, type ResolvedCalendarEvent } from "@/modules/calendar/data/core";

interface Props {
  event: ResolvedCalendarEvent;
  compact?: boolean;
}

function buildMeta(event: ResolvedCalendarEvent) {
  return [
    event.time ? formatTimeLabel(event.time, event.endTime) : null,
    event.description ?? null,
    event.sourceDetail ?? null,
    event.statusLabel ?? null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function EventContent({ event, compact = false }: Props) {
  const meta = buildMeta(event);

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
