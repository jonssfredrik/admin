export type IisPhase = "active" | "expired" | "deactivated" | "deregistered" | "released";

export interface IisDates {
  expiresAt: string;       // Förfallodatum         (release − 77d)
  deactivatedAt: string;   // Deaktiveringsdatum    (release − 67d)
  deregisteredAt: string;  // Avregistreringsdatum  (release − 7d)
  releasedAt: string;      // Datum för frisläppande
}

export interface IisPhaseInfo {
  phase: IisPhase;
  daysUntilRelease: number;
  dates: IisDates;
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function iisLifecycleDates(releasedAt: string): IisDates {
  return {
    expiresAt: addDays(releasedAt, -77),
    deactivatedAt: addDays(releasedAt, -67),
    deregisteredAt: addDays(releasedAt, -7),
    releasedAt,
  };
}

export function iisPhaseInfo(releasedAt: string, now: Date = new Date()): IisPhaseInfo {
  const dates = iisLifecycleDates(releasedAt);
  const releaseMs = new Date(`${releasedAt}T23:59:59Z`).getTime();
  const daysUntilRelease = Math.ceil((releaseMs - now.getTime()) / 86_400_000);

  let phase: IisPhase;
  if (daysUntilRelease < 0) phase = "released";
  else if (daysUntilRelease <= 7) phase = "deregistered";
  else if (daysUntilRelease <= 67) phase = "deactivated";
  else if (daysUntilRelease <= 77) phase = "expired";
  else phase = "active";

  return { phase, daysUntilRelease, dates };
}

export function isIisSource(source: string): source is "internetstiftelsen" {
  return source === "internetstiftelsen";
}
