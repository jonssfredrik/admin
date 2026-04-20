"use client";

import { useEffect, useState } from "react";
import { startOfMonth, startOfWeek, todayISO, toISODate, type EventSource } from "@/modules/calendar/data/core";

const KEY = "calendar.view-state";
const listeners = new Set<() => void>();

interface CalendarViewState {
  sources: Record<EventSource, boolean>;
  monthDate: string;
  weekDate: string;
  agendaStartDate: string;
}

function createDefaultState(): CalendarViewState {
  const now = new Date();
  return {
    sources: {
      manual: true,
      subscriptions: true,
      billing: true,
      snaptld: true,
    },
    monthDate: toISODate(startOfMonth(now)),
    weekDate: toISODate(startOfWeek(now)),
    agendaStartDate: todayISO(),
  };
}

function isValidSourceMap(value: unknown): value is Record<EventSource, boolean> {
  if (!value || typeof value !== "object") return false;
  const sources = value as Record<string, unknown>;
  return ["manual", "subscriptions", "billing", "snaptld"].every(
    (key) => typeof sources[key] === "boolean",
  );
}

function read(): CalendarViewState {
  if (typeof window === "undefined") return createDefaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw) as Partial<CalendarViewState>;
    const fallback = createDefaultState();
    return {
      sources: isValidSourceMap(parsed.sources) ? parsed.sources : fallback.sources,
      monthDate: typeof parsed.monthDate === "string" ? parsed.monthDate : fallback.monthDate,
      weekDate: typeof parsed.weekDate === "string" ? parsed.weekDate : fallback.weekDate,
      agendaStartDate:
        typeof parsed.agendaStartDate === "string" ? parsed.agendaStartDate : fallback.agendaStartDate,
    };
  } catch {
    return createDefaultState();
  }
}

function write(value: CalendarViewState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(value));
  listeners.forEach((listener) => listener());
}

export function useCalendarViewState() {
  const [state, setState] = useState<CalendarViewState>(createDefaultState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
    const update = () => setState(read());
    listeners.add(update);
    const onStorage = (event: StorageEvent) => {
      if (event.key === KEY) update();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(update);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return {
    hydrated,
    state,
    setSources(next: Record<EventSource, boolean>) {
      write({ ...read(), sources: next });
    },
    setMonthDate(next: string) {
      write({ ...read(), monthDate: next });
    },
    setWeekDate(next: string) {
      write({ ...read(), weekDate: next });
    },
    setAgendaStartDate(next: string) {
      write({ ...read(), agendaStartDate: next });
    },
    resetDates() {
      write(createDefaultState());
    },
  };
}
