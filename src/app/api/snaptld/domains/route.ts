import { getApiRepository, ok } from "@/app/api/snaptld/_lib";
import type { AnalysisCategory, DomainAnalysis } from "@/modules/snaptld/types";

function readNumberParam(url: URL, key: string) {
  const raw = url.searchParams.get(key);
  if (!raw) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("all") === "1") {
    return ok(await getApiRepository().listDomains());
  }

  const minScore = readNumberParam(url, "smin");
  const maxScore = readNumberParam(url, "smax");
  const minDaysUntilExpiry = readNumberParam(url, "emin");
  const maxDaysUntilExpiry = readNumberParam(url, "emax") ?? readNumberParam(url, "expiry");
  const minDomainLength = readNumberParam(url, "lmin");
  const maxDomainLength = readNumberParam(url, "lmax");
  const minValue = readNumberParam(url, "vmin");
  const maxValue = readNumberParam(url, "vmax");

  return ok(await getApiRepository().listDomainPage({
    page: Number(url.searchParams.get("page") ?? 1),
    pageSize: Number(url.searchParams.get("pageSize") ?? 50),
    query: url.searchParams.get("q") ?? "",
    verdict: (url.searchParams.get("verdict") as "all" | DomainAnalysis["verdict"] | null) ?? "all",
    status: (url.searchParams.get("status") as "all" | DomainAnalysis["status"] | null) ?? "all",
    tld: url.searchParams.get("tld") ?? "all",
    source: (url.searchParams.get("src") as "all" | DomainAnalysis["source"] | null) ?? "all",
    minScore: minScore !== undefined && minScore > 0 ? minScore : undefined,
    maxScore: maxScore !== undefined && maxScore > 0 ? maxScore : undefined,
    minDaysUntilExpiry: minDaysUntilExpiry !== undefined && minDaysUntilExpiry >= 0 ? minDaysUntilExpiry : undefined,
    maxDaysUntilExpiry: maxDaysUntilExpiry !== undefined && maxDaysUntilExpiry >= 0 ? maxDaysUntilExpiry : undefined,
    domainLength: (url.searchParams.get("len") as "short" | "medium" | "long" | "all" | null) ?? "all",
    minDomainLength: minDomainLength !== undefined && minDomainLength > 0 ? minDomainLength : undefined,
    maxDomainLength: maxDomainLength !== undefined && maxDomainLength > 0 ? maxDomainLength : undefined,
    minValue: minValue !== undefined && minValue > 0 ? minValue : undefined,
    maxValue: maxValue !== undefined && maxValue > 0 ? maxValue : undefined,
    analysisStepMode: (url.searchParams.get("amode") as "all" | "none" | "complete" | "has" | "missing" | null) ?? "all",
    analysisStep: (url.searchParams.get("astep") as AnalysisCategory | null) ?? null,
    sortKey: (url.searchParams.get("sort") as "score" | "domain" | "verdict" | "expires" | "source" | "value" | "analysis" | null) ?? "score",
    sortDir: (url.searchParams.get("dir") as "asc" | "desc" | null) ?? "desc",
  }));
}
