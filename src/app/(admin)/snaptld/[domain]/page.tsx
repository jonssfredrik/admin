import { notFound } from "next/navigation";
import DomainDetailPage from "@/modules/snaptld/domain-detail/DomainDetailPage";
import { getInitialSnapTldUserState, getSnapTldRepository } from "@/modules/snaptld/server/repository";

export default async function Page({ params }: { params: Promise<{ domain: string }> }) {
  const { domain: slug } = await params;
  const repository = getSnapTldRepository();
  const [domain, domains, initialUserState] = await Promise.all([
    repository.getDomainBySlug(slug),
    repository.listDomains(),
    getInitialSnapTldUserState(),
  ]);

  if (!domain) notFound();

  return (
    <DomainDetailPage
      domain={domain}
      domains={domains}
      activeWeightsYaml={initialUserState.activeWeightsYaml}
      initialUserState={initialUserState}
    />
  );
}
