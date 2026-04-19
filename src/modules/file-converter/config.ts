import type { ConversionToolDefinition, FileFormat } from "@/modules/file-converter/types";

export const conversionTools: ConversionToolDefinition[] = [
  {
    id: "jpg-to-webp",
    title: "JPG till WEBP",
    description: "Komprimerar foton till ett modernt webbformat med mindre filstorlek.",
    inputFormats: ["jpg"],
    outputFormat: "webp",
    category: "image",
    speed: "fast",
    qualityHint: "Perfekt för webbpublicering och lättare asset-paket.",
    supportsBulk: true,
  },
  {
    id: "png-to-webp",
    title: "PNG till WEBP",
    description: "Minskar storlek på PNG-grafik med bibehållen webbkompatibilitet.",
    inputFormats: ["png"],
    outputFormat: "webp",
    category: "image",
    speed: "fast",
    qualityHint: "Bra när transparent grafik ska optimeras för frontend.",
    supportsBulk: true,
  },
  {
    id: "webp-to-jpg",
    title: "WEBP till JPG",
    description: "Gör WEBP-material kompatibelt med system som kräver JPG.",
    inputFormats: ["webp"],
    outputFormat: "jpg",
    category: "image",
    speed: "balanced",
    qualityHint: "Bra för äldre flöden och export till enklare klienter.",
    supportsBulk: true,
  },
  {
    id: "webp-to-png",
    title: "WEBP till PNG",
    description: "Exporterar WEBP-bilder till PNG för redigering och transparensflöden.",
    inputFormats: ["webp"],
    outputFormat: "png",
    category: "image",
    speed: "balanced",
    qualityHint: "Bra när designers behöver ett mer universellt rasterformat.",
    supportsBulk: true,
  },
  {
    id: "jpg-to-png",
    title: "JPG till PNG",
    description: "Byter från komprimerat fotoformat till pixelstabil PNG-export.",
    inputFormats: ["jpg"],
    outputFormat: "png",
    category: "image",
    speed: "balanced",
    qualityHint: "Bra för markeringar, vidarebearbetning och arkivkopior.",
    supportsBulk: true,
  },
  {
    id: "png-to-jpg",
    title: "PNG till JPG",
    description: "Konverterar tunga PNG-filer till ett lättare fotoformat.",
    inputFormats: ["png"],
    outputFormat: "jpg",
    category: "image",
    speed: "fast",
    qualityHint: "Passar stora bildbatcher där små filstorlekar prioriteras.",
    supportsBulk: true,
  },
  {
    id: "jpg-to-pdf",
    title: "JPG till PDF",
    description: "Paketerar enskilda bilder som dokument för delning eller utskrift.",
    inputFormats: ["jpg"],
    outputFormat: "pdf",
    category: "document",
    speed: "balanced",
    qualityHint: "Bra för offerter, kvitton och enkel dokumentexport.",
    supportsBulk: true,
  },
  {
    id: "png-to-pdf",
    title: "PNG till PDF",
    description: "Gör grafiska bilagor enklare att skicka som dokument.",
    inputFormats: ["png"],
    outputFormat: "pdf",
    category: "document",
    speed: "balanced",
    qualityHint: "Bra för skärmdumpar, instruktioner och visuella bilagor.",
    supportsBulk: true,
  },
  {
    id: "pdf-to-jpg",
    title: "PDF till JPG",
    description: "Renderar PDF-sidor till JPG-bilder för delning i bildbaserade flöden.",
    inputFormats: ["pdf"],
    outputFormat: "jpg",
    category: "document",
    speed: "heavy",
    qualityHint: "Passar previews, social publicering och äldre integrationspunkter.",
    supportsBulk: true,
  },
  {
    id: "pdf-to-png",
    title: "PDF till PNG",
    description: "Renderar PDF till PNG när skärpa och textläsbarhet är viktig.",
    inputFormats: ["pdf"],
    outputFormat: "png",
    category: "document",
    speed: "heavy",
    qualityHint: "Bra för dashboards, utdrag och dokument-preview med högre skärpa.",
    supportsBulk: true,
  },
  {
    id: "heic-to-jpg",
    title: "HEIC till JPG",
    description: "Översätter mobilfoton till ett brett kompatibelt standardformat.",
    inputFormats: ["heic"],
    outputFormat: "jpg",
    category: "image",
    speed: "balanced",
    qualityHint: "Bra för supportflöden och import från iPhone-baserat material.",
    supportsBulk: true,
  },
  {
    id: "svg-to-png",
    title: "SVG till PNG",
    description: "Rasteriserar vektorikoner och illustrationer för användning i bildflöden.",
    inputFormats: ["svg"],
    outputFormat: "png",
    category: "image",
    speed: "balanced",
    qualityHint: "Passar thumbnails, delning och system utan SVG-stöd.",
    supportsBulk: true,
  },
  {
    id: "png-to-ico",
    title: "PNG till ICO",
    description: "Genererar favicon- och appikonformat från PNG-underlag.",
    inputFormats: ["png"],
    outputFormat: "ico",
    category: "icon",
    speed: "fast",
    qualityHint: "Bra för webbprojekt, shortcuts och desktop-liknande gränssnitt.",
    supportsBulk: true,
  },
];

export const demoFiles = [
  { name: "hero-banner.jpg", size: 3_400_000 },
  { name: "mobile-screenshot.png", size: 2_100_000 },
  { name: "client-brief.pdf", size: 5_700_000 },
  { name: "iphone-capture.heic", size: 4_800_000 },
  { name: "brand-mark.svg", size: 120_000 },
];

export const acceptedFormats: FileFormat[] = ["jpg", "png", "webp", "pdf", "heic", "svg"];

export function normalizeFormat(value: string): FileFormat | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === "jpeg") return "jpg";
  if (["jpg", "png", "webp", "pdf", "heic", "svg", "ico"].includes(normalized)) {
    return normalized as FileFormat;
  }
  return null;
}

export function getFileExtension(fileName: string): FileFormat | null {
  const ext = fileName.split(".").pop() ?? "";
  return normalizeFormat(ext);
}

export function getCompatibleTools(format: FileFormat | null) {
  if (!format) return [];
  return conversionTools.filter((tool) => tool.inputFormats.includes(format));
}

export function buildResultName(fileName: string, outputFormat: FileFormat) {
  const base = fileName.replace(/\.[^.]+$/, "");
  return `${base}.${outputFormat}`;
}

export function estimateDuration(size: number, tool: ConversionToolDefinition) {
  const sizeWeight = Math.max(900, Math.round(size / 12_000));
  const speedWeight = tool.speed === "fast" ? 700 : tool.speed === "balanced" ? 1500 : 2600;
  return sizeWeight + speedWeight;
}

export function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 ** 2).toFixed(1)} MB`;
}

export function formatLabel(format: FileFormat) {
  return format.toUpperCase();
}

export function formatDuration(durationMs: number) {
  const totalSeconds = Math.max(1, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds} s`;
  return `${minutes} min ${String(seconds).padStart(2, "0")} s`;
}
