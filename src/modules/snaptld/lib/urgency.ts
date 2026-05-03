import type { Tone } from "@/modules/snaptld/data/core";
import { iisPhaseInfo, isIisSource } from "./iis-lifecycle";

export interface ExpiryInfo {
  days: number;
  tone: Tone;
  label: string;
  short: string;
}

export function expiryInfo(expiresAt: string, now: Date = new Date()): ExpiryInfo {
  const then = new Date(`${expiresAt}T23:59:59`);
  const ms = then.getTime() - now.getTime();
  const days = Math.ceil(ms / 86_400_000);

  let tone: Tone;
  let label: string;
  let short: string;

  if (days < 0) {
    tone = "neutral";
    label = `Utgått för ${Math.abs(days)} d sedan`;
    short = `${Math.abs(days)}d sen`;
  } else if (days === 0) {
    tone = "danger";
    label = "Utgår idag";
    short = "Idag";
  } else if (days === 1) {
    tone = "danger";
    label = "Utgår imorgon";
    short = "1d";
  } else if (days <= 3) {
    tone = "danger";
    label = `Utgår om ${days} dagar`;
    short = `${days}d`;
  } else if (days <= 7) {
    tone = "warning";
    label = `Utgår om ${days} dagar`;
    short = `${days}d`;
  } else if (days <= 30) {
    tone = "neutral";
    label = `Utgår om ${days} dagar`;
    short = `${days}d`;
  } else {
    tone = "neutral";
    label = `Utgår om ${days} dagar`;
    short = `${days}d`;
  }

  return { days, tone, label, short };
}

function expiryInfoIis(releasedAt: string, now: Date = new Date()): ExpiryInfo {
  const { phase, daysUntilRelease, dates } = iisPhaseInfo(releasedAt, now);
  const d = Math.abs(daysUntilRelease);

  switch (phase) {
    case "released":
      return {
        days: daysUntilRelease,
        tone: "success",
        label: `Frisläppt ${releasedAt} — kan registreras`,
        short: "Frisläppt",
      };
    case "deregistered":
      return {
        days: daysUntilRelease,
        tone: "danger",
        label: daysUntilRelease === 0
          ? "Frisläpps idag!"
          : `Frisläpps om ${d} dag${d === 1 ? "" : "ar"} (${releasedAt})`,
        short: daysUntilRelease === 0 ? "Idag" : `${d}d`,
      };
    case "deactivated":
      return {
        days: daysUntilRelease,
        tone: "warning",
        label: `Deaktiverad — frisläpps om ${d} dagar (${releasedAt})`,
        short: `${d}d`,
      };
    case "expired":
      return {
        days: daysUntilRelease,
        tone: "neutral",
        label: `Utgången — deaktiverades ${dates.deactivatedAt} — frisläpps om ${d} dagar`,
        short: `${d}d`,
      };
    case "active":
      return {
        days: daysUntilRelease,
        tone: "neutral",
        label: `Löper ut ${dates.expiresAt}`,
        short: dates.expiresAt.slice(5),
      };
  }
}

export function expiryInfoFromSource(expiresAt: string, source: string, now: Date = new Date()): ExpiryInfo {
  if (isIisSource(source)) return expiryInfoIis(expiresAt, now);
  return expiryInfo(expiresAt, now);
}
