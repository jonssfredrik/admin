import type { DomainAnalysis } from "@/modules/snaptld/types";

function rootName(domain: string) {
  return domain.split(".")[0];
}

function similarity(a: DomainAnalysis, b: DomainAnalysis) {
  let score = 0;
  if (a.tld === b.tld) score += 40;
  const lenDiff = Math.abs(rootName(a.domain).length - rootName(b.domain).length);
  score += Math.max(0, 25 - lenDiff * 5);
  if (a.verdict === b.verdict) score += 20;
  const scoreDiff = Math.abs(a.totalScore - b.totalScore);
  score += Math.max(0, 15 - scoreDiff * 0.5);
  return score;
}

export function getSimilarDomains(domain: DomainAnalysis, domains: DomainAnalysis[], limit = 4) {
  return domains
    .filter((candidate) => candidate.slug !== domain.slug)
    .map((candidate) => ({ candidate, score: similarity(domain, candidate) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.candidate);
}
