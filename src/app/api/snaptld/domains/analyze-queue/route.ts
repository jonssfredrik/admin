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

function isAnalysisStep(step: unknown): step is "overview" | AnalysisCategory {
  return typeof step === "string" && validSteps.has(step);
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
    dateFilter: body.dateFilter ?? null,
    missingStep: body.missingStep as AnalysisCategory | null | undefined,
    sortBy: body.sortBy ?? "oldest-imported",
  }));
}
