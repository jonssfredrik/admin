"use client";

import clsx from "clsx";
import { Plus } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { EventContent } from "@/modules/calendar/components/EventContent";
import {
  formatDateLong,
  getEventTone,
  sourceMeta,
  type ResolvedCalendarEvent,
} from "@/modules/calendar/data/core";

interface Props {
  open: boolean;
  date: string | null;
  events: ResolvedCalendarEvent[];
  onClose: () => void;
  onCreate: () => void;
  onSelectEvent: (event: ResolvedCalendarEvent) => void;
}

export function DayEventsDialog({ open, date, events, onClose, onCreate, onSelectEvent }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={date ? formatDateLong(date) : "Dag"}
      description={events.length > 0 ? `${events.length} händelser` : "Inga händelser ännu."}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Stäng
          </Button>
          <Button onClick={onCreate}>
            <Plus size={14} className="mr-1.5" />
            Ny händelse
          </Button>
        </>
      }
    >
      {events.length === 0 ? (
        <div className="rounded-xl border bg-bg/30 p-4 text-sm text-muted">
          Dagen är tom. Skapa en egen händelse för att blocka tid eller lägga in en påminnelse.
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event) => {
            const tone = getEventTone(event);
            return (
              <button
                key={event.instanceId}
                type="button"
                onClick={() => onSelectEvent(event)}
                className="flex w-full items-start gap-3 rounded-xl border bg-surface p-3 text-left transition-colors hover:bg-bg"
              >
                <span className={clsx("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", tone.dotClass)} />
                <span className="min-w-0 flex-1">
                  <span className="mb-1 flex flex-wrap items-center gap-2">
                    <span className={clsx("inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-medium", tone.chipClass)}>
                      {sourceMeta[event.source].label}
                    </span>
                  </span>
                  <EventContent event={event} />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </Dialog>
  );
}
