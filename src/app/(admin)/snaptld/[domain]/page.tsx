import { notFound } from "next/navigation";
import DomainDetailPage from "@/modules/snaptld/domain-detail/DomainDetailPage";
import { getInitialSnapTldUserState, getSnapTldRepository } from "@/modules/snaptld/server/repository";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ domain: string }> }) {
  const { domain: slug } = await params;
  const repository = getSnapTldRepository();
  const [domain, domainPage, initialUserState] = await Promise.all([
    repository.getDomainBySlug(slug),
    repository.listDomainPage({ page: 1, pageSize: 200, sortKey: "score", sortDir: "desc" }),
    getInitialSnapTldUserState(),
  ]);

  if (!domain) notFound();

  return (
    <DomainDetailPage
      domain={domain}
      domains={domainPage.items}
      activeWeightsYaml={initialUserState.activeWeightsYaml}
      initialUserState={initialUserState}
    />
  );
}
