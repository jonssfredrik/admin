import type { DomainAnalysis, Verdict } from "@/modules/snaptld/types";
import type { FeedSource } from "@/modules/snaptld/types";
import { verdictMeta } from "@/modules/snaptld/data/core";
import { rankingScore } from "@/modules/snaptld/lib/scoring";

const verdictColors: Record<Verdict, string> = {
  excellent: "#10b981",
  good: "#34d399",
  mediocre: "#f59e0b",
  skip: "#ef4444",
};

export function getOverviewStats(domains: DomainAnalysis[]) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const analyzedDomains = domains.filter((domain) => domain.status === "analyzed");
  const totalDomains = domains.length;
  const total = analyzedDomains.length;
  const importedToday = domains.filter((domain) => domain.fetchedAt.startsWith(todayKey)).length;
  const analyzedToday = analyzedDomains.filter((domain) => domain.fetchedAt.startsWith(todayKey)).length;
  const excellent = analyzedDomains.filter((domain) => domain.verdict === "excellent").length;
  const good = analyzedDomains.filter((domain) => domain.verdict === "good").length;
  const mediocre = analyzedDomains.filter((domain) => domain.verdict === "mediocre").length;
  const skip = analyzedDomains.filter((domain) => domain.verdict === "skip").length;
  const avg = total > 0 ? Math.round(analyzedDomains.reduce((sum, domain) => sum + rankingScore(domain), 0) / total) : 0;
  return { total, totalDomains, importedToday, analyzedToday, excellent, good, mediocre, skip, avg };
}

export function getTopCandidates(domains: DomainAnalysis[], limit = 5) {
  return [...domains]
    .filter((domain) => domain.status === "analyzed")
    .sort((a, b) => rankingScore(b) - rankingScore(a))
    .slice(0, limit);
}

export function getVerdictDonut(domains: DomainAnalysis[]) {
  const analyzedDomains = domains.filter((domain) => domain.status === "analyzed");
  return (["excellent", "good", "mediocre", "skip"] as Verdict[])
    .map((verdict) => ({
      label: verdictMeta[verdict].label,
      value: analyzedDomains.filter((domain) => domain.verdict === verdict).length,
      color: verdictColors[verdict],
    }))
    .filter((item) => item.value > 0);
}

export function getActiveFeedCount(feeds: FeedSource[]) {
  return feeds.filter((feed) => feed.status === "active").length;
}

export function getRunningDomain(domains: DomainAnalysis[]) {
  return domains.find((domain) => domain.status === "running");
}
