"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { AlertCircle, Clock3, Repeat2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Label } from "@/components/ui/Input";
import {
  categoryMeta,
  manualColorMeta,
  recurrenceLabel,
  todayISO,
  type CalendarEvent,
  type CalendarCategory,
  type EventRecurrence,
} from "@/modules/calendar/data/core";

interface EventFormValues {
  title: string;
  description: string;
  date: string;
  time: string;
  endTime: string;
  category: CalendarCategory;
  recurrence: EventRecurrence;
  color: string;
  allDay: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (values: Omit<CalendarEvent, "id" | "source">) => void;
  onDelete?: () => void;
  initial?: CalendarEvent | null;
  defaultDate?: string;
}

const emptyState = (date?: string): EventFormValues => ({
  title: "",
  description: "",
  date: date ?? todayISO(),
  time: "",
  endTime: "",
  category: "work",
  recurrence: "none",
  color: "",
  allDay: true,
});

const fieldClass =
  "h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5";

export function EventDialog({ open, onClose, onSave, onDelete, initial, defaultDate }: Props) {
  const [form, setForm] = useState<EventFormValues>(emptyState(defaultDate));

  useEffect(() => {
    if (!open) return;
    setForm(
      initial
        ? {
            title: initial.title,
            description: initial.description ?? "",
            date: initial.date,
            time: initial.time ?? "",
            endTime: initial.endTime ?? "",
            category: initial.category,
            recurrence: initial.recurrence ?? "none",
            color: initial.color ?? "",
            allDay: !initial.time,
          }
        : emptyState(defaultDate),
    );
  }, [defaultDate, initial, open]);

  const timeError = useMemo(() => {
    if (form.allDay || !form.time || !form.endTime) return null;
    if (form.endTime <= form.time) return "Sluttiden måste vara senare än starttiden.";
    return null;
  }, [form.allDay, form.endTime, form.time]);

  const recurrenceHint = useMemo(() => {
    if (form.recurrence === "none") return "Händelsen skapas bara på valt datum.";
    return `${recurrenceLabel(form.recurrence)} från ${form.date || "valt datum"}.`;
  }, [form.date, form.recurrence]);

  const handleSubmit = () => {
    if (!form.title.trim() || !form.date || timeError) return;
    onSave({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      date: form.date,
      time: form.allDay ? undefined : form.time || undefined,
      endTime: form.allDay ? undefined : form.endTime || undefined,
      category: form.category,
      sourceRef: initial?.sourceRef,
      recurrence: form.recurrence,
      color: form.color || undefined,
    });
    onClose();
  };

  const footer = (
    <>
      {initial && onDelete ? (
        <Button
          variant="secondary"
          onClick={onDelete}
          className="mr-auto border-red-500/30 text-red-600 hover:bg-red-500/5 dark:text-red-400"
        >
          Ta bort
        </Button>
      ) : null}
      <Button variant="secondary" onClick={onClose}>
        Avbryt
      </Button>
      <Button onClick={handleSubmit} disabled={!form.title.trim() || !form.date || !!timeError}>
        {initial ? "Spara ändringar" : "Skapa händelse"}
      </Button>
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initial ? "Redigera händelse" : "Ny händelse"}
      description="Egna händelser sparas lokalt i webbläsaren."
      footer={footer}
      size="md"
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="calendar-title">Titel</Label>
            <Input
              id="calendar-title"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Exempel: Kundmöte"
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="calendar-description">Beskrivning</Label>
            <textarea
              id="calendar-description"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={3}
              className="w-full rounded-lg border bg-surface px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
              placeholder="Valfritt sammanhang eller anteckning"
            />
          </div>

          <div>
            <Label htmlFor="calendar-date">Datum</Label>
            <Input
              id="calendar-date"
              type="date"
              value={form.date}
              onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="calendar-category">Kategori</Label>
            <select
              id="calendar-category"
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value as CalendarCategory }))
              }
              className={fieldClass}
            >
              {Object.entries(categoryMeta).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-xl border bg-bg/30 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, allDay: true, time: "", endTime: "" }))}
              className={clsx(
                "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors",
                form.allDay ? "border-fg/15 bg-fg/10 text-fg" : "border bg-surface text-muted hover:bg-bg hover:text-fg",
              )}
            >
              Heldag
            </button>
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, allDay: false }))}
              className={clsx(
                "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors",
                !form.allDay ? "border-fg/15 bg-fg/10 text-fg" : "border bg-surface text-muted hover:bg-bg hover:text-fg",
              )}
            >
              <Clock3 size={14} />
              Tidssatt
            </button>
          </div>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="calendar-time">Starttid</Label>
              <Input
                id="calendar-time"
                type="time"
                value={form.time}
                onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))}
                disabled={form.allDay}
              />
            </div>

            <div>
              <Label htmlFor="calendar-end-time">Sluttid</Label>
              <Input
                id="calendar-end-time"
                type="time"
                value={form.endTime}
                onChange={(event) => setForm((current) => ({ ...current, endTime: event.target.value }))}
                disabled={form.allDay || !form.time}
              />
            </div>
          </div>

          {timeError ? (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
              <AlertCircle size={14} />
              {timeError}
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted">
              {form.allDay ? "Händelsen visas som heldag i vecka och agenda." : "Tidssatta händelser placeras i veckans timgrid."}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="calendar-recurrence">Återkommer</Label>
            <select
              id="calendar-recurrence"
              value={form.recurrence}
              onChange={(event) =>
                setForm((current) => ({ ...current, recurrence: event.target.value as EventRecurrence }))
              }
              className={fieldClass}
            >
              <option value="none">Ingen</option>
              <option value="daily">Dagligen</option>
              <option value="weekly">Varje vecka</option>
              <option value="monthly">Varje månad</option>
              <option value="yearly">Varje år</option>
            </select>
            <div className="mt-2 inline-flex items-center gap-2 text-xs text-muted">
              <Repeat2 size={13} />
              {recurrenceHint}
            </div>
          </div>

          <div>
            <Label htmlFor="calendar-color">Färg</Label>
            <select
              id="calendar-color"
              value={form.color}
              onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
              className={fieldClass}
            >
              <option value="">Automatisk</option>
              {Object.entries(manualColorMeta).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
