import type { Tone } from "@/modules/snaptld/data/core";

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
