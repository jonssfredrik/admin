import type { DomainAnalysis, Verdict } from "@/modules/snaptld/types";
import { expiryInfo } from "@/modules/snaptld/lib/urgency";

export type QueueSortKey = "score" | "domain" | "expires" | "value";
export type QueueSortDir = "asc" | "desc";

export interface QueueFilters {
  query: string;
  verdict: "all" | Verdict;
  tld: "all" | string;
  tagFilter: string | null;
  onlyWatched: boolean;
  showHidden: boolean;
}

function parseValue(range: string): number {
  const match = range.match(/(\d[\d\s]*)/);
  return match ? parseInt(match[1].replace(/\s/g, ""), 10) : 0;
}

export function getUniqueTlds(domains: DomainAnalysis[]) {
  return Array.from(new Set(domains.map((domain) => domain.tld))).sort();
}

export function getQueueRows(
  domains: DomainAnalysis[],
  filters: QueueFilters,
  sortKey: QueueSortKey,
  sortDir: QueueSortDir,
  watchedSlugs: string[],
  hiddenSlugs: string[],
  tagMap: Map<string, string[]>,
) {
  const query = filters.query.trim().toLowerCase();
  const watched = new Set(watchedSlugs);
  const hidden = new Set(hiddenSlugs);
  const dir = sortDir === "asc" ? 1 : -1;

  return domains
    .filter((domain) => {
      if (filters.verdict !== "all" && domain.verdict !== filters.verdict) return false;
      if (filters.tld !== "all" && domain.tld !== filters.tld) return false;
      if (filters.tagFilter && !(tagMap.get(domain.slug)?.includes(filters.tagFilter) ?? false)) return false;
      if (filters.onlyWatched && !watched.has(domain.slug)) return false;

      const isHidden = hidden.has(domain.slug);
      if (isHidden && !filters.showHidden) return false;
      if (!isHidden && filters.showHidden) return false;

      if (query && !domain.domain.toLowerCase().includes(query) && !domain.source.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortKey) {
        case "domain":
          return a.domain.localeCompare(b.domain) * dir;
        case "expires":
          return (expiryInfo(a.expiresAt).days - expiryInfo(b.expiresAt).days) * dir;
        case "value":
          return (parseValue(a.estimatedValue) - parseValue(b.estimatedValue)) * dir;
        case "score":
        default:
          return (a.totalScore - b.totalScore) * dir;
      }
    });
}
