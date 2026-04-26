import type { DriveActivity as PrismaDriveActivity, DriveItem as PrismaDriveItem } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { driveItems, driveOwners } from "@/modules/drive/data";
import { createStorageKey, exists, putBytes, readBytes, removeBytes } from "@/modules/drive/server/storage";
import type {
  CreateFolderInput,
  CreateUploadInput,
  DriveFileType,
  DriveItem,
  DriveListQuery,
  DriveScope,
  DriveSortKey,
  MoveDriveItemInput,
  RenameDriveItemInput,
} from "@/modules/drive/types";

function now() {
  return new Date();
}

function slug(value: string) {
  return value.toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
}

function extensionFor(name: string) {
  const match = name.match(/\.([a-z0-9]+)$/i);
  return match?.[1]?.toLowerCase();
}

function typeFor(mimeType = "", extension = ""): DriveFileType {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf" || extension === "pdf") return "pdf";
  if (mimeType.startsWith("video/")) return "video";
  if (["zip", "rar", "7z"].includes(extension)) return "archive";
  if (["ts", "tsx", "js", "jsx", "css", "json"].includes(extension)) return "code";
  if (mimeType.startsWith("text/") || ["txt", "md", "csv"].includes(extension)) return "text";
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)) return "document";
  return "other";
}

function parsePath(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : ["Drive"];
  } catch {
    return ["Drive"];
  }
}

function sortItems(items: DriveItem[], sort: DriveSortKey = "name") {
  return [...items].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
    if (sort === "updated") return b.updatedAt.localeCompare(a.updatedAt);
    if (sort === "size") return b.sizeBytes - a.sizeBytes;
    if (sort === "type") return (a.extension ?? a.kind).localeCompare(b.extension ?? b.kind);
    return a.name.localeCompare(b.name, "sv");
  });
}

function filterScope(item: DriveItem, scope: DriveScope, parentId: string | null) {
  if (scope === "trash") return item.isDeleted;
  if (item.isDeleted) return false;
  if (scope === "recent") return true;
  return item.parentId === parentId;
}

function mapActivity(row: PrismaDriveActivity) {
  return {
    id: row.id,
    actor: row.actor,
    action: row.action,
    createdAt: row.createdAt.toISOString(),
  };
}

function mapItem(row: PrismaDriveItem & { activities?: PrismaDriveActivity[] }): DriveItem {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind === "folder" ? "folder" : "file",
    mimeType: row.mimeType ?? undefined,
    extension: row.extension ?? undefined,
    sizeBytes: row.sizeBytes,
    parentId: row.parentId,
    path: parsePath(row.pathJson),
    owner: {
      id: row.ownerId,
      name: row.ownerName,
      initials: row.ownerInitials,
    },
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    isFavorite: row.isFavorite,
    isDeleted: row.isDeleted,
    preview: {
      type: row.previewType as DriveFileType,
      url: row.previewUrl ?? undefined,
      content: row.previewContent ?? undefined,
      language: row.previewLanguage ?? undefined,
      accent: row.previewAccent,
    },
    activity: (row.activities ?? []).map(mapActivity),
  };
}

function contentForSeed(item: DriveItem) {
  return new TextEncoder().encode(
    item.preview.content ??
      [
        item.name,
        "",
        "Seedad Drive-fil i lokal serverlagring.",
        `Typ: ${item.preview.type}`,
        `Storlek: ${item.sizeBytes} bytes`,
      ].join("\n"),
  );
}

function contentForUpload(name: string, type: DriveFileType) {
  if (type === "text" || type === "code") return `${name}\n\nUppladdad via Drive.`;
  return undefined;
}

export interface DriveRepository {
  listItems(query?: DriveListQuery): Promise<DriveItem[]>;
  listAllItems(): Promise<DriveItem[]>;
  getItem(id: string): Promise<DriveItem | null>;
  getFileBytes(id: string): Promise<Uint8Array | null>;
  createFolder(input: CreateFolderInput): Promise<DriveItem>;
  createUpload(input: CreateUploadInput & { bytes?: Uint8Array }): Promise<DriveItem>;
  renameItem(id: string, input: RenameDriveItemInput): Promise<DriveItem>;
  moveItem(id: string, input: MoveDriveItemInput): Promise<DriveItem>;
  duplicateItem(id: string): Promise<DriveItem>;
  deleteItem(id: string): Promise<DriveItem>;
  permanentDeleteItem(id: string): Promise<void>;
  restoreItem(id: string): Promise<DriveItem>;
  toggleFavorite(id: string): Promise<DriveItem>;
}

class PrismaDriveRepository implements DriveRepository {
  private seeded = false;

  async listAllItems() {
    await this.ensureSeeded();
    const rows = await prisma.driveItem.findMany({ include: { activities: { orderBy: { createdAt: "desc" } } } });
    return rows.map(mapItem);
  }

