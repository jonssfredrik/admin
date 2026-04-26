import { getDriveRepository, notFound, serverError } from "../../../_lib";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const repository = getDriveRepository();
    const item = await repository.getItem(id);
    if (!item || item.kind !== "file") return notFound();

    const bytes = await repository.getFileBytes(id);
    if (!bytes) return notFound("Preview-fil hittades inte");

    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": item.mimeType || "application/octet-stream",
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (error) {
    return serverError(error);
  }
}
