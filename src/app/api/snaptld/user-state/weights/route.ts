import { badRequest, getApiRepository, ok } from "@/app/api/snaptld/_lib";


export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as { yaml?: string } | null;
  if (typeof body?.yaml !== "string") return badRequest("yaml krävs");
  return ok(await getApiRepository().saveWeights(body.yaml));
}
