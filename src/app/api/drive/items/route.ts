import type { DriveFileType, DriveListQuery, DriveScope, DriveSortKey } from "@/modules/drive/types";
import { getDriveRepository, jsonOk, serverError } from "../_lib";

const scopes: DriveScope[] = ["files", "recent", "trash"];
const sorts: DriveSortKey[] = ["name", "updated", "size", "type"];
const types = ["all", "folder", "image", "pdf", "text", "code", "video", "archive", "document", "other"] as const;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const scope = url.searchParams.get("scope");
    const sort = url.searchParams.get("sort");
    const type = url.searchParams.get("type");
    const parentId = url.searchParams.get("parentId");

    const query: DriveListQuery = {
      q: url.searchParams.get("q") ?? undefined,
      parentId: parentId === "__root" ? null : parentId,
      scope: scope && scopes.includes(scope as DriveScope) ? (scope as DriveScope) : "files",
      sort: sort && sorts.includes(sort as DriveSortKey) ? (sort as DriveSortKey) : "name",
      type: type && types.includes(type as (typeof types)[number]) ? (type as "all" | "folder" | DriveFileType) : "all",
    };

    const repository = getDriveRepository();
    const items = await repository.listItems(query);
    return jsonOk({ items });
  } catch (error) {
    return serverError(error);
  }
}
