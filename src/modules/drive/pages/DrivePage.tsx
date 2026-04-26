"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  Archive,
  CheckSquare,
  Clock3,
  Code2,
  Copy,
  Download,
  Eye,
  File,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Grid2X2,
  Image as ImageIcon,
  List,
  Move,
  RotateCcw,
  Search,
  Star,
  Trash2,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Label } from "@/components/ui/Input";
import { RowMenu, type RowMenuEntry } from "@/components/ui/RowMenu";
import type { DriveFileType, DriveItem, DriveScope, DriveSortKey, DriveViewMode } from "@/modules/drive/types";

interface DrivePageProps {
  initialItems: DriveItem[];
}

type FilterType = "all" | "folder" | DriveFileType;

const tabs: Array<{ scope: DriveScope; label: string }> = [
  { scope: "recent", label: "Senaste" },
  { scope: "files", label: "Filer" },
  { scope: "trash", label: "Papperskorg" },
];

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

const typeLabels: Record<FilterType, string> = {
  all: "Alla typer",
  folder: "Mappar",
  image: "Bilder",
  pdf: "PDF",
  text: "Text",
  code: "Kod",
  video: "Video",
  archive: "Arkiv",
  document: "Dokument",
  other: "Övrigt",
};

const sortLabels: Record<DriveSortKey, string> = {
  name: "Namn",
  updated: "Senast ändrad",
  size: "Storlek",
  type: "Typ",
};

const fileIcons = {
  folder: Folder,
  image: ImageIcon,
  pdf: FileText,
  text: FileText,
  code: Code2,
  video: Video,
  archive: Archive,
  document: FileText,
  other: File,
} satisfies Record<"folder" | DriveFileType, typeof File>;

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function sortItems(items: DriveItem[], sort: DriveSortKey) {
  return [...items].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
    if (sort === "updated") return b.updatedAt.localeCompare(a.updatedAt);
    if (sort === "size") return b.sizeBytes - a.sizeBytes;
    if (sort === "type") return (a.extension ?? a.kind).localeCompare(b.extension ?? b.kind);
    return a.name.localeCompare(b.name, "sv");
  });
}

function itemType(item: DriveItem): FilterType {
  return item.kind === "folder" ? "folder" : item.preview.type;
}

function upsertItem(items: DriveItem[], item: DriveItem) {
  return items.some((entry) => entry.id === item.id)
    ? items.map((entry) => (entry.id === item.id ? item : entry))
    : [item, ...items];
}

