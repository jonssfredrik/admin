import { getApiRepository, ok } from "@/app/api/snaptld/_lib";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return ok(await getApiRepository().toggleHidden(slug));
}
