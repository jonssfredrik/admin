"use client";

import clsx from "clsx";
import type { EventSource } from "@/modules/calendar/data/core";
import { sourceMeta } from "@/modules/calendar/data/core";

interface Props {
  value: Record<EventSource, boolean>;
  onToggle: (source: EventSource) => void;
}

const sources: EventSource[] = ["manual", "subscriptions", "billing", "snaptld"];

export function EventSourceFilter({ value, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((source) => {
        const meta = sourceMeta[source];
        const active = value[source];
        return (
          <button
            key={source}
            type="button"
            onClick={() => onToggle(source)}
            aria-pressed={active}
            className={clsx(
              "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors",
              active
                ? clsx(meta.chipClass, meta.borderClass)
                : "border bg-surface text-muted hover:bg-bg hover:text-fg",
            )}
          >
            <span className={clsx("h-2 w-2 rounded-full", active ? meta.dotClass : "bg-muted/50")} />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
