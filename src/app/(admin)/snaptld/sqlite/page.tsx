import { SqlitePage } from "@/modules/snaptld/pages/SqlitePage";
import { getSqliteSnapshot } from "@/modules/snaptld/server/sqlite-inspect";

export const dynamic = "force-dynamic";

export default async function Page() {
  const snapshot = await getSqliteSnapshot();
  return <SqlitePage snapshot={snapshot} />;
}
