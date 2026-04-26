import { badRequest, getApiRepository, ok } from "@/app/api/snaptld/_lib";
import type { ImportDomainsInput, ImportedDomainRecord } from "@/modules/snaptld/types";


export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("all") === "1") {
    return ok(await getApiRepository().listImportedDomains());
  }

  return ok(await getApiRepository().listImportedDomainPage({
    page: Number(url.searchParams.get("page") ?? 1),
    pageSize: Number(url.searchParams.get("pageSize") ?? 100),
    query: url.searchParams.get("q") ?? "",
    status: (url.searchParams.get("status") as "all" | ImportedDomainRecord["status"] | null) ?? "all",
    source: (url.searchParams.get("source") as "all" | ImportedDomainRecord["source"] | null) ?? "all",
    tld: url.searchParams.get("tld") ?? "all",
    sortKey: (url.searchParams.get("sort") as "domain" | "status" | "source" | "importedAt" | "expiresAt" | "score" | "verdict" | null) ?? "importedAt",
    sortDir: (url.searchParams.get("dir") as "asc" | "desc" | null) ?? "desc",
  }));
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ImportDomainsInput | null;
  if (!body) return badRequest("Ogiltig JSON");
  if (body.mode === "url" && !body.url) return badRequest("URL krävs för url-import");
  if (body.mode !== "url" && !Array.isArray(body.validDomains)) return badRequest("validDomains krävs");
  return ok(await getApiRepository().importDomains(body));
}
