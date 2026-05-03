import type { DomainAnalysis, ImportedDomainRecord } from "@/modules/snaptld/types";

export function rankingScore(domain: Pick<DomainAnalysis | ImportedDomainRecord, "totalScore" | "scoreMax">) {
  return Math.max(0, Math.min(100, Math.round(domain.totalScore)));
}
