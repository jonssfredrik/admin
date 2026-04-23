import type { CurrencyCode, FeedSchedule, MoneyValueRange } from "@/modules/snaptld/types";

const currencyLocaleMap: Record<CurrencyCode, string> = {
  SEK: "sv-SE",
  USD: "en-US",
};

export function toDateTimeInput(value: string) {
  return value.includes("T") ? value : value.replace(" ", "T");
}

export function formatDateTime(value: string) {
  const date = new Date(toDateTimeInput(value));
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDate(value: string) {
  const date = new Date(value.length > 10 ? toDateTimeInput(value) : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "medium",
  }).format(date);
}

export function formatMoneyRange(range: MoneyValueRange) {
  const locale = currencyLocaleMap[range.currency];
  const numberFormat = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  });
  const suffix = range.currency === "SEK" ? "kr" : "$";
  return `${numberFormat.format(range.min)} – ${numberFormat.format(range.max)} ${suffix}`;
}

export function formatFeedSchedule(schedule: FeedSchedule) {
  if (schedule.type === "custom" && schedule.cron) return schedule.cron;
  return schedule.label;
}

export function formatRelativeDaysSince(value: string) {
  const date = new Date(toDateTimeInput(value));
  if (Number.isNaN(date.getTime())) return "okänt";
  const diff = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  return diff <= 0 ? "idag" : `${diff}d sedan`;
}
