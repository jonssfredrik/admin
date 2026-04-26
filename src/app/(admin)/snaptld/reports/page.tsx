import { ReportsPage } from "@/modules/snaptld/pages/ReportsPage";
import { getSnapTldRepository } from "@/modules/snaptld/server/repository";

export const dynamic = "force-dynamic";

export default async function Page() {
  const reports = await getSnapTldRepository().listReports();
  return <ReportsPage initialReports={reports} />;
}
