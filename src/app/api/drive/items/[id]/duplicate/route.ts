import { getDriveRepository, jsonOk, serverError } from "../../../_lib";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const repository = getDriveRepository();
    return jsonOk({ item: await repository.duplicateItem(id) }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
