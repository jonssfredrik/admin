import type { DriveItem } from "@/modules/drive/types";
import { getDriveRepository, notFound, serverError } from "../../../_lib";

interface RouteContext {
  params: Promise<{ id: string }>;
}

interface ZipEntry {
  path: string;
  data: Uint8Array;
}

const crcTable = new Uint32Array(256);

for (let i = 0; i < 256; i++) {
  let value = i;
  for (let bit = 0; bit < 8; bit++) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  crcTable[i] = value >>> 0;
}

function crc32(data: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of data) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUInt16(value: number) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value);
  return buffer;
}

function writeUInt32(value: number) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value >>> 0);
  return buffer;
}

function dosDateTime(date = new Date()) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = Math.max(1980, date.getFullYear()) - 1980;
  return {
    date: (year << 9) | (month << 5) | day,
    time,
  };
}

function zip(entries: ZipEntry[]) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;
  const stamp = dosDateTime();

  for (const entry of entries) {
    const name = Buffer.from(entry.path, "utf8");
    const data = Buffer.from(entry.data);
    const crc = crc32(data);
    const localHeader = Buffer.concat([
      writeUInt32(0x04034b50),
      writeUInt16(20),
      writeUInt16(0x0800),
      writeUInt16(0),
      writeUInt16(stamp.time),
      writeUInt16(stamp.date),
      writeUInt32(crc),
      writeUInt32(data.length),
      writeUInt32(data.length),
      writeUInt16(name.length),
      writeUInt16(0),
      name,
    ]);
    const centralHeader = Buffer.concat([
      writeUInt32(0x02014b50),
      writeUInt16(20),
      writeUInt16(20),
      writeUInt16(0x0800),
      writeUInt16(0),
      writeUInt16(stamp.time),
      writeUInt16(stamp.date),
      writeUInt32(crc),
      writeUInt32(data.length),
      writeUInt32(data.length),
      writeUInt16(name.length),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt32(entry.path.endsWith("/") ? 0x10 : 0),
      writeUInt32(offset),
      name,
    ]);

    localParts.push(localHeader, data);
    centralParts.push(centralHeader);
    offset += localHeader.length + data.length;
  }

  const central = Buffer.concat(centralParts);
  const end = Buffer.concat([
    writeUInt32(0x06054b50),
    writeUInt16(0),
    writeUInt16(0),
    writeUInt16(entries.length),
    writeUInt16(entries.length),
    writeUInt32(central.length),
    writeUInt32(offset),
    writeUInt16(0),
  ]);

  return Buffer.concat([...localParts, central, end]);
}

function safeName(name: string) {
  return name.replace(/[\\/]+/g, "-").trim() || "drive-item";
}

function asciiName(name: string) {
  return safeName(name).replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "'");
}

function contentDisposition(filename: string) {
  return `attachment; filename="${asciiName(filename)}"; filename*=UTF-8''${encodeURIComponent(safeName(filename))}`;
}

function fileContent(item: DriveItem) {
  const content =
    item.preview.content ??
    [
      item.name,
      "",
      "Mockad Drive-nedladdning.",
      `Typ: ${item.preview.type}`,
      `Storlek: ${item.sizeBytes} bytes`,
      `Ägare: ${item.owner.name}`,
      `Uppdaterad: ${item.updatedAt}`,
    ].join("\n");
  return new TextEncoder().encode(content);
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
  const segments = [safeName(item.name)];
  let parentId = item.parentId;
  while (parentId && parentId !== root.id) {
    const parent = allItems.find((entry) => entry.id === parentId);
    if (!parent) break;
    segments.unshift(safeName(parent.name));
    parentId = parent.parentId;
  }
  return [safeName(root.name), ...segments].join("/");
}

async function folderEntries(folder: DriveItem, allItems: DriveItem[], repository: ReturnType<typeof getDriveRepository>) {
  const descendants = allItems.filter((item) => !item.isDeleted && isDescendant(item, folder, allItems));
  const folders = descendants.filter((item) => item.kind === "folder");
  const files = descendants.filter((item) => item.kind === "file");
  const entries: ZipEntry[] = [{ path: `${safeName(folder.name)}/`, data: new Uint8Array() }];

  for (const child of folders) {
    entries.push({ path: `${relativePath(child, folder, allItems)}/`, data: new Uint8Array() });
  }

  for (const child of files) {
    entries.push({ path: relativePath(child, folder, allItems), data: (await repository.getFileBytes(child.id)) ?? fileContent(child) });
  }

  if (entries.length === 1) {
    entries.push({
      path: `${safeName(folder.name)}/README.txt`,
      data: new TextEncoder().encode("Mappen är tom i den mockade Drive-lagringen.\n"),
    });
  }

  return entries;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const repository = getDriveRepository();
    const item = await repository.getItem(id);
    if (!item) return notFound();

    if (item.kind === "folder") {
      const allItems = await repository.listAllItems();
      const archive = zip(await folderEntries(item, allItems, repository));
      return new Response(archive, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": contentDisposition(`${item.name}.zip`),
          "Content-Length": String(archive.length),
        },
      });
    }

    const data = (await repository.getFileBytes(item.id)) ?? fileContent(item);
    return new Response(Buffer.from(data), {
      headers: {
        "Content-Type": item.mimeType || "application/octet-stream",
        "Content-Disposition": contentDisposition(item.name),
        "Content-Length": String(data.byteLength),
      },
    });
  } catch (error) {
    return serverError(error);
  }
}
