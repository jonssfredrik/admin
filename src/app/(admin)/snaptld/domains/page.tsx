import { ImportedDomainsPage } from "@/modules/snaptld/pages/ImportedDomainsPage";
import { getInitialSnapTldUserState, getSnapTldRepository } from "@/modules/snaptld/server/repository";

export default async function Page() {
  const repository = getSnapTldRepository();
  const [domains, initialUserState] = await Promise.all([
    repository.listImportedDomains(),
    getInitialSnapTldUserState(),
  ]);

  return <ImportedDomainsPage domains={domains} initialUserState={initialUserState} />;
}
