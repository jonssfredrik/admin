import { badRequest, getApiRepository, ok } from "@/app/api/snaptld/_lib";

const validSteps = new Set([
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = (await request.json().catch(() => ({}))) as { step?: string };
  if (!slug) return badRequest("Slug saknas");
  if (body.step && !validSteps.has(body.step)) return badRequest("Ogiltigt analyssteg");
  return ok(await getApiRepository().rerunAnalysis(slug, body.step));
}
