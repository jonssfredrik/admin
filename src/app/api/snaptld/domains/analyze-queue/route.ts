import { badRequest, getApiRepository, ok } from "@/app/api/snaptld/_lib";
import type { AnalysisCategory, AnalyzeQueueInput } from "@/modules/snaptld/types";

const validSteps = new Set<string>([
  "overview",
  "structure",
  "lexical",
  "brand",
  "market",
  "risk",
  "salability",
  "seo",
  "history",
]);

const validSubAnalyses: Record<AnalysisCategory, Set<string>> = {
  structure: new Set(["structure-local"]),
  lexical: new Set(["lexicon-local"]),
  brand: new Set(["brand-local", "brand-ai"]),
  market: new Set(["market-local", "market-ai"]),
  risk: new Set(["risk-local", "risk-trademark"]),
  salability: new Set(["salability-local", "salability-ai"]),
  seo: new Set(["seo-keyword-local", "seo-moz"]),
  history: new Set(["history-whois", "history-wayback"]),
};

function isAnalysisStep(step: unknown): step is "overview" | AnalysisCategory {
  return typeof step === "string" && validSteps.has(step);
}

function normalizeSelectedSubAnalyses(input: unknown): AnalyzeQueueInput["selectedSubAnalyses"] {
  if (!input || typeof input !== "object") return undefined;
  const selected = input as Record<string, unknown>;
  return Object.entries(validSubAnalyses).reduce<Partial<Record<AnalysisCategory, string[]>>>((acc, [category, validIds]) => {
    const value = selected[category];
    if (Array.isArray(value)) {
      acc[category as AnalysisCategory] = value.filter((id): id is string => typeof id === "string" && validIds.has(id));
    }
    return acc;
  }, {});
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<AnalyzeQueueInput>;
  const limit = body.limit ?? 25;
  if (limit !== "all" && (!Number.isInteger(limit) || limit < 1 || limit > 1000)) {
    return badRequest("limit måste vara 'all' eller ett heltal mellan 1 och 1000");
  }

  const steps: Array<"overview" | AnalysisCategory> =
    Array.isArray(body.steps) && body.steps.every(isAnalysisStep) ? body.steps.filter(isAnalysisStep) : ["overview"];
  if (!["queued", "not-analyzed", "all", "missing-step", "selected"].includes(body.scope ?? "queued")) return badRequest("Ogiltigt urval");
  if (body.missingStep && !validSteps.has(body.missingStep)) return badRequest("Ogiltigt saknat analyssteg");
  if (body.dateFilter && !/^\d{4}-\d{2}-\d{2}$/.test(body.dateFilter.date)) return badRequest("Ogiltigt datum");

  return ok(await getApiRepository().analyzeQueue({
    limit,
    steps,
    scope: body.scope ?? "queued",
    slugs: Array.isArray(body.slugs) ? body.slugs.filter((slug): slug is string => typeof slug === "string") : undefined,
    selectedSubAnalyses: normalizeSelectedSubAnalyses(body.selectedSubAnalyses),
    dateFilter: body.dateFilter ?? null,
    missingStep: body.missingStep as AnalysisCategory | null | undefined,
    sortBy: body.sortBy ?? "oldest-imported",
  }));
}
