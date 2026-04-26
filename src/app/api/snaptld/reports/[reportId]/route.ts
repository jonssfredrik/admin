import { getApiRepository, notFound, ok } from "@/app/api/snaptld/_lib";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> },
) {
  const { reportId } = await params;
  const report = await getApiRepository().getReportById(reportId);
  if (!report) return notFound("Rapport hittades inte");
  return ok(report);
}
