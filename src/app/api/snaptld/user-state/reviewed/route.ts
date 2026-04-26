import { badRequest, getApiRepository, ok } from "@/app/api/snaptld/_lib";


export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { slugs?: string[] } | null;
  if (!Array.isArray(body?.slugs)) return badRequest("slugs krävs");
  return ok(await getApiRepository().addReviewedMany(body.slugs));
}
