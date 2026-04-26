import { badRequest, getDriveRepository, jsonOk, serverError } from "../_lib";

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    const repository = getDriveRepository();

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      if (!(file instanceof File)) return badRequest("Fil saknas");
      if (file.size > MAX_UPLOAD_BYTES) return badRequest("Filen är större än 100 MB");
      const parentIdValue = formData.get("parentId");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const item = await repository.createUpload({
        name: file.name,
        sizeBytes: file.size,
        mimeType: file.type || undefined,
        parentId: typeof parentIdValue === "string" && parentIdValue ? parentIdValue : null,
        bytes,
      });
      return jsonOk({ item }, { status: 201 });
    }

    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const sizeBytes = Number(body.sizeBytes ?? 0);

    if (!name) return badRequest("Filnamn saknas");
    if (!Number.isFinite(sizeBytes) || sizeBytes < 0) return badRequest("Filstorlek är ogiltig");
    if (sizeBytes > MAX_UPLOAD_BYTES) return badRequest("Filen är större än 100 MB");

    const item = await repository.createUpload({
      name,
      sizeBytes,
      mimeType: typeof body.mimeType === "string" ? body.mimeType : undefined,
      parentId: body.parentId ?? null,
    });
    return jsonOk({ item }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
