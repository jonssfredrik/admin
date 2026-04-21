"use client";

import { useEffect, useState } from "react";

const KEY = "calendar.settings";
const listeners = new Set<() => void>();

export interface CalendarSettings {
  panelNotifications: boolean;
  browserNotifications: boolean;
  dailyAgendaDigest: boolean;
  reminderLeadMinutes: number;
  agendaDefaultDays: number;
  autoScrollWeekToNow: boolean;
  showEventDescriptions: boolean;
}

export function createDefaultCalendarSettings(): CalendarSettings {
  return {
    panelNotifications: true,
    browserNotifications: false,
    dailyAgendaDigest: true,
    reminderLeadMinutes: 30,
    agendaDefaultDays: 30,
    autoScrollWeekToNow: true,
    showEventDescriptions: true,
  };
}

function read(): CalendarSettings {
  if (typeof window === "undefined") return createDefaultCalendarSettings();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return createDefaultCalendarSettings();
    const parsed = JSON.parse(raw) as Partial<CalendarSettings>;
    const fallback = createDefaultCalendarSettings();
    return {
      panelNotifications:
        typeof parsed.panelNotifications === "boolean" ? parsed.panelNotifications : fallback.panelNotifications,
      browserNotifications:
        typeof parsed.browserNotifications === "boolean"
          ? parsed.browserNotifications
          : fallback.browserNotifications,
      dailyAgendaDigest:
        typeof parsed.dailyAgendaDigest === "boolean" ? parsed.dailyAgendaDigest : fallback.dailyAgendaDigest,
      reminderLeadMinutes:
        typeof parsed.reminderLeadMinutes === "number" ? parsed.reminderLeadMinutes : fallback.reminderLeadMinutes,
      agendaDefaultDays:
        typeof parsed.agendaDefaultDays === "number" ? parsed.agendaDefaultDays : fallback.agendaDefaultDays,
      autoScrollWeekToNow:
        typeof parsed.autoScrollWeekToNow === "boolean" ? parsed.autoScrollWeekToNow : fallback.autoScrollWeekToNow,
      showEventDescriptions:
        typeof parsed.showEventDescriptions === "boolean"
          ? parsed.showEventDescriptions
          : fallback.showEventDescriptions,
    };
  } catch {
    return createDefaultCalendarSettings();
  }
}

function write(value: CalendarSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(value));
  listeners.forEach((listener) => listener());
}

export function useCalendarSettings() {
  const [settings, setSettings] = useState<CalendarSettings>(createDefaultCalendarSettings());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(read());
    setHydrated(true);
    const update = () => setSettings(read());
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
    settings,
    save(next: CalendarSettings) {
      write(next);
    },
    update(patch: Partial<CalendarSettings>) {
      write({ ...read(), ...patch });
    },
    reset() {
      write(createDefaultCalendarSettings());
    },
  };
}
