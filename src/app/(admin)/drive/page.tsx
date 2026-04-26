import { DrivePage } from "@/modules/drive/pages/DrivePage";
import { createDriveRepository } from "@/modules/drive/server/repository";

export const dynamic = "force-dynamic";

export default async function DriveHomePage() {
  const repository = createDriveRepository();
  const activeItems = await repository.listItems({ scope: "recent", sort: "updated" });
  const trashItems = await repository.listItems({ scope: "trash", sort: "updated" });

  return <DrivePage initialItems={[...activeItems, ...trashItems]} />;
}
