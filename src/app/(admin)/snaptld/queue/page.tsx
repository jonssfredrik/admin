import { QueuePage } from "@/modules/snaptld/pages/QueuePage";
import { getInitialSnapTldUserState, getSnapTldRepository } from "@/modules/snaptld/server/repository";

export default async function Page() {
  const repository = getSnapTldRepository();
  const [domains, initialUserState] = await Promise.all([
    repository.listDomains(),
    getInitialSnapTldUserState(),
  ]);

  return <QueuePage domains={domains} initialUserState={initialUserState} />;
}
