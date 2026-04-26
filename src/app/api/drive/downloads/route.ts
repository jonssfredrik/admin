import { contentDisposition, createZip, safeArchiveName, type ZipEntry } from "@/modules/drive/server/archive";
import type { DriveItem } from "@/modules/drive/types";
import { badRequest, getDriveRepository, serverError } from "../_lib";

function fallbackContent(item: DriveItem) {
  return new TextEncoder().encode(item.preview.content ?? `${item.name}\n`);
}

function isDescendant(item: DriveItem, folder: DriveItem, allItems: DriveItem[]) {
  let parentId = item.parentId;
  while (parentId) {
    if (parentId === folder.id) return true;
    parentId = allItems.find((entry) => entry.id === parentId)?.parentId ?? null;
  }
  return false;
}

function relativePath(item: DriveItem, root: DriveItem, allItems: DriveItem[]) {
  const segments = [safeArchiveName(item.name)];
  let parentId = item.parentId;
  while (parentId && parentId !== root.id) {
    const parent = allItems.find((entry) => entry.id === parentId);
    if (!parent) break;
    segments.unshift(safeArchiveName(parent.name));
    parentId = parent.parentId;
  }
  return [safeArchiveName(root.name), ...segments].join("/");
}

async function addItemEntries(item: DriveItem, allItems: DriveItem[], entries: ZipEntry[], repository: ReturnType<typeof getDriveRepository>) {
  if (item.kind === "file") {
    entries.push({ path: safeArchiveName(item.name), data: (await repository.getFileBytes(item.id)) ?? fallbackContent(item) });
    return;
  }

  entries.push({ path: `${safeArchiveName(item.name)}/`, data: new Uint8Array() });
  const descendants = allItems.filter((entry) => !entry.isDeleted && isDescendant(entry, item, allItems));
  for (const child of descendants.filter((entry) => entry.kind === "folder")) {
    entries.push({ path: `${relativePath(child, item, allItems)}/`, data: new Uint8Array() });
  }
  for (const child of descendants.filter((entry) => entry.kind === "file")) {
    entries.push({ path: relativePath(child, item, allItems), data: (await repository.getFileBytes(child.id)) ?? fallbackContent(child) });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown): id is string => typeof id === "string") : [];
    if (ids.length === 0) return badRequest("Inga objekt valda");

    const repository = getDriveRepository();
    const allItems = await repository.listAllItems();
    const entries: ZipEntry[] = [];
    for (const id of ids) {
      const item = allItems.find((entry) => entry.id === id);
      if (item) await addItemEntries(item, allItems, entries, repository);
    }

    const archive = createZip(entries.length ? entries : [{ path: "README.txt", data: new TextEncoder().encode("Inga objekt hittades.\n") }]);
    return new Response(archive, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": contentDisposition("drive-selection.zip"),
        "Content-Length": String(archive.length),
      },
    });
  } catch (error) {
    return serverError(error);
  }
}
