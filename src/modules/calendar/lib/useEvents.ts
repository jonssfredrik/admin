"use client";

import { useEffect, useState } from "react";
import type { CalendarEvent } from "@/modules/calendar/data/core";

const KEY = "calendar.events";
const listeners = new Set<() => void>();

function isCalendarEvent(value: unknown): value is CalendarEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Record<string, unknown>;
  return (
    typeof event.id === "string" &&
    typeof event.title === "string" &&
    typeof event.date === "string" &&
    typeof event.category === "string" &&
    typeof event.source === "string"
  );
}

function read(): CalendarEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCalendarEvent) : [];
  } catch {
    return [];
  }
}

function write(values: CalendarEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(values));
  listeners.forEach((listener) => listener());
}

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEvents(read());
    setHydrated(true);
    const update = () => setEvents(read());
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
    events,
    count: events.length,
    getById: (id: string) => events.find((event) => event.id === id),
    add: (event: CalendarEvent) => {
      write([event, ...read()]);
    },
    update: (id: string, updates: Partial<Omit<CalendarEvent, "id" | "source">>) => {
      write(read().map((event) => (event.id === id ? { ...event, ...updates } : event)));
    },
    remove: (id: string) => {
      write(read().filter((event) => event.id !== id));
    },
    clear: () => {
      write([]);
    },
  };
}
