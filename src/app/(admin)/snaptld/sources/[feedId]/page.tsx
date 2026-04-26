import { notFound } from "next/navigation";
import { SourceDetailPage } from "@/modules/snaptld/pages/SourceDetailPage";
import { getSnapTldRepository } from "@/modules/snaptld/server/repository";
import type { ImportedDomainRecord } from "@/modules/snaptld/types";

export const dynamic = "force-dynamic";

function importsForFeed(feedId: string, feedTld: string, imports: ImportedDomainRecord[]) {
  if (feedId.startsWith("iis-")) {
    return imports.filter((d) => d.source === "internetstiftelsen" && d.tld === feedTld);
  }
  return imports.filter((d) => d.tld === feedTld);
}

export default async function Page({ params }: { params: Promise<{ feedId: string }> }) {
  const { feedId } = await params;
  const repository = getSnapTldRepository();
  const [feeds, importedDomains] = await Promise.all([
    repository.listFeeds(),
    repository.listImportedDomains(),
  ]);

  const feed = feeds.find((entry) => entry.id === feedId);
  if (!feed) notFound();

  const domains = importsForFeed(feed.id, feed.tld, importedDomains);
  return <SourceDetailPage feed={feed} domains={domains} />;
}
