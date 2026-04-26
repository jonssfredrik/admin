import { badRequest, getDriveRepository, jsonOk, serverError } from "../_lib";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return badRequest("Mappnamn saknas");

    const repository = getDriveRepository();
    const item = await repository.createFolder({ name, parentId: body.parentId ?? null });
    return jsonOk({ item }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
