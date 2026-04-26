import { SettingsPage } from "@/modules/snaptld/pages/SettingsPage";
import { getInitialSnapTldUserState } from "@/modules/snaptld/server/repository";

export const dynamic = "force-dynamic";

export default async function Page() {
  const initialUserState = await getInitialSnapTldUserState();
  return <SettingsPage initialSettings={initialUserState.settings} />;
}