  async listItems(query: DriveListQuery = {}) {
    const scope = query.scope ?? "files";
    const parentId = query.parentId ?? null;
    const q = query.q?.trim().toLowerCase() ?? "";
    const type = query.type ?? "all";
    const items = await this.listAllItems();
    const scoped = items.filter((item) => filterScope(item, scope, parentId));
    const filtered = scoped.filter((item) => {
      if (q && !item.name.toLowerCase().includes(q)) return false;
      if (type === "folder") return item.kind === "folder";
      if (type !== "all" && item.preview.type !== type) return false;
      return true;
    });
    return sortItems(filtered, query.sort);
  }

  async getItem(id: string) {
    await this.ensureSeeded();
    const row = await prisma.driveItem.findUnique({
      where: { id },
      include: { activities: { orderBy: { createdAt: "desc" } } },
    });
    return row ? mapItem(row) : null;
  }

  async getFileBytes(id: string) {
    await this.ensureSeeded();
    const row = await prisma.driveItem.findUnique({ where: { id } });
    if (!row?.storageKey || row.kind !== "file") return null;
    return readBytes(row.storageKey);
  }

  async createFolder(input: CreateFolderInput) {
    await this.ensureSeeded();
    const name = input.name.trim();
    if (!name) throw new Error("Mappnamn saknas");
    const createdAt = now();
    const item = await prisma.driveItem.create({
      data: {
        id: `folder-${slug(name)}-${Date.now()}`,
        name: await this.availableName(name, input.parentId ?? null),
        kind: "folder",
        parentId: input.parentId ?? null,
        pathJson: JSON.stringify(await this.parentPath(input.parentId)),
        ownerId: driveOwners[0].id,
        ownerName: driveOwners[0].name,
        ownerInitials: driveOwners[0].initials,
        previewType: "other",
        previewAccent: "#0ea5e9",
        createdAt,
        updatedAt: createdAt,
        activities: {
          create: {
            id: `activity-${Date.now()}`,
            actor: "Fredrik",
            action: "skapade mappen",
            createdAt,
          },
        },
      },
      include: { activities: true },
    });
    return mapItem(item);
  }

  async createUpload(input: CreateUploadInput & { bytes?: Uint8Array }) {
    await this.ensureSeeded();
    const name = input.name.trim();
    if (!name) throw new Error("Filnamn saknas");
    const extension = extensionFor(name);
    const type = typeFor(input.mimeType, extension);
    const availableName = await this.availableName(name, input.parentId ?? null);
    const id = `file-${slug(availableName)}-${Date.now()}`;
    const storageKey = createStorageKey(id, availableName);
    const bytes = input.bytes ?? new TextEncoder().encode(contentForUpload(name, type) ?? `${name}\n`);
    await putBytes(storageKey, bytes);
    const createdAt = now();
    const item = await prisma.driveItem.create({
      data: {
        id,
        name: availableName,
        kind: "file",
        mimeType: input.mimeType,
        extension,
        sizeBytes: input.sizeBytes || bytes.byteLength,
        parentId: input.parentId ?? null,
        pathJson: JSON.stringify(await this.parentPath(input.parentId)),
        ownerId: driveOwners[0].id,
        ownerName: driveOwners[0].name,
        ownerInitials: driveOwners[0].initials,
        storageKey,
        previewType: type,
        previewAccent: type === "image" ? "#8b5cf6" : type === "pdf" ? "#ef4444" : "#14b8a6",
        previewContent: contentForUpload(availableName, type),
        createdAt,
        updatedAt: createdAt,
        activities: {
          create: {
            id: `activity-${Date.now()}`,
            actor: "Fredrik",
            action: "laddade upp filen",
            createdAt,
          },
        },
      },
      include: { activities: true },
    });
    return mapItem(item);
  }

  async renameItem(id: string, input: RenameDriveItemInput) {
    await this.ensureSeeded();
    const current = await prisma.driveItem.findUnique({ where: { id } });
    if (!current) throw new Error("Drive-objekt hittades inte");
    const row = await prisma.driveItem.update({
      where: { id },
      data: { name: await this.availableName(input.name.trim(), current.parentId, id) },
      include: { activities: { orderBy: { createdAt: "desc" } } },
    });
    return mapItem(row);
  }

  async moveItem(id: string, input: MoveDriveItemInput) {
    await this.ensureSeeded();
    const row = await prisma.driveItem.update({
      where: { id },
      data: {
        parentId: input.parentId,
        pathJson: JSON.stringify(await this.parentPath(input.parentId)),
      },
      include: { activities: { orderBy: { createdAt: "desc" } } },
    });
    return mapItem(row);
  }

  async deleteItem(id: string) {
    return this.patch(id, { isDeleted: true });
  }

  async permanentDeleteItem(id: string) {
    await this.ensureSeeded();
    const all = await prisma.driveItem.findMany();
    const target = all.find((item) => item.id === id);
    if (!target) return;
    const ids = [id, ...all.filter((item) => isDescendantRow(item, target, all)).map((item) => item.id)];
    const storageKeys = all
      .filter((item) => ids.includes(item.id))
      .map((item) => item.storageKey)
      .filter((value): value is string => Boolean(value));
    await prisma.driveItem.deleteMany({ where: { id: { in: ids } } });
    await Promise.all(storageKeys.map((key) => removeBytes(key).catch(() => undefined)));
  }

