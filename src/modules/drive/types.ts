export type DriveItemKind = "folder" | "file";
export type DriveViewMode = "grid" | "list";
export type DriveScope = "files" | "recent" | "trash";
export type DriveSortKey = "name" | "updated" | "size" | "type";
export type DriveFileType = "image" | "pdf" | "text" | "code" | "video" | "archive" | "document" | "other";

export interface DriveOwner {
  id: string;
  name: string;
  initials: string;
}

export interface DrivePreview {
  type: DriveFileType;
  url?: string;
  content?: string;
  language?: string;
  accent: string;
}

export interface DriveActivity {
  id: string;
  actor: string;
  action: string;
  createdAt: string;
}

export interface DriveItem {
  id: string;
  name: string;
  kind: DriveItemKind;
  mimeType?: string;
  extension?: string;
  sizeBytes: number;
  parentId: string | null;
  path: string[];
  owner: DriveOwner;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isDeleted: boolean;
  preview: DrivePreview;
  activity: DriveActivity[];
}

export interface DriveBreadcrumb {
  id: string | null;
  label: string;
}

export interface DriveListQuery {
  scope?: DriveScope;
  parentId?: string | null;
  q?: string;
  type?: "all" | DriveFileType | "folder";
  sort?: DriveSortKey;
}

export interface CreateFolderInput {
  name: string;
  parentId?: string | null;
}

export interface CreateUploadInput {
  name: string;
  mimeType?: string;
  sizeBytes: number;
  parentId?: string | null;
}

export interface RenameDriveItemInput {
  name: string;
}

export interface MoveDriveItemInput {
  parentId: string | null;
}
