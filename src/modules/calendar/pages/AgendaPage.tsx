"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/components/toast/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { CalendarSummaryCards } from "@/modules/calendar/components/CalendarSummaryCards";
import { CalendarViewNav } from "@/modules/calendar/components/CalendarViewNav";
import { EventDetailsDialog } from "@/modules/calendar/components/EventDetailsDialog";
import { EventDialog } from "@/modules/calendar/components/EventDialog";
import { EventSourceFilter } from "@/modules/calendar/components/EventSourceFilter";
import {
  addDays,
  categoryMeta,
  formatDateLong,
  formatTimeLabel,
  getEventTone,
  sourceMeta,
  todayISO,
  toISODate,
  type CalendarEvent,
  type EventSource,
  type ResolvedCalendarEvent,
} from "@/modules/calendar/data/core";
import { useCalendarFeed } from "@/modules/calendar/lib/useCalendarFeed";
import { useCalendarSettings } from "@/modules/calendar/lib/useCalendarSettings";
import { useCalendarViewState } from "@/modules/calendar/lib/viewState";

export function AgendaPage() {
  const toast = useToast();
  const { hydrated: viewHydrated, state: viewState, setAgendaStartDate, setSources } = useCalendarViewState();
  const { settings } = useCalendarSettings();
  const [startDate, setStartDate] = useState(todayISO());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [defaultDate, setDefaultDate] = useState(todayISO());
  const [detailsEvent, setDetailsEvent] = useState<ResolvedCalendarEvent | null>(null);

  useEffect(() => {
    if (!viewHydrated) return;
    setStartDate(viewState.agendaStartDate);
  }, [viewHydrated, viewState.agendaStartDate]);

  const agendaWindowDays = settings.agendaDefaultDays;
  const endDate = toISODate(addDays(new Date(`${startDate}T00:00:00`), agendaWindowDays - 1));
  const enabledSources = (Object.entries(viewState.sources) as [EventSource, boolean][])
    .filter(([, enabled]) => enabled)
    .map(([source]) => source);

  const { events, addEvent, updateEvent, removeEvent, getManualEvent } = useCalendarFeed(
    { start: startDate, end: endDate },
    enabledSources,
  );

  const selectedEvent = selectedEventId ? getManualEvent(selectedEventId) ?? null : null;

  const groupedEvents = useMemo(() => {
    const groups = new Map<string, typeof events>();
    events.forEach((event) => {
      const list = groups.get(event.date) ?? [];
      list.push(event);
      groups.set(event.date, list);
    });
    return Array.from(groups.entries());
  }, [events]);

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
          subtitle={`Agenda för de kommande ${agendaWindowDays} dagarna, grupperad per dag.`}
        />
        <div className="flex flex-wrap items-center gap-2">
          <CalendarViewNav current="agenda" />
          <Button
            onClick={() => {
              setDefaultDate(startDate);
              setSelectedEventId(null);
              setDialogOpen(true);
            }}
          >
            <Plus size={14} className="mr-1.5" />
            Ny händelse
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
        <Card className="space-y-4">
          <EventSourceFilter
            value={viewState.sources}
            onToggle={(source) => setSources({ ...viewState.sources, [source]: !viewState.sources[source] })}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              className="h-8 px-3 text-xs"
              onClick={() => {
                const next = todayISO();
                setStartDate(next);
                setAgendaStartDate(next);
              }}
            >
              Idag
            </Button>
            <Button
              variant="secondary"
              className="h-8 px-3 text-xs"
              onClick={() => {
                const next = toISODate(addDays(new Date(), 6));
                setStartDate(next);
                setAgendaStartDate(next);
              }}
            >
              Nästa 7 dagar
            </Button>
            <Button
              variant="secondary"
              className="h-8 px-3 text-xs"
              onClick={() => {
                const next = toISODate(addDays(new Date(), agendaWindowDays - 1));
                setStartDate(next);
                setAgendaStartDate(next);
              }}
            >
              Nästa {agendaWindowDays} dagar
            </Button>
          </div>
          <div className="text-sm text-muted">
            Visar {events.length} händelser mellan {startDate} och {endDate}.
          </div>
        </Card>

        <Card>
          <Label htmlFor="agenda-start">Startdatum</Label>
          <Input
            id="agenda-start"
            type="date"
            value={startDate}
            onChange={(event) => {
              setStartDate(event.target.value);
              setAgendaStartDate(event.target.value);
            }}
          />
          <p className="mt-2 text-xs text-muted">
            Listan omfattar alltid {agendaWindowDays} dagar framåt från valt startdatum.
          </p>
        </Card>
      </div>

      <div className="space-y-4">
        <CalendarSummaryCards events={events} />

        {groupedEvents.length === 0 ? (
          <Card className="flex items-center justify-between gap-4 border-dashed bg-bg/20">
            <div>
              <div className="text-sm font-medium">Inga händelser i intervallet</div>
              <div className="mt-1 text-sm text-muted">
                Testa ett annat startdatum, slå på fler källor eller skapa en egen händelse för perioden.
              </div>
            </div>
            <Button
              onClick={() => {
                setDefaultDate(startDate);
                setSelectedEventId(null);
                setDialogOpen(true);
              }}
            >
              <Plus size={14} className="mr-1.5" />
              Ny händelse
            </Button>
          </Card>
        ) : (
          groupedEvents.map(([date, dayEvents]) => (
            <Card key={date} className="p-0">
              <div className="border-b px-5 py-4">
                <div className="text-sm font-semibold capitalize tracking-tight">{formatDateLong(date)}</div>
                <div className="mt-1 text-xs text-muted">{dayEvents.length} händelser</div>
              </div>
              <div className="divide-y">
                {dayEvents.map((event) => {
                  const tone = getEventTone(event);
                  const category = categoryMeta[event.category];
                  const row = (
                    <span className="flex items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-bg/40">
                      <span className="min-w-20 text-sm font-medium tabular-nums text-muted">
                        {formatTimeLabel(event.time, event.endTime)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">{event.title}</span>
                          <span className={clsx("inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-medium", tone.chipClass)}>
                            {sourceMeta[event.source].label}
                          </span>
                          <span className={clsx("inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-medium", category.badgeClass)}>
                            {category.label}
                          </span>
                        </span>
                        {event.description ? <span className="mt-1 block text-sm text-muted">{event.description}</span> : null}
                        {event.statusLabel || event.sourceDetail || (event.recurrence && event.recurrence !== "none") ? (
                          <span className="mt-1 block text-xs text-muted">
                            {event.statusLabel ?? ""}
                            {event.statusLabel && event.sourceDetail ? " · " : ""}
                            {event.sourceDetail ?? ""}
                            {(event.statusLabel || event.sourceDetail) && event.recurrence && event.recurrence !== "none"
                              ? " · "
                              : ""}
                            {event.recurrence && event.recurrence !== "none" ? "Återkommande" : ""}
                          </span>
                        ) : null}
                        <span className="mt-1 block text-xs text-muted">
                          {event.source === "manual" ? "Klicka för att redigera händelsen" : "Klicka för att öppna källan"}
                        </span>
                      </span>
                    </span>
                  );

                  return (
                    <button key={event.instanceId} type="button" onClick={() => setDetailsEvent(event)} className="block w-full">
                      {row}
                    </button>
                  );
                })}
              </div>
            </Card>
          ))
        )}
      </div>

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
