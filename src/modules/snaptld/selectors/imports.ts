import type { ImportedDomainRecord } from "@/modules/snaptld/types";

export type ImportedSortKey = "domain" | "importedAt" | "expiresAt" | "score";
export type ImportedSortDir = "asc" | "desc";

export interface ImportedFilters {
  query: string;
  status: "all" | ImportedDomainRecord["status"];
  source: "all" | ImportedDomainRecord["source"];
  tld: "all" | string;
}

export function getImportedUniqueTlds(records: ImportedDomainRecord[]) {
  return Array.from(new Set(records.map((record) => record.tld))).sort();
}

export function getImportedUniqueSources(records: ImportedDomainRecord[]) {
  return Array.from(
    new Map(records.map((record) => [record.source, record.sourceLabel])).entries(),
  ).map(([id, label]) => ({ id, label }));
}

export function getImportedStats(records: ImportedDomainRecord[]) {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const analyzed = records.filter((record) => record.status === "analyzed").length;
  const running = records.filter((record) => record.status === "running").length;
  const uniqueBatches = new Set(records.map((record) => record.batchId)).size;
  const importedToday = records.filter((record) => record.importedAt.startsWith(todayKey)).length;
  return { analyzed, running, uniqueBatches, importedToday };
}

export function getImportedRows(
  records: ImportedDomainRecord[],
  filters: ImportedFilters,
  sortKey: ImportedSortKey,
  sortDir: ImportedSortDir,
) {
  const query = filters.query.trim().toLowerCase();
  const dir = sortDir === "asc" ? 1 : -1;

  return records
    .filter((record) => {
      if (filters.status !== "all" && record.status !== filters.status) return false;
      if (filters.source !== "all" && record.source !== filters.source) return false;
      if (filters.tld !== "all" && record.tld !== filters.tld) return false;
      if (
        query &&
        !record.domain.toLowerCase().includes(query) &&
        !record.batchId.toLowerCase().includes(query) &&
        !record.importedBy.toLowerCase().includes(query)
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortKey) {
        case "domain":
          return a.domain.localeCompare(b.domain) * dir;
        case "expiresAt":
          return a.expiresAt.localeCompare(b.expiresAt) * dir;
        case "score":
          return (a.totalScore - b.totalScore) * dir;
        case "importedAt":
        default:
          return a.importedAt.localeCompare(b.importedAt) * dir;
      }
    });
}
