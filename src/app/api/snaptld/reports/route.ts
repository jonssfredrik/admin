import { badRequest, getApiRepository, ok } from "@/app/api/snaptld/_lib";
import type { CreateReportInput } from "@/modules/snaptld/types";


export async function GET() {
  return ok(await getApiRepository().listReports());
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CreateReportInput | null;
  if (!body) return badRequest("Ogiltig JSON");
  if (!body.templateId || !body.format) return badRequest("templateId och format krävs");
  return ok(await getApiRepository().createReport(body));
}