export function DrivePage({ initialItems }: DrivePageProps) {
  const [items, setItems] = useState(initialItems);
  const [activeScope, setActiveScope] = useState<DriveScope>("recent");
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<DriveViewMode>("grid");
  const [sort, setSort] = useState<DriveSortKey>("updated");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewId, setPreviewId] = useState<string | null>(initialItems[0]?.id ?? null);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<DriveItem | null>(null);
  const [moveTarget, setMoveTarget] = useState<DriveItem | null>(null);
  const [folderName, setFolderName] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [moveParentId, setMoveParentId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadRows, setUploadRows] = useState<Array<{ name: string; progress: number; status: string }>>([]);
  const [dragActive, setDragActive] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const previewItem = items.find((item) => item.id === previewId) ?? null;

  const breadcrumbs = useMemo(() => {
    const chain: { id: string | null; label: string }[] = [{ id: null, label: "Drive" }];
    let cursor = currentParentId ? items.find((item) => item.id === currentParentId) : null;
    const stack: DriveItem[] = [];
    while (cursor) {
      stack.unshift(cursor);
      cursor = cursor.parentId ? items.find((item) => item.id === cursor?.parentId) : null;
    }
    return [...chain, ...stack.map((item) => ({ id: item.id, label: item.name }))];
  }, [currentParentId, items]);

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const scoped = items.filter((item) => {
      if (activeScope === "trash") return item.isDeleted;
      if (item.isDeleted) return false;
      if (activeScope === "recent") return true;
      return item.parentId === currentParentId;
    });

    return sortItems(
      scoped.filter((item) => {
        if (q && !item.name.toLowerCase().includes(q)) return false;
        if (typeFilter !== "all" && itemType(item) !== typeFilter) return false;
        return true;
      }),
      sort,
    );
  }, [activeScope, currentParentId, items, query, sort, typeFilter]);

  const selectedItems = visibleItems.filter((item) => selectedIds.includes(item.id));
  const folders = items.filter((item) => item.kind === "folder" && !item.isDeleted);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2400);
  }

  async function requestItem(path: string, init?: RequestInit) {
    const response = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Drive API misslyckades");
    return data.item as DriveItem;
  }

  async function requestMultipartItem(path: string, formData: FormData) {
    const response = await fetch(path, { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Drive API misslyckades");
    return data.item as DriveItem;
  }

  async function postItem(path: string, init?: RequestInit) {
    const response = await fetch(path, init);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Drive API misslyckades");
    return data.item as DriveItem;
  }

  function downloadItem(item: DriveItem) {
    const link = document.createElement("a");
    link.href = `/api/drive/items/${item.id}/download`;
    link.download = item.kind === "folder" ? `${item.name}.zip` : item.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function downloadBulk() {
    if (selectedItems.length === 0) return;
    const response = await fetch("/api/drive/downloads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedItems.map((item) => item.id) }),
    });
    if (!response.ok) throw new Error("Kunde inte skapa ZIP");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "drive-selection.zip";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showNotice(`${selectedItems.length} objekt paketerades som ZIP`);
  }

  function switchTab(scope: DriveScope) {
    setActiveScope(scope);
    setSelectedIds([]);
    setTypeFilter("all");
    if (scope !== "files") setCurrentParentId(null);
  }

  async function createFolder() {
    const name = folderName.trim();
    if (!name) return;
    const item = await requestItem("/api/drive/folders", {
      method: "POST",
      body: JSON.stringify({ name, parentId: activeScope === "files" ? currentParentId : null }),
    });
    setItems((value) => upsertItem(value, item));
    setFolderName("");
    setNewFolderOpen(false);
    showNotice("Mappen skapades");
  }

  async function uploadSelectedFiles(files: File[]) {
    if (!files.length) return;
    const validFiles = files.filter((file) => file.size <= MAX_UPLOAD_BYTES);
    const rejected = files.length - validFiles.length;
    if (rejected > 0) showNotice(`${rejected} fil${rejected === 1 ? "" : "er"} var större än 100 MB`);
    if (!validFiles.length) return;
    setUploadRows(validFiles.map((file) => ({ name: file.name, progress: 0, status: "Väntar" })));
    setUploadProgress(12);
    for (const file of validFiles) {
      setUploadRows((rows) => rows.map((row) => (row.name === file.name ? { ...row, progress: 35, status: "Laddar upp" } : row)));
      const formData = new FormData();
      formData.set("file", file);
      if (activeScope === "files" && currentParentId) formData.set("parentId", currentParentId);
      const item = await requestMultipartItem("/api/drive/uploads", formData);
      setItems((value) => upsertItem(value, item));
      setPreviewId(item.id);
      setUploadRows((rows) => rows.map((row) => (row.name === file.name ? { ...row, progress: 100, status: item.name !== file.name ? `Sparad som ${item.name}` : "Klar" } : row)));
      setUploadProgress((value) => Math.min(92, value + Math.round(80 / validFiles.length)));
    }
    setUploadProgress(100);
    showNotice(`${validFiles.length} fil${validFiles.length === 1 ? "" : "er"} lades till`);
    window.setTimeout(() => {
      setUploadOpen(false);
      setUploadProgress(0);
      setUploadRows([]);
    }, 500);
  }

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    await uploadSelectedFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  async function renameItem() {
    if (!renameTarget) return;
    const name = renameValue.trim();
    if (!name) return;
    const item = await requestItem(`/api/drive/items/${renameTarget.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
    setItems((value) => upsertItem(value, item));
    setRenameTarget(null);
    showNotice("Namnet uppdaterades");
  }

  async function patchItem(id: string, action: "toggleFavorite" | "delete" | "restore") {
    const routes = {
      toggleFavorite: { path: `/api/drive/items/${id}`, init: { method: "PATCH", body: JSON.stringify({ action: "toggleFavorite" }) } },
      delete: { path: `/api/drive/items/${id}`, init: { method: "DELETE" } },
      restore: { path: `/api/drive/items/${id}/restore`, init: { method: "POST" } },
    } satisfies Record<string, { path: string; init: RequestInit }>;

    const item = await requestItem(routes[action].path, routes[action].init);
    setItems((value) => upsertItem(value, item));
    showNotice(
      action === "delete"
        ? "Flyttad till papperskorgen"
        : action === "restore"
          ? "Återställd"
          : "Favorit uppdaterad",
    );
  }

  async function duplicateItem(item: DriveItem) {
    const next = await postItem(`/api/drive/items/${item.id}/duplicate`, { method: "POST" });
    setItems((value) => upsertItem(value, next));
    setPreviewId(next.id);
    showNotice("Objektet duplicerades");
  }

  async function moveItem() {
    if (!moveTarget) return;
    const next = await requestItem(`/api/drive/items/${moveTarget.id}`, {
      method: "PATCH",
      body: JSON.stringify({ parentId: moveParentId }),
    });
    setItems((value) => upsertItem(value, next));
    setMoveTarget(null);
    showNotice("Objektet flyttades");
  }

  async function permanentDeleteItem(item: DriveItem) {
    await fetch(`/api/drive/items/${item.id}?permanent=1`, { method: "DELETE" });
    setItems((value) => value.filter((entry) => entry.id !== item.id && entry.parentId !== item.id));
    if (previewId === item.id) setPreviewId(null);
    showNotice("Objektet raderades permanent");
  }

  async function bulkDeleteOrRestore() {
    const action = activeScope === "trash" ? "restore" : "delete";
    for (const item of selectedItems) await patchItem(item.id, action);
    setSelectedIds([]);
  }

  async function bulkPermanentDelete() {
    for (const item of selectedItems) await permanentDeleteItem(item);
    setSelectedIds([]);
  }

  function openRename(item: DriveItem) {
    setRenameTarget(item);
    setRenameValue(item.name);
  }

  function openMove(item: DriveItem) {
    setMoveTarget(item);
    setMoveParentId(item.parentId);
  }

  function openFolder(item: DriveItem) {
    if (item.kind !== "folder") return;
    setActiveScope("files");
    setCurrentParentId(item.id);
    setPreviewId(null);
    setSelectedIds([]);
  }

  function menuItems(item: DriveItem): RowMenuEntry[] {
    return [
      { label: "Preview", icon: Eye, onClick: () => setPreviewId(item.id) },
      { label: item.kind === "folder" ? "Ladda ned som ZIP" : "Ladda ned", icon: Download, onClick: () => downloadItem(item) },
      { label: "Duplicera", icon: Copy, onClick: () => duplicateItem(item) },
      { label: "Flytta", icon: Move, onClick: () => openMove(item) },
      { label: "Byt namn", icon: FileText, onClick: () => openRename(item) },
      { label: item.isFavorite ? "Ta bort favorit" : "Favoritmarkera", icon: Star, onClick: () => patchItem(item.id, "toggleFavorite") },
      { divider: true },
      ...(item.isDeleted
        ? [
            { label: "Återställ", icon: RotateCcw, onClick: () => patchItem(item.id, "restore") },
            { label: "Radera permanent", icon: Trash2, danger: true, onClick: () => permanentDeleteItem(item) },
          ]
        : [{ label: "Flytta till papperskorg", icon: Trash2, danger: true, onClick: () => patchItem(item.id, "delete") }]),
    ];
  }

  function renderIcon(item: DriveItem, size = 22) {
    const Icon = fileIcons[item.kind === "folder" ? "folder" : item.preview.type];
    return <Icon size={size} strokeWidth={1.8} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="Drive" />
        <div className="flex items-center gap-2">
          {activeScope !== "trash" && (
            <>
              <Button variant="secondary" onClick={() => setNewFolderOpen(true)} className="gap-2">
                <FolderPlus size={16} /> Ny mapp
              </Button>
              <Button onClick={() => setUploadOpen(true)} className="gap-2">
                <UploadCloud size={16} /> Ladda upp
              </Button>
            </>
          )}
        </div>
      </div>

      {notice && (
        <div className="fixed right-5 top-5 z-40 rounded-lg border bg-surface px-4 py-2 text-sm shadow-pop">
          {notice}
        </div>
      )}

      <Card className="p-0">
        <div className="grid min-h-[650px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0 border-b p-4 xl:border-b-0 xl:border-r">
            <div className="mb-4 space-y-3 border-b pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.scope}
                      onClick={() => switchTab(tab.scope)}
                      className={clsx(
                        "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                        activeScope === tab.scope ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeScope === "files" && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {breadcrumbs.map((crumb, index) => (
                      <button
                        key={`${crumb.id ?? "root"}-${index}`}
                        onClick={() => setCurrentParentId(crumb.id)}
                        className="rounded-md px-2 py-1 text-sm text-muted hover:bg-bg hover:text-fg"
                      >
                        {crumb.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <div className="relative min-w-56 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-2.5 text-muted" size={15} />
                  <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Sök i Drive" className="pl-9" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <FolderOpen size={16} />
                  <span>{visibleItems.length} objekt</span>
                  {selectedIds.length > 0 && <span>{selectedIds.length} valda</span>}
                </div>
                {selectedIds.length > 0 && (
                  <>
                    <Button variant="secondary" onClick={downloadBulk} className="gap-2">
                      <Download size={15} /> Ladda ned
                    </Button>
                    <Button variant="secondary" onClick={bulkDeleteOrRestore} className="gap-2">
                      {activeScope === "trash" ? <RotateCcw size={15} /> : <Trash2 size={15} />}
                      {activeScope === "trash" ? "Återställ" : "Radera"}
                    </Button>
                    {activeScope === "trash" && (
                      <Button variant="secondary" onClick={bulkPermanentDelete} className="gap-2">
                        <Trash2 size={15} /> Permanent
                      </Button>
                    )}
                  </>
                )}
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as DriveSortKey)}
                  aria-label="Sortera"
                  className="h-9 rounded-lg border bg-surface px-3 text-sm outline-none focus:border-fg/30"
                >
                  {(Object.keys(sortLabels) as DriveSortKey[]).map((key) => (
                    <option key={key} value={key}>
                      {sortLabels[key]}
                    </option>
                  ))}
                </select>
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value as FilterType)}
                  aria-label="Filtrera på typ"
                  className="h-9 rounded-lg border bg-surface px-3 text-sm outline-none focus:border-fg/30"
                >
                  {(Object.keys(typeLabels) as FilterType[]).map((type) => (
                    <option key={type} value={type}>
                      {typeLabels[type]}
                    </option>
                  ))}
                </select>
                <Button variant={view === "grid" ? "primary" : "ghost"} onClick={() => setView("grid")} aria-label="Rutnät">
                  <Grid2X2 size={16} />
                </Button>
                <Button variant={view === "list" ? "primary" : "ghost"} onClick={() => setView("list")} aria-label="Lista">
                  <List size={16} />
                </Button>
              </div>
            </div>

            {visibleItems.length === 0 ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed text-center">
                <FolderOpen className="text-muted" size={38} />
                <div className="mt-3 font-medium">Inga objekt hittades</div>
                <div className="mt-1 text-sm text-muted">Justera filter eller skapa nytt innehåll.</div>
              </div>
            ) : view === "grid" ? (
              <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                {visibleItems.map((item) => (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onDoubleClick={() => openFolder(item)}
                    onClick={() => setPreviewId(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") setPreviewId(item.id);
                    }}
                    className={clsx(
                      "group min-h-40 cursor-pointer rounded-xl border p-3 text-left transition-colors hover:bg-bg",
                      previewItem?.id === item.id && "border-fg/40 bg-bg",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg text-white" style={{ backgroundColor: item.preview.accent }}>
                        {renderIcon(item)}
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onClick={(event) => event.stopPropagation()}
                          onChange={(event) =>
                            setSelectedIds((value) => (event.target.checked ? [...value, item.id] : value.filter((id) => id !== item.id)))
                          }
                          aria-label={`Välj ${item.name}`}
                        />
                        <RowMenu items={menuItems(item)} />
                      </div>
                    </div>
                    <div className="mt-4 truncate font-medium">{item.name}</div>
                    <div className="mt-1 text-sm text-muted">{item.kind === "folder" ? "Mapp" : formatBytes(item.sizeBytes)}</div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                      {item.isFavorite && <Star size={13} className="fill-current" />}
                      <span className="truncate">{formatDate(item.updatedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                {visibleItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-[32px_minmax(0,1fr)_120px_150px_40px] items-center gap-3 border-b px-3 py-2.5 last:border-b-0">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={(event) => setSelectedIds((value) => (event.target.checked ? [...value, item.id] : value.filter((id) => id !== item.id)))}
                      aria-label={`Välj ${item.name}`}
                    />
                    <button onClick={() => setPreviewId(item.id)} onDoubleClick={() => openFolder(item)} className="flex min-w-0 items-center gap-3 text-left">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: item.preview.accent }}>
                        {renderIcon(item, 18)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{item.name}</span>
                        <span className="block truncate text-xs text-muted">{item.owner.name}</span>
                      </span>
                    </button>
                    <div className="text-sm text-muted">{item.kind === "folder" ? "Mapp" : formatBytes(item.sizeBytes)}</div>
                    <div className="truncate text-sm text-muted">{formatDate(item.updatedAt)}</div>
                    <RowMenu items={menuItems(item)} />
                  </div>
                ))}
              </div>
            )}
          </main>

          <aside className="p-4">
            {previewItem ? (
              <PreviewPanel item={previewItem} onClose={() => setPreviewId(null)} onDownload={downloadItem} />
            ) : (
              <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed text-center text-muted">
                <Eye size={32} />
                <div className="mt-2 text-sm">Välj en fil för preview</div>
              </div>
            )}
          </aside>
        </div>
      </Card>

      <Dialog
        open={newFolderOpen}
        onClose={() => setNewFolderOpen(false)}
        title="Ny mapp"
        description="Skapas i den aktuella platsen och sparas via Drive API."
        footer={
          <>
            <Button variant="ghost" onClick={() => setNewFolderOpen(false)}>Avbryt</Button>
            <Button onClick={createFolder}>Skapa</Button>
          </>
        }
      >
        <Label htmlFor="drive-folder-name">Mappnamn</Label>
        <Input id="drive-folder-name" value={folderName} onChange={(event) => setFolderName(event.target.value)} autoFocus />
      </Dialog>

      <Dialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Ladda upp filer"
        description="Dra in filer eller välj från datorn. Max 100 MB per fil."
      >
        <label
          onDragEnter={(event: DragEvent<HTMLLabelElement>) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            uploadSelectedFiles(Array.from(event.dataTransfer.files));
          }}
          className={clsx(
            "flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center hover:bg-bg",
            dragActive && "border-fg bg-bg",
          )}
        >
          <UploadCloud className="text-muted" size={34} />
          <span className="mt-3 font-medium">Släpp filer här</span>
          <span className="mt-1 text-sm text-muted">Flera filer stöds. Namnkrockar får automatiskt suffix.</span>
          <input className="sr-only" type="file" multiple onChange={uploadFiles} />
        </label>
        {uploadProgress > 0 && (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-bg">
            <div className="h-full rounded-full bg-fg transition-all" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}
        {uploadRows.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadRows.map((row) => (
              <div key={row.name} className="rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate font-medium">{row.name}</span>
                  <span className="shrink-0 text-xs text-muted">{row.status}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg">
                  <div className="h-full rounded-full bg-fg transition-all" style={{ width: `${row.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Dialog>

      <Dialog
        open={Boolean(renameTarget)}
        onClose={() => setRenameTarget(null)}
        title="Byt namn"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRenameTarget(null)}>Avbryt</Button>
            <Button onClick={renameItem}>Spara</Button>
          </>
        }
      >
        <Label htmlFor="drive-rename">Namn</Label>
        <Input id="drive-rename" value={renameValue} onChange={(event) => setRenameValue(event.target.value)} autoFocus />
      </Dialog>

      <Dialog
        open={Boolean(moveTarget)}
        onClose={() => setMoveTarget(null)}
        title="Flytta objekt"
        footer={
          <>
            <Button variant="ghost" onClick={() => setMoveTarget(null)}>Avbryt</Button>
            <Button onClick={moveItem}>Flytta</Button>
          </>
        }
      >
        <Label>Destination</Label>
        <select
          value={moveParentId ?? "__root"}
          onChange={(event) => setMoveParentId(event.target.value === "__root" ? null : event.target.value)}
          className="h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none focus:border-fg/30"
        >
          <option value="__root">Drive</option>
          {folders
            .filter((folder) => folder.id !== moveTarget?.id)
            .map((folder) => (
              <option key={folder.id} value={folder.id}>
                {[...folder.path.slice(1), folder.name].join(" / ")}
              </option>
            ))}
        </select>
      </Dialog>
    </div>
  );
}

function PreviewPanel({ item, onClose, onDownload }: { item: DriveItem; onClose: () => void; onDownload: (item: DriveItem) => void }) {
  const [textPreview, setTextPreview] = useState<string | null>(null);

  useEffect(() => {
    setTextPreview(null);
    if (item.kind !== "file" || (item.preview.type !== "text" && item.preview.type !== "code")) return;
    fetch(`/api/drive/items/${item.id}/preview`)
      .then((response) => response.text())
      .then(setTextPreview)
      .catch(() => setTextPreview(item.preview.content ?? ""));
  }, [item]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold">{item.name}</div>
          <div className="mt-1 text-sm text-muted">{item.kind === "folder" ? "Mapp" : `${item.extension?.toUpperCase() ?? "Fil"} · ${formatBytes(item.sizeBytes)}`}</div>
        </div>
        <button onClick={onClose} className="rounded-md p-1.5 text-muted hover:bg-bg hover:text-fg" aria-label="Stäng preview">
          <X size={16} />
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-bg/50">
        {item.kind === "file" && item.preview.type === "image" ? (
          <img src={`/api/drive/items/${item.id}/preview`} alt="" className="aspect-[4/3] w-full object-cover" />
        ) : item.preview.type === "text" || item.preview.type === "code" ? (
          <pre className="max-h-80 overflow-auto p-4 text-xs leading-6">
            <code>{textPreview ?? item.preview.content ?? "Laddar preview..."}</code>
          </pre>
        ) : item.preview.type === "pdf" ? (
          <div className="p-5">
            <div className="rounded-lg bg-surface p-5 shadow-soft">
              <div className="mb-4 h-2 w-24 rounded-full bg-red-500" />
              <iframe src={`/api/drive/items/${item.id}/preview`} className="h-80 w-full rounded-md border" title={item.name} />
            </div>
          </div>
        ) : (
          <div className="flex aspect-[4/3] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: item.preview.accent }}>
              {item.preview.type === "video" ? <Video size={30} /> : item.preview.type === "archive" ? <Archive size={30} /> : <File size={30} />}
            </div>
            <div className="mt-3 text-sm font-medium">Preview-metadata redo</div>
            <div className="mt-1 text-xs text-muted">Full renderare kopplas per filtyp.</div>
          </div>
        )}
      </div>

      <div className="grid gap-3 text-sm">
        <div className="rounded-lg border p-3">
          <div className="text-xs text-muted">Ägare</div>
          <div className="mt-1 font-medium">{item.owner.name}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1 gap-2" onClick={() => onDownload(item)}>
          <Download size={15} /> Ladda ned
        </Button>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
          <Clock3 size={15} /> Aktivitet
        </div>
        <div className="space-y-2">
          {item.activity.map((entry) => (
            <div key={entry.id} className="rounded-lg border p-3 text-sm">
              <div>
                <span className="font-medium">{entry.actor}</span> {entry.action}
              </div>
              <div className="mt-1 text-xs text-muted">{formatDate(entry.createdAt)}</div>
            </div>
          ))}
        </div>
      </div>

      {item.isDeleted && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
          <CheckSquare size={15} /> Objektet ligger i papperskorgen.
        </div>
      )}
    </div>
  );
}
