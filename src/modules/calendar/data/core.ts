export type EventSource = "manual" | "subscriptions" | "billing" | "snaptld";
export type CalendarCategory = "work" | "personal" | "deadline" | "reminder";
export type EventRecurrence = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  endTime?: string;
  category: CalendarCategory;
  source: EventSource;
  sourceRef?: string;
  recurrence?: EventRecurrence;
  color?: string;
}

export interface ResolvedCalendarEvent extends CalendarEvent {
  instanceId: string;
  entityId: string;
  href?: string;
  isAggregated: boolean;
  statusLabel?: string;
  sourceDetail?: string;
  actionLabel?: string;
}

export const WEEKDAYS = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"] as const;

export const MONTHS = [
  "januari",
  "februari",
  "mars",
  "april",
  "maj",
  "juni",
  "juli",
  "augusti",
  "september",
  "oktober",
  "november",
  "december",
] as const;

export const categoryMeta: Record<CalendarCategory, { label: string; badgeClass: string }> = {
  work: {
    label: "Arbete",
    badgeClass: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  personal: {
    label: "Privat",
    badgeClass: "bg-fg/10 text-fg",
  },
  deadline: {
    label: "Deadline",
    badgeClass: "bg-red-500/10 text-red-700 dark:text-red-300",
  },
  reminder: {
    label: "Påminnelse",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
};

export const sourceMeta: Record<
  EventSource,
  { label: string; chipClass: string; dotClass: string; borderClass: string }
> = {
  manual: {
    label: "Egna",
    chipClass: "bg-fg/10 text-fg hover:bg-fg/15",
    dotClass: "bg-fg",
    borderClass: "border-fg/15",
  },
  subscriptions: {
    label: "Abonnemang",
    chipClass: "bg-sky-500/10 text-sky-700 hover:bg-sky-500/15 dark:text-sky-300",
    dotClass: "bg-sky-500",
    borderClass: "border-sky-500/20",
  },
  billing: {
    label: "Billing",
    chipClass: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/15 dark:text-amber-300",
    dotClass: "bg-amber-500",
    borderClass: "border-amber-500/20",
  },
  snaptld: {
    label: "SnapTLD",
    chipClass: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
    borderClass: "border-emerald-500/20",
  },
};

export const manualColorMeta = {
  sky: {
    label: "Blå",
    chipClass: "bg-sky-500/10 text-sky-700 hover:bg-sky-500/15 dark:text-sky-300",
    dotClass: "bg-sky-500",
    borderClass: "border-sky-500/20",
  },
  emerald: {
    label: "Grön",
    chipClass: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
    borderClass: "border-emerald-500/20",
  },
  amber: {
    label: "Amber",
    chipClass: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/15 dark:text-amber-300",
    dotClass: "bg-amber-500",
    borderClass: "border-amber-500/20",
  },
  red: {
    label: "Röd",
    chipClass: "bg-red-500/10 text-red-700 hover:bg-red-500/15 dark:text-red-300",
    dotClass: "bg-red-500",
    borderClass: "border-red-500/20",
  },
  violet: {
    label: "Violett",
    chipClass: "bg-violet-500/10 text-violet-700 hover:bg-violet-500/15 dark:text-violet-300",
    dotClass: "bg-violet-500",
    borderClass: "border-violet-500/20",
  },
} as const;

export type ManualColor = keyof typeof manualColorMeta;

export function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISODate(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function todayISO() {
  return toISODate(new Date());
}

export function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function addMonths(date: Date, amount: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function startOfWeek(date: Date) {
  const current = new Date(date);
  const weekday = (current.getDay() + 6) % 7;
  current.setDate(current.getDate() - weekday);
  current.setHours(0, 0, 0, 0);
  return current;
}

export function endOfWeek(date: Date) {
  return addDays(startOfWeek(date), 6);
}

export function formatMonthYear(date: Date) {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateLong(value: string) {
  return parseISODate(value).toLocaleDateString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(value: string) {
  return parseISODate(value).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
  });
}

export function formatWeekdayLabel(value: string) {
  return parseISODate(value).toLocaleDateString("sv-SE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatTimeLabel(time?: string, endTime?: string) {
  if (!time) return "Heldag";
  return endTime ? `${time}–${endTime}` : time;
}

export function recurrenceLabel(recurrence?: EventRecurrence) {
  switch (recurrence ?? "none") {
    case "daily":
      return "Dagligen";
    case "weekly":
      return "Varje vecka";
    case "monthly":
      return "Varje månad";
    case "yearly":
      return "Varje år";
    default:
      return null;
  }
}

export function inRange(date: string, start: string, end: string) {
  return date >= start && date <= end;
}

export function sortEvents(a: ResolvedCalendarEvent, b: ResolvedCalendarEvent) {
  if (a.date !== b.date) return a.date.localeCompare(b.date);
  if (!a.time && b.time) return -1;
  if (a.time && !b.time) return 1;
  if (a.time && b.time && a.time !== b.time) return a.time.localeCompare(b.time);
  return a.title.localeCompare(b.title, "sv-SE");
}

export function getEventTone(event: Pick<CalendarEvent, "source" | "color">) {
  if (event.source === "manual" && event.color && event.color in manualColorMeta) {
    return manualColorMeta[event.color as ManualColor];
  }
  return sourceMeta[event.source];
}

function advanceOccurrence(date: Date, recurrence: EventRecurrence) {
  const next = new Date(date);
  if (recurrence === "daily") next.setDate(next.getDate() + 1);
  if (recurrence === "weekly") next.setDate(next.getDate() + 7);
  if (recurrence === "monthly") next.setMonth(next.getMonth() + 1);
  if (recurrence === "yearly") next.setFullYear(next.getFullYear() + 1);
  return next;
}

export function expandManualEvents(events: CalendarEvent[], start: string, end: string) {
  const startDate = parseISODate(start);
  const endDate = parseISODate(end);

  return events.flatMap<ResolvedCalendarEvent>((event) => {
    const recurrence = event.recurrence ?? "none";
    const occurrences: ResolvedCalendarEvent[] = [];
    let cursor = parseISODate(event.date);
    let safety = 0;

    while (cursor <= endDate && safety < 400) {
      const occurrenceDate = toISODate(cursor);
      if (cursor >= startDate && occurrenceDate >= start && occurrenceDate <= end) {
        occurrences.push({
          ...event,
          date: occurrenceDate,
          instanceId: `${event.id}:${occurrenceDate}`,
          entityId: event.id,
          isAggregated: false,
        });
      }

      if (recurrence === "none") break;
      cursor = advanceOccurrence(cursor, recurrence);
      safety++;
    }

    return occurrences;
  });
}

export function getEventStartMinutes(event: Pick<CalendarEvent, "time">) {
  if (!event.time) return 0;
  const [hours, minutes] = event.time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getEventDurationMinutes(event: Pick<CalendarEvent, "time" | "endTime">) {
  if (!event.time) return 60;
  if (!event.endTime) return 60;
  const start = getEventStartMinutes(event);
  const [endHours, endMinutes] = event.endTime.split(":").map(Number);
  const end = endHours * 60 + endMinutes;
  return Math.max(30, end - start);
}

export function daysUntil(value: string) {
  const target = parseISODate(value).getTime();
  const today = parseISODate(todayISO()).getTime();
  return Math.round((target - today) / 86400000);
}
