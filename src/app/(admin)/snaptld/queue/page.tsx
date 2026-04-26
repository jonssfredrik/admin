import { QueuePage } from "@/modules/snaptld/pages/QueuePage";
import { getInitialSnapTldUserState, getSnapTldRepository } from "@/modules/snaptld/server/repository";
import type { DomainAnalysis } from "@/modules/snaptld/types";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(searchParams: SearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const repository = getSnapTldRepository();
  const initialUserState = await getInitialSnapTldUserState();
  const domains = await repository.listDomainPage({
    page: Number(readParam(params, "page") ?? 1),
    pageSize: 20,
    query: readParam(params, "q") ?? "",
    verdict: (readParam(params, "verdict") as "all" | DomainAnalysis["verdict"] | undefined) ?? "all",
    tld: readParam(params, "tld") ?? "all",
    tagFilter: readParam(params, "tag") ?? null,
    onlyWatched: readParam(params, "watched") === "1",
    showHidden: readParam(params, "hidden") === "1",
    sortKey: (readParam(params, "sort") as "score" | "domain" | "verdict" | "expires" | "source" | "value" | undefined) ?? "score",
    sortDir: (readParam(params, "dir") as "asc" | "desc" | undefined) ?? "desc",
    watchedSlugs: initialUserState.watchlist,
    hiddenSlugs: initialUserState.hidden,
    notes: initialUserState.notes,
  });

  return <QueuePage domains={domains} initialUserState={initialUserState} />;
}
