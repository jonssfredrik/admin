import { WeightsPage } from "@/modules/snaptld/pages/WeightsPage";
import { getInitialSnapTldUserState, getSnapTldRepository } from "@/modules/snaptld/server/repository";

export const dynamic = "force-dynamic";

export default async function Page() {
  const repository = getSnapTldRepository();
  const [domainPage, initialUserState] = await Promise.all([
    repository.listDomainPage({ page: 1, pageSize: 200, sortKey: "score", sortDir: "desc" }),
    getInitialSnapTldUserState(),
  ]);

  return <WeightsPage domains={domainPage.items} initialYaml={initialUserState.activeWeightsYaml} />;
}
