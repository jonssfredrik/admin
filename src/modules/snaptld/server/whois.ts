export interface WhoisAgeResult {
  createdAt: string;
  ageYears: number;
}

export async function fetchWhoisAge(domain: string): Promise<WhoisAgeResult | null> {
  const tld = domain.split(".").pop() ?? "";
  const url =
    tld === "se"
      ? `https://rdap.iis.se/domain/${domain}`
      : `https://rdap.iana.org/domain/${domain}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      events?: Array<{ eventAction: string; eventDate: string }>;
    };
    const reg = data.events?.find((e) => e.eventAction === "registration");
    if (!reg?.eventDate) return null;
    const created = new Date(reg.eventDate);
    if (isNaN(created.getTime())) return null;
    const ageYears = (Date.now() - created.getTime()) / (365.25 * 24 * 3600 * 1000);
    return { createdAt: created.toISOString().slice(0, 10), ageYears };
  } catch {
    return null;
  }
}

export function whoisAgeScore(ageYears: number): number {
  if (ageYears >= 15) return 50;
  if (ageYears >= 10) return 43;
  if (ageYears >= 5) return 35;
  if (ageYears >= 2) return 25;
  if (ageYears >= 1) return 15;
  return 5;
}
