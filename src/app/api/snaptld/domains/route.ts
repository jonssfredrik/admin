import { getApiRepository, ok } from "@/app/api/snaptld/_lib";
import type { DomainAnalysis } from "@/modules/snaptld/types";


export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("all") === "1") {
    return ok(await getApiRepository().listDomains());
  }

  return ok(await getApiRepository().listDomainPage({
    page: Number(url.searchParams.get("page") ?? 1),
    pageSize: Number(url.searchParams.get("pageSize") ?? 50),
    query: url.searchParams.get("q") ?? "",
    verdict: (url.searchParams.get("verdict") as "all" | DomainAnalysis["verdict"] | null) ?? "all",
    tld: url.searchParams.get("tld") ?? "all",
    sortKey: (url.searchParams.get("sort") as "score" | "domain" | "verdict" | "expires" | "source" | "value" | null) ?? "score",
    sortDir: (url.searchParams.get("dir") as "asc" | "desc" | null) ?? "desc",
  }));
}
