import { getApiRepository, ok } from "@/app/api/snaptld/_lib";


export async function POST() {
  return ok(await getApiRepository().resetWeights());
}
