import { SnapTLDOverviewPage } from "@/modules/snaptld/pages/SnapTLDOverviewPage";
import { getInitialSnapTldUserState, getSnapTldRepository } from "@/modules/snaptld/server/repository";

export default async function Page() {
  const repository = getSnapTldRepository();
  const [domains, feeds, series, initialUserState] = await Promise.all([
    repository.listDomains(),
    repository.listFeeds(),
    repository.getOverviewSeries(),
    getInitialSnapTldUserState(),
  ]);

  return (
    <SnapTLDOverviewPage
      domains={domains}
      feeds={feeds}
      scoreTrend={series.scoreTrend}
      volumePerDay={series.volumePerDay}
      initialUserState={initialUserState}
    />
  );
}
