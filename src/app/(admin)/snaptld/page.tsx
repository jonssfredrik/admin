import { SnapTLDOverviewPage } from "@/modules/snaptld/pages/SnapTLDOverviewPage";
import { getInitialSnapTldUserState, getSnapTldRepository } from "@/modules/snaptld/server/repository";

export const dynamic = "force-dynamic";

export default async function Page() {
  const repository = getSnapTldRepository();
  const [domainPage, feeds, stats, series, initialUserState] = await Promise.all([
    repository.listDomainPage({ page: 1, pageSize: 200, sortKey: "score", sortDir: "desc" }),
    repository.listFeeds(),
    repository.getOverviewStats(),
    repository.getOverviewSeries(),
    getInitialSnapTldUserState(),
  ]);

  return (
    <SnapTLDOverviewPage
      domains={domainPage.items}
      feeds={feeds}
      stats={stats}
      importedPerDay={series.importedPerDay}
      volumePerDay={series.volumePerDay}
      initialUserState={initialUserState}
    />
  );
}
