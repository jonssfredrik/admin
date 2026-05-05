import { QueuePage } from "@/modules/snaptld/pages/QueuePage";
import { getInitialSnapTldUserState, getSnapTldRepository } from "@/modules/snaptld/server/repository";
import type { AnalysisCategory, DomainAnalysis } from "@/modules/snaptld/types";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(searchParams: SearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function readNumberParam(searchParams: SearchParams, key: string) {
  const raw = readParam(searchParams, key);
  if (!raw) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const repository = getSnapTldRepository();
  const initialUserState = await getInitialSnapTldUserState();
  const minScoreRaw = readNumberParam(params, "smin");
  const maxScoreRaw = readNumberParam(params, "smax");
  const minDaysRaw = readNumberParam(params, "emin");
  const maxDaysRaw = readNumberParam(params, "emax") ?? readNumberParam(params, "expiry");
  const importedAfter = readParam(params, "iafter");
  const importedBefore = readParam(params, "ibefore");
  const minLengthRaw = readNumberParam(params, "lmin");
  const maxLengthRaw = readNumberParam(params, "lmax");
  const minValueRaw = readNumberParam(params, "vmin");
  const maxValueRaw = readNumberParam(params, "vmax");
  const pageSizeRaw = readNumberParam(params, "ps");
  const domains = await repository.listDomainPage({
    page: Number(readParam(params, "page") ?? 1),
    pageSize: pageSizeRaw !== undefined && pageSizeRaw > 0 ? pageSizeRaw : 20,
    query: readParam(params, "q") ?? "",
    verdict: (readParam(params, "verdict") as "all" | DomainAnalysis["verdict"] | undefined) ?? "all",
    status: (readParam(params, "status") as "all" | DomainAnalysis["status"] | undefined) ?? "all",
    tld: readParam(params, "tld") ?? "all",
    source: (readParam(params, "src") as "all" | DomainAnalysis["source"] | undefined) ?? "all",
    tagFilter: readParam(params, "tag") ?? null,
    onlyWatched: readParam(params, "watched") === "1",
    showHidden: readParam(params, "hidden") === "1",
    hideReviewed: readParam(params, "notreviewed") === "1",
    minScore: minScoreRaw !== undefined && minScoreRaw > 0 ? minScoreRaw : undefined,
    maxScore: maxScoreRaw !== undefined && maxScoreRaw > 0 ? maxScoreRaw : undefined,
    minDaysUntilExpiry: minDaysRaw !== undefined && minDaysRaw >= 0 ? minDaysRaw : undefined,
    maxDaysUntilExpiry: maxDaysRaw !== undefined && maxDaysRaw >= 0 ? maxDaysRaw : undefined,
    importedAfter: importedAfter && /^\d{4}-\d{2}-\d{2}$/.test(importedAfter) ? importedAfter : undefined,
    importedBefore: importedBefore && /^\d{4}-\d{2}-\d{2}$/.test(importedBefore) ? importedBefore : undefined,
    domainLength: (readParam(params, "len") as "short" | "medium" | "long" | "all" | undefined) ?? "all",
    minDomainLength: minLengthRaw !== undefined && minLengthRaw > 0 ? minLengthRaw : undefined,
    maxDomainLength: maxLengthRaw !== undefined && maxLengthRaw > 0 ? maxLengthRaw : undefined,
    minValue: minValueRaw !== undefined && minValueRaw > 0 ? minValueRaw : undefined,
    maxValue: maxValueRaw !== undefined && maxValueRaw > 0 ? maxValueRaw : undefined,
    analysisStepMode: (readParam(params, "amode") as "all" | "none" | "complete" | "has" | "missing" | undefined) ?? "all",
    analysisStep: (readParam(params, "astep") as AnalysisCategory | undefined) ?? null,
    subAnalysisMode: (readParam(params, "samode") as "all" | "has" | "missing" | undefined) ?? "all",
    subAnalysisId: readParam(params, "sasub") ?? null,
    sortKey: (readParam(params, "sort") as "score" | "domain" | "verdict" | "expires" | "source" | "value" | "analysis" | "subanalysis" | "imported" | undefined) ?? "score",
    sortDir: (readParam(params, "dir") as "asc" | "desc" | undefined) ?? "desc",
    watchedSlugs: initialUserState.watchlist,
    hiddenSlugs: initialUserState.hidden,
    reviewedSlugs: initialUserState.reviewed,
    notes: initialUserState.notes,
  });

  return <QueuePage domains={domains} initialUserState={initialUserState} />;
}
