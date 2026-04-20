"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/toast/ToastProvider";
import { CalendarSummaryCards } from "@/modules/calendar/components/CalendarSummaryCards";
import { EventContent } from "@/modules/calendar/components/EventContent";
import { EventDetailsDialog } from "@/modules/calendar/components/EventDetailsDialog";
import { EventDialog } from "@/modules/calendar/components/EventDialog";
import { EventSourceFilter } from "@/modules/calendar/components/EventSourceFilter";
import {
  WEEKDAYS,
  addDays,
  formatDateShort,
  getEventDurationMinutes,
  getEventStartMinutes,
  getEventTone,
  startOfWeek,
  todayISO,
  toISODate,
  type CalendarEvent,
  type EventSource,
  type ResolvedCalendarEvent,
} from "@/modules/calendar/data/core";
import { useCalendarFeed } from "@/modules/calendar/lib/useCalendarFeed";
import { useCalendarViewState } from "@/modules/calendar/lib/viewState";

const SLOT_HEIGHT = 64;
const TOTAL_HEIGHT = SLOT_HEIGHT * 24;

export function WeekPage() {
  const toast = useToast();
  const { hydrated: viewHydrated, state: viewState, setWeekDate, setSources } = useCalendarViewState();
  const [anchorDate, setAnchorDate] = useState(() => startOfWeek(new Date()));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [defaultDate, setDefaultDate] = useState(todayISO());
  const [detailsEvent, setDetailsEvent] = useState<ResolvedCalendarEvent | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!viewHydrated) return;
    setAnchorDate(startOfWeek(new Date(`${viewState.weekDate}T00:00:00`)));
  }, [viewHydrated, viewState.weekDate]);

  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(anchorDate, index)), [anchorDate]);
  const start = toISODate(days[0]);
  const end = toISODate(days[6]);
  const enabledSources = (Object.entries(viewState.sources) as [EventSource, boolean][])
    .filter(([, enabled]) => enabled)
    .map(([source]) => source);

  const { events, addEvent, updateEvent, removeEvent, getManualEvent } = useCalendarFeed({ start, end }, enabledSources);
  const selectedEvent = selectedEventId ? getManualEvent(selectedEventId) ?? null : null;

  const eventsByDay = useMemo(() => {
    const grouped = new Map<string, typeof events>();
    events.forEach((event) => {
      const list = grouped.get(event.date) ?? [];
      list.push(event);
      grouped.set(event.date, list);
    });
    return grouped;
  }, [events]);

  const now = new Date();
  const today = todayISO();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  useEffect(() => {
    if (!scrollRef.current) return;
    const targetHour = Math.max(0, new Date().getHours() - 2);
    scrollRef.current.scrollTop = targetHour * SLOT_HEIGHT;
  }, [anchorDate]);

  const handleCreate = (values: Omit<CalendarEvent, "id" | "source">) => {
    addEvent({ ...values, id: `evt-${Date.now()}`, source: "manual" });
    toast.success("Händelse skapad", values.title);
  };

  const handleUpdate = (values: Omit<CalendarEvent, "id" | "source">) => {
    if (!selectedEvent) return;
    updateEvent(selectedEvent.id, values);
    toast.success("Händelse uppdaterad", selectedEvent.title);
    setSelectedEventId(null);
  };

  const handleDelete = () => {
    if (!selectedEvent) return;
    removeEvent(selectedEvent.id);
    toast.error("Händelse borttagen", selectedEvent.title);
    setSelectedEventId(null);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Kalender"
          subtitle="Veckovy med timslots för manuella tider och samlade deadlines."
        />
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/calendar"
            className="inline-flex h-9 items-center rounded-lg border bg-surface px-3 text-sm text-muted transition-colors hover:bg-bg hover:text-fg"
          >
            Månad
          </Link>
          <Link href="/calendar/week" className="inline-flex h-9 items-center rounded-lg bg-fg px-3 text-sm font-medium text-bg">
            Vecka
          </Link>
          <Link
            href="/calendar/agenda"
            className="inline-flex h-9 items-center rounded-lg border bg-surface px-3 text-sm text-muted transition-colors hover:bg-bg hover:text-fg"
          >
            Agenda
          </Link>
          <Button
            onClick={() => {
              setDefaultDate(todayISO());
              setSelectedEventId(null);
              setDialogOpen(true);
            }}
          >
            <Plus size={14} className="mr-1.5" />
            Ny händelse
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <EventSourceFilter
          value={viewState.sources}
          onToggle={(source) => setSources({ ...viewState.sources, [source]: !viewState.sources[source] })}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              const next = addDays(anchorDate, -7);
              setAnchorDate(next);
              setWeekDate(toISODate(startOfWeek(next)));
            }}
            className="gap-1.5 px-2"
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const next = startOfWeek(new Date());
              setAnchorDate(next);
              setWeekDate(toISODate(next));
            }}
            className="h-9 px-3 text-xs"
          >
            Idag
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const next = addDays(anchorDate, 7);
              setAnchorDate(next);
              setWeekDate(toISODate(startOfWeek(next)));
            }}
            className="gap-1.5 px-2"
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      <CalendarSummaryCards events={events} />

      {!events.length ? (
        <Card className="flex items-center justify-between gap-4 border-dashed bg-bg/20">
          <div>
            <div className="text-sm font-medium">Veckan är tom</div>
            <div className="mt-1 text-sm text-muted">
              Prova att ändra datumintervall eller aktivera fler källor. Du kan också lägga in en egen händelse.
            </div>
          </div>
          <Button
            onClick={() => {
              setDefaultDate(todayISO());
              setSelectedEventId(null);
              setDialogOpen(true);
            }}
          >
            <Plus size={14} className="mr-1.5" />
            Ny händelse
          </Button>
        </Card>
      ) : null}

      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-[72px_repeat(7,minmax(0,1fr))] border-b bg-bg/40">
          <div className="border-r px-3 py-3 text-xs font-medium uppercase tracking-wider text-muted">Tid</div>
          {days.map((day, index) => {
            const isoDay = toISODate(day);
            const isToday = isoDay === today;
            return (
              <div key={isoDay} className="border-r px-3 py-3 last:border-r-0">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>{WEEKDAYS[index]}</span>
                  {isToday ? (
                    <span className="inline-flex h-5 items-center rounded-full bg-fg px-2 text-[10px] font-medium text-bg">
                      Idag
                    </span>
                  ) : null}
                </div>
                <div className="mt-1 text-xs text-muted">{formatDateShort(isoDay)}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-[72px_repeat(7,minmax(0,1fr))] border-b bg-surface">
          <div className="border-r px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-muted">Heldag</div>
          {days.map((day) => {
            const isoDay = toISODate(day);
            const allDayEvents = (eventsByDay.get(isoDay) ?? []).filter((event) => !event.time);
            return (
              <div key={`${isoDay}-all-day`} className="min-h-16 border-r px-2 py-2 last:border-r-0">
                <div className="space-y-1">
                  {allDayEvents.map((event) => {
                    const tone = getEventTone(event);
                    return (
                      <button
                        key={event.instanceId}
                        type="button"
                        onClick={() => setDetailsEvent(event)}
                        className="block w-full text-left"
                      >
                        <span
                          className={clsx(
                            "flex min-w-0 items-start gap-2 rounded-md border px-2 py-1.5 text-[11px]",
                            tone.chipClass,
                            tone.borderClass,
                          )}
                        >
                          <span className={clsx("mt-1 h-2 w-2 shrink-0 rounded-full", tone.dotClass)} />
                          <EventContent event={event} compact />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
          <div className="grid grid-cols-[72px_repeat(7,minmax(0,1fr))]">
            <div className="border-r bg-bg/20">
              {Array.from({ length: 24 }, (_, hour) => (
                <div
                  key={`label-${hour}`}
                  className="relative border-b px-3 text-[11px] text-muted last:border-b-0"
                  style={{ height: SLOT_HEIGHT }}
                >
                  <span className="absolute -top-2 left-3 bg-bg/20 px-1">
                    {String(hour).padStart(2, "0")}:00
                  </span>
                </div>
              ))}
            </div>

            {days.map((day) => {
              const isoDay = toISODate(day);
              const timedEvents = (eventsByDay.get(isoDay) ?? []).filter((event) => !!event.time);
              const isCurrentDay = isoDay === today;
              return (
                <div key={`${isoDay}-column`} className="relative border-r last:border-r-0" style={{ height: TOTAL_HEIGHT }}>
                  {Array.from({ length: 24 }, (_, hour) => (
                    <button
                      key={`${isoDay}-${hour}`}
                      type="button"
                      onClick={() => {
                        setDefaultDate(isoDay);
                        setSelectedEventId(null);
                        setDialogOpen(true);
                      }}
                      className="absolute inset-x-0 border-b text-left transition-colors hover:bg-bg/25"
                      style={{ top: hour * SLOT_HEIGHT, height: SLOT_HEIGHT }}
                      aria-label={`Ny händelse ${isoDay} ${String(hour).padStart(2, "0")}:00`}
                    />
                  ))}

                  {timedEvents.map((event) => {
                    const top = (getEventStartMinutes(event) / 60) * SLOT_HEIGHT;
                    const height = (getEventDurationMinutes(event) / 60) * SLOT_HEIGHT;
                    const tone = getEventTone(event);
                    return (
                      <button
                        key={event.instanceId}
                        type="button"
                        onClick={() => setDetailsEvent(event)}
                        className="contents"
                      >
                        <span
                          className={clsx(
                            "absolute left-1 right-1 rounded-lg border p-2 text-left shadow-soft",
                            tone.chipClass,
                            tone.borderClass,
                          )}
                          style={{ top, height }}
                        >
                          <EventContent event={event} />
                        </span>
                      </button>
                    );
                  })}

                  {isCurrentDay ? (
                    <div
                      className="absolute left-0 right-0 z-10 border-t border-red-500"
                      style={{ top: (currentMinutes / 60) * SLOT_HEIGHT }}
                    >
                      <span className="absolute -left-1 -top-1.5 h-3 w-3 rounded-full bg-red-500" />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <EventDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedEventId(null);
        }}
        initial={selectedEvent}
        defaultDate={defaultDate}
        onSave={selectedEvent ? handleUpdate : handleCreate}
        onDelete={selectedEvent ? handleDelete : undefined}
      />

      <EventDetailsDialog
        open={!!detailsEvent}
        event={detailsEvent}
        onClose={() => setDetailsEvent(null)}
        onEditManual={(event) => {
          setDetailsEvent(null);
          setSelectedEventId(event.entityId);
          setDialogOpen(true);
        }}
      />
    </div>
  );
}
