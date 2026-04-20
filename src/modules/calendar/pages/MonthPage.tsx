"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/toast/ToastProvider";
import { CalendarSummaryCards } from "@/modules/calendar/components/CalendarSummaryCards";
import { DayEventsDialog } from "@/modules/calendar/components/DayEventsDialog";
import { EventContent } from "@/modules/calendar/components/EventContent";
import { EventDetailsDialog } from "@/modules/calendar/components/EventDetailsDialog";
import { EventDialog } from "@/modules/calendar/components/EventDialog";
import { EventSourceFilter } from "@/modules/calendar/components/EventSourceFilter";
import {
  addMonths,
  endOfMonth,
  formatMonthYear,
  getEventTone,
  startOfMonth,
  todayISO,
  toISODate,
  type CalendarEvent,
  type EventSource,
  type ResolvedCalendarEvent,
} from "@/modules/calendar/data/core";
import { useCalendarFeed } from "@/modules/calendar/lib/useCalendarFeed";
import { useCalendarViewState } from "@/modules/calendar/lib/viewState";

export function MonthPage() {
  const toast = useToast();
  const { hydrated: viewHydrated, state: viewState, setMonthDate, setSources } = useCalendarViewState();
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [defaultDate, setDefaultDate] = useState(todayISO());
  const [detailsEvent, setDetailsEvent] = useState<ResolvedCalendarEvent | null>(null);
  const [openDay, setOpenDay] = useState<string | null>(null);

  useEffect(() => {
    if (!viewHydrated) return;
    setViewDate(startOfMonth(new Date(`${viewState.monthDate}T00:00:00`)));
  }, [viewHydrated, viewState.monthDate]);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const enabledSources = (Object.entries(viewState.sources) as [EventSource, boolean][])
    .filter(([, enabled]) => enabled)
    .map(([source]) => source);

  const { events, manualEvents, addEvent, updateEvent, removeEvent, getManualEvent } = useCalendarFeed(
    { start: toISODate(monthStart), end: toISODate(monthEnd) },
    enabledSources,
  );

  const eventsByDay = useMemo(() => {
    const map = new Map<string, typeof events>();
    events.forEach((event) => {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    });
    return map;
  }, [events]);

  const selectedEvent = selectedEventId ? getManualEvent(selectedEventId) ?? null : null;
  const openDayEvents = openDay ? eventsByDay.get(openDay) ?? [] : [];

  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const daysInMonth = monthEnd.getDate();
  const cells: (Date | null)[] = [];
  for (let index = 0; index < firstWeekday; index++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
  while (cells.length % 7 !== 0) cells.push(null);

  const handleCreate = (values: Omit<CalendarEvent, "id" | "source">) => {
    addEvent({
      ...values,
      id: `evt-${Date.now()}`,
      source: "manual",
    });
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
          subtitle="Samlad månadsvy för egna händelser, abonnemang, fakturor och domändatum."
        />
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/calendar" className="inline-flex h-9 items-center rounded-lg bg-fg px-3 text-sm font-medium text-bg">
            Månad
          </Link>
          <Link
            href="/calendar/week"
            className="inline-flex h-9 items-center rounded-lg border bg-surface px-3 text-sm text-muted transition-colors hover:bg-bg hover:text-fg"
          >
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
              const next = addMonths(viewDate, -1);
              setViewDate(next);
              setMonthDate(toISODate(startOfMonth(next)));
            }}
            className="gap-1.5 px-2"
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const next = startOfMonth(new Date());
              setViewDate(next);
              setMonthDate(toISODate(next));
            }}
            className="h-9 px-3 text-xs"
          >
            Idag
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const next = addMonths(viewDate, 1);
              setViewDate(next);
              setMonthDate(toISODate(startOfMonth(next)));
            }}
            className="gap-1.5 px-2"
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold capitalize tracking-tight">{formatMonthYear(viewDate)}</h2>
        <span className="text-xs text-muted">
          {events.length} visade händelser · {manualEvents.length} egna sparade
        </span>
      </div>

      <CalendarSummaryCards events={events} />

      {!manualEvents.length ? (
        <Card className="flex items-center justify-between gap-4 border-dashed bg-bg/20">
          <div>
            <div className="text-sm font-medium">Inga egna händelser ännu</div>
            <div className="mt-1 text-sm text-muted">
              Lägg in möten, personliga påminnelser eller återkommande blockeringar direkt i kalendern.
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
            Skapa första
          </Button>
        </Card>
      ) : null}

      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-7 border-b bg-bg/50">
          {["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"].map((day) => (
            <div key={day} className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-muted">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((cell, index) => {
            if (!cell) return <div key={`empty-${index}`} className="min-h-[132px] border-b border-r bg-bg/20" />;

            const dayKey = toISODate(cell);
            const dayEvents = eventsByDay.get(dayKey) ?? [];
            const isToday = dayKey === todayISO();
            const isWeekend = index % 7 >= 5;

            return (
              <div
                key={dayKey}
                className={clsx("min-h-[132px] border-b border-r p-2 transition-colors hover:bg-bg/20", isWeekend && "bg-bg/25")}
                onClick={() => {
                  if (dayEvents.length > 0) {
                    setOpenDay(dayKey);
                    return;
                  }
                  setDefaultDate(dayKey);
                  setSelectedEventId(null);
                  setDialogOpen(true);
                }}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium tabular-nums">{cell.getDate()}</span>
                    {isToday ? (
                      <span className="inline-flex h-6 items-center rounded-full bg-fg px-2.5 text-[11px] font-medium text-bg">
                        Idag
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpenDay(null);
                      setDefaultDate(dayKey);
                      setSelectedEventId(null);
                      setDialogOpen(true);
                    }}
                    className="rounded-md p-1 text-muted transition-colors hover:bg-bg hover:text-fg"
                    aria-label={`Ny händelse ${dayKey}`}
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => {
                    const tone = getEventTone(event);
                    return (
                      <button
                        key={event.instanceId}
                        type="button"
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation();
                          setDetailsEvent(event);
                        }}
                        className="block w-full text-left"
                      >
                        <span
                          className={clsx(
                            "flex min-w-0 items-start gap-2 rounded-md border px-2 py-1.5 text-[11px] transition-colors",
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
                  {dayEvents.length > 3 ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenDay(dayKey);
                      }}
                      className="px-1 text-[11px] text-muted transition-colors hover:text-fg"
                    >
                      +{dayEvents.length - 3} till
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
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

      <DayEventsDialog
        open={!!openDay}
        date={openDay}
        events={openDayEvents}
        onClose={() => setOpenDay(null)}
        onCreate={() => {
          if (!openDay) return;
          setDetailsEvent(null);
          setOpenDay(null);
          setDefaultDate(openDay);
          setSelectedEventId(null);
          setDialogOpen(true);
        }}
        onSelectEvent={(event) => {
          setOpenDay(null);
          setDetailsEvent(event);
        }}
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
