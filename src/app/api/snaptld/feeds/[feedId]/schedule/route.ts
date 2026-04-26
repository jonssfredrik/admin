import { badRequest, getApiRepository, ok } from "@/app/api/snaptld/_lib";
import type { FeedSource } from "@/modules/snaptld/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ feedId: string }> },
) {
  const { feedId } = await params;
  const body = (await request.json().catch(() => null)) as { schedule?: FeedSource["schedule"] } | null;
  if (!body?.schedule) return badRequest("schedule krävs");
  return ok(await getApiRepository().updateFeedSchedule(feedId, body.schedule));
}
