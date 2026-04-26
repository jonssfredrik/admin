import { notFound } from "next/navigation";
import { ReportDetailPage } from "@/modules/snaptld/pages/ReportDetailPage";
import { getSnapTldRepository } from "@/modules/snaptld/server/repository";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = await getSnapTldRepository().getReportById(reportId);

  if (!report) notFound();

  return <ReportDetailPage report={report} />;
}
