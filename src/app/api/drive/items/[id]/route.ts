import { badRequest, getDriveRepository, jsonOk, notFound, serverError } from "../../_lib";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const repository = getDriveRepository();
    const item = await repository.getItem(id);
    return item ? jsonOk({ item }) : notFound();
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const repository = getDriveRepository();

    if (body.action === "toggleFavorite") {
      return jsonOk({ item: await repository.toggleFavorite(id) });
    }

    if (typeof body.name === "string") {
      const name = body.name.trim();
      if (!name) return badRequest("Filnamn saknas");
      return jsonOk({ item: await repository.renameItem(id, { name }) });
    }

    if ("parentId" in body) {
      return jsonOk({ item: await repository.moveItem(id, { parentId: body.parentId ?? null }) });
    }

    return badRequest("Ingen giltig Drive-ändring angavs");
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const repository = getDriveRepository();
    const url = new URL(request.url);
    if (url.searchParams.get("permanent") === "1") {
      await repository.permanentDeleteItem(id);
      return jsonOk({ ok: true });
    }
    return jsonOk({ item: await repository.deleteItem(id) });
  } catch (error) {
    return serverError(error);
  }
}
