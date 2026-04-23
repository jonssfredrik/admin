import { WeightsPage } from "@/modules/snaptld/pages/WeightsPage";
import { getInitialSnapTldUserState, getSnapTldRepository } from "@/modules/snaptld/server/repository";

export default async function Page() {
  const repository = getSnapTldRepository();
  const [domains, initialUserState] = await Promise.all([
    repository.listDomains(),
    getInitialSnapTldUserState(),
  ]);

  return <WeightsPage domains={domains} initialYaml={initialUserState.activeWeightsYaml} />;
}
