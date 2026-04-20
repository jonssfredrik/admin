export type FileFormat = "jpg" | "png" | "webp" | "pdf" | "heic" | "svg" | "ico";

export interface ConversionToolDefinition {
  id: string;
  title: string;
  description: string;
  inputFormats: FileFormat[];
  outputFormat: FileFormat;
  category: "image" | "document" | "icon";
  speed: "fast" | "balanced" | "heavy";
  qualityHint: string;
  supportsBulk: boolean;
}

export interface StagedFile {
  id: string;
  name: string;
  size: number;
  extension: FileFormat | null;
  compatibleToolIds: string[];
  selectedToolId: string | null;
  queueItemId?: string;
}

export interface QueueItem {
  id: string;
  batchId: string;
  batchLabel?: string;
  batchConcurrency?: number;
  presetId?: string;
  presetName?: string;
  fileName: string;
  size: number;
  sourceFormat: FileFormat;
  toolId: string;
  status: "queued" | "running" | "paused" | "completed" | "canceled";
  progress: number;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  durationMs: number;
  resultName: string;
}

export interface ConversionPreset {
  id: string;
  name: string;
  description: string;
  toolIds: string[];
  concurrency: number;
  autoArchive: boolean;
  target: "web-assets" | "document-export" | "brand-delivery";
  favorite?: boolean;
}

export interface ConversionHistoryBatch {
  id: string;
  label: string;
  startedAt: string;
  totalFiles: number;
  completedFiles: number;
  runtimeLabel: string;
  status: "completed" | "running" | "partial";
  outputSummary: string;
  topToolIds: string[];
  presetId?: string;
  presetName?: string;
}

export interface ConversionHistoryItem {
  id: string;
  fileName: string;
  resultName: string;
  toolId: string;
  sourceFormat: FileFormat;
  status: "completed" | "running" | "queued" | "paused" | "canceled";
  progress: number;
  size: number;
  durationMs?: number;
  note?: string;
}
