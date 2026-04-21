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
  const total = domains.length;
  const excellent = domains.filter((domain) => domain.verdict === "excellent").length;
  const good = domains.filter((domain) => domain.verdict === "good").length;
  const avg = Math.round(domains.reduce((sum, domain) => sum + domain.totalScore, 0) / Math.max(total, 1));
  return { total, excellent, good, avg };
}

export function getTopCandidates(domains: DomainAnalysis[], limit = 5) {
  return [...domains]
    .filter((domain) => domain.status === "analyzed")
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit);
}

export function getVerdictDonut(domains: DomainAnalysis[]) {
  return (["excellent", "good", "mediocre", "skip"] as Verdict[])
    .map((verdict) => ({
      label: verdictMeta[verdict].label,
      value: domains.filter((domain) => domain.verdict === verdict).length,
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
