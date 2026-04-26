import { getApiRepository, ok } from "@/app/api/snaptld/_lib";


export async function GET() {
  return ok(await getApiRepository().getOverviewSeries());
}
