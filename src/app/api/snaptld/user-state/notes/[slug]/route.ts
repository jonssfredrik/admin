import { getApiRepository, ok } from "@/app/api/snaptld/_lib";
import type { DomainNote } from "@/modules/snaptld/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = (await request.json().catch(() => ({}))) as { note?: DomainNote | null };
  return ok(await getApiRepository().saveNote(slug, body.note ?? null));
}
