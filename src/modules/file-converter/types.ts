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
}

export interface QueueItem {
  id: string;
  batchId: string;
  fileName: string;
  size: number;
  sourceFormat: FileFormat;
  toolId: string;
  status: "queued" | "running" | "completed";
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
}
