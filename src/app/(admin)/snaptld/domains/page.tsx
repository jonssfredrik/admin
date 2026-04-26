import { ImportedDomainsPage } from "@/modules/snaptld/pages/ImportedDomainsPage";
import { getInitialSnapTldUserState, getSnapTldRepository } from "@/modules/snaptld/server/repository";
import type { ImportedDomainRecord } from "@/modules/snaptld/types";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(searchParams: SearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const repository = getSnapTldRepository();
  const [domains, initialUserState] = await Promise.all([
    repository.listImportedDomainPage({
      page: Number(readParam(params, "page") ?? 1),
      pageSize: 100,
      query: readParam(params, "q") ?? "",
      status: (readParam(params, "status") as "all" | ImportedDomainRecord["status"] | undefined) ?? "all",
      source: (readParam(params, "source") as "all" | ImportedDomainRecord["source"] | undefined) ?? "all",
      tld: readParam(params, "tld") ?? "all",
      sortKey:
        (readParam(params, "sort") as "domain" | "status" | "source" | "importedAt" | "expiresAt" | "score" | "verdict" | undefined) ??
        "importedAt",
      sortDir: (readParam(params, "dir") as "asc" | "desc" | undefined) ?? "desc",
    }),
    getInitialSnapTldUserState(),
  ]);

  return <ImportedDomainsPage domains={domains} initialUserState={initialUserState} />;
}