  async duplicateItem(id: string) {
    await this.ensureSeeded();
    const item = await this.getRequired(id);
    return item.kind === "folder" ? this.duplicateFolder(item, item.parentId) : this.duplicateFile(item, item.parentId);
  }

  async restoreItem(id: string) {
    return this.patch(id, { isDeleted: false });
  }

  async toggleFavorite(id: string) {
    const item = await this.getRequired(id);
    return this.patch(id, { isFavorite: !item.isFavorite });
  }

  private async getRequired(id: string) {
    const item = await this.getItem(id);
    if (!item) throw new Error("Drive-objekt hittades inte");
    return item;
  }

  private async patch(id: string, data: Partial<PrismaDriveItem>) {
    await this.ensureSeeded();
    const row = await prisma.driveItem.update({
      where: { id },
      data,
      include: { activities: { orderBy: { createdAt: "desc" } } },
    });
    return mapItem(row);
  }

  private async parentPath(parentId: string | null | undefined) {
    if (!parentId) return ["Drive"];
    const parent = await prisma.driveItem.findUnique({ where: { id: parentId } });
    return parent ? [...parsePath(parent.pathJson), parent.name] : ["Drive"];
  }

  private async availableName(name: string, parentId: string | null, excludeId?: string) {
    const siblings = await prisma.driveItem.findMany({
      where: { parentId, isDeleted: false, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      select: { name: true },
    });
    const taken = new Set(siblings.map((item) => item.name.toLowerCase()));
    if (!taken.has(name.toLowerCase())) return name;
    const match = name.match(/^(.*?)(\.[^.]+)?$/);
    const base = match?.[1] || name;
    const ext = match?.[2] || "";
    let index = 2;
    let candidate = `${base} (${index})${ext}`;
    while (taken.has(candidate.toLowerCase())) {
      index += 1;
      candidate = `${base} (${index})${ext}`;
    }
    return candidate;
  }

  private async duplicateFile(item: DriveItem, parentId: string | null) {
    const bytes = (await this.getFileBytes(item.id)) ?? contentForSeed(item);
    return this.createUpload({
      name: copyName(item.name),
      mimeType: item.mimeType,
      sizeBytes: bytes.byteLength,
      parentId,
      bytes,
    });
  }

  private async duplicateFolder(folder: DriveItem, parentId: string | null) {
    const nextFolder = await this.createFolder({ name: copyName(folder.name), parentId });
    const children = (await this.listAllItems()).filter((item) => item.parentId === folder.id && !item.isDeleted);
    for (const child of children) {
      if (child.kind === "folder") await this.duplicateFolder(child, nextFolder.id);
      else await this.duplicateFile(child, nextFolder.id);
    }
    return nextFolder;
  }

  private async ensureSeeded() {
    if (this.seeded) return;
    const count = await prisma.driveItem.count();
    if (count > 0) {
      this.seeded = true;
      return;
    }

    for (const item of driveItems) {
      const storageKey = item.kind === "file" ? createStorageKey(item.id, item.name) : undefined;
      if (storageKey && !(await exists(storageKey))) {
        await putBytes(storageKey, contentForSeed(item));
      }

      await prisma.driveItem.create({
        data: {
          id: item.id,
          name: item.name,
          kind: item.kind,
          mimeType: item.mimeType,
          extension: item.extension,
          sizeBytes: item.sizeBytes,
          parentId: item.parentId,
          pathJson: JSON.stringify(item.path),
          ownerId: item.owner.id,
          ownerName: item.owner.name,
          ownerInitials: item.owner.initials,
          isFavorite: item.isFavorite,
          isDeleted: item.isDeleted,
          storageKey,
          previewType: item.preview.type,
          previewUrl: item.preview.url,
          previewContent: item.preview.content,
          previewLanguage: item.preview.language,
          previewAccent: item.preview.accent,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
          activities: {
            create: item.activity.map((activity) => ({
              id: activity.id,
              actor: activity.actor,
              action: activity.action,
              createdAt: new Date(activity.createdAt),
            })),
          },
        },
      });
    }
    this.seeded = true;
  }
}

function copyName(name: string) {
  const match = name.match(/^(.*?)(\.[^.]+)?$/);
  return `${match?.[1] || name} kopia${match?.[2] || ""}`;
}

function isDescendantRow(item: PrismaDriveItem, folder: PrismaDriveItem, allItems: PrismaDriveItem[]) {
  let parentId = item.parentId;
  while (parentId) {
    if (parentId === folder.id) return true;
    parentId = allItems.find((entry) => entry.id === parentId)?.parentId ?? null;
  }
  return false;
}

let repository: DriveRepository | null = null;

export function createDriveRepository(): DriveRepository {
  repository ??= new PrismaDriveRepository();
  return repository;
}
