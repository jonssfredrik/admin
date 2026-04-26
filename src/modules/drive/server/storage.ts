import { promises as fs } from "fs";
import path from "path";

const root = path.resolve(process.cwd(), process.env.DRIVE_STORAGE_DIR ?? ".data/drive/files");

function cleanSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-|-$/g, "") || "file";
}

function assertInsideRoot(filePath: string) {
  const resolved = path.resolve(filePath);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error("Ogiltig storage-sökväg");
  }
  return resolved;
}

export function createStorageKey(id: string, name: string) {
  return `${cleanSegment(id)}-${cleanSegment(name)}`;
}

export async function putBytes(key: string, bytes: Uint8Array) {
  const filePath = assertInsideRoot(path.join(root, key));
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, bytes);
  return key;
}

export async function readBytes(key: string) {
  return fs.readFile(assertInsideRoot(path.join(root, key)));
}

export async function removeBytes(key: string) {
  await fs.rm(assertInsideRoot(path.join(root, key)), { force: true });
}

export async function exists(key: string) {
  try {
    await fs.access(assertInsideRoot(path.join(root, key)));
    return true;
  } catch {
    return false;
  }
}
