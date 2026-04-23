import { SourcesPage } from "@/modules/snaptld/pages/SourcesPage";
import { getSnapTldRepository } from "@/modules/snaptld/server/repository";

export default async function Page() {
  const feeds = await getSnapTldRepository().listFeeds();
  return <SourcesPage feeds={feeds} />;
}
