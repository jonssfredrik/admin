import { getApiRepository, notFound, ok } from "@/app/api/snaptld/_lib";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const domain = await getApiRepository().getDomainBySlug(slug);
  if (!domain) return notFound("Domän hittades inte");
  return ok(domain);
}
