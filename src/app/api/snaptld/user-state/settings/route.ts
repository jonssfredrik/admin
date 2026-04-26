import { getApiRepository, ok } from "@/app/api/snaptld/_lib";
import type { SnapTldSettings } from "@/modules/snaptld/types";


export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as SnapTldSettings | null;
  return ok(await getApiRepository().saveSettings(body ?? {
    apiKeys: {},
    thresholds: { scoreAlert: 85, expiryAlert: 3, costCap: 250 },
    notifyEmail: "",
    pushEnabled: true,
  }));
}
