import type { DomainAnalysis, Verdict } from "@/modules/snaptld/types";
import type { FeedSource } from "@/modules/snaptld/types";
import { verdictMeta } from "@/modules/snaptld/data/core";

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
  const avg = total > 0 ? Math.round(analyzedDomains.reduce((sum, domain) => sum + domain.totalScore, 0) / total) : 0;
  return { total, totalDomains, importedToday, analyzedToday, excellent, good, avg };
}

export function getTopCandidates(domains: DomainAnalysis[], limit = 5) {
  return [...domains]
    .filter((domain) => domain.status === "analyzed")
    .sort((a, b) => b.totalScore - a.totalScore)
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
