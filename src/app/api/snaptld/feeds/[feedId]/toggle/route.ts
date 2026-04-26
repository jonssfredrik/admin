import { getApiRepository, ok } from "@/app/api/snaptld/_lib";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ feedId: string }> },
) {
  const { feedId } = await params;
  return ok(await getApiRepository().toggleFeedStatus(feedId));
}
