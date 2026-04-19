import type { ConversionHistoryItem } from "@/modules/file-converter/types";

export const conversionHistoryDetails: Record<
  string,
  {
    items: ConversionHistoryItem[];
    issueSummary?: string;
  }
> = {
  "batch-9f32ab": {
    items: [
      { id: "9f32ab-1", fileName: "hero-01.jpg", resultName: "hero-01.webp", toolId: "jpg-to-webp", sourceFormat: "jpg", status: "completed", progress: 100, size: 1_200_000, durationMs: 9_000 },
      { id: "9f32ab-2", fileName: "hero-02.jpg", resultName: "hero-02.webp", toolId: "jpg-to-webp", sourceFormat: "jpg", status: "completed", progress: 100, size: 980_000, durationMs: 8_000 },
      { id: "9f32ab-3", fileName: "cta-banner.png", resultName: "cta-banner.webp", toolId: "png-to-webp", sourceFormat: "png", status: "completed", progress: 100, size: 840_000, durationMs: 7_000 },
      { id: "9f32ab-4", fileName: "favicon-master.png", resultName: "favicon-master.ico", toolId: "png-to-ico", sourceFormat: "png", status: "completed", progress: 100, size: 220_000, durationMs: 4_000 },
    ],
  },
  "batch-a1ce72": {
    items: [
      { id: "a1ce72-1", fileName: "brief.pdf", resultName: "brief.png", toolId: "pdf-to-png", sourceFormat: "pdf", status: "completed", progress: 100, size: 2_900_000, durationMs: 18_000 },
      { id: "a1ce72-2", fileName: "kvitto.pdf", resultName: "kvitto.jpg", toolId: "pdf-to-jpg", sourceFormat: "pdf", status: "completed", progress: 100, size: 1_100_000, durationMs: 12_000 },
      { id: "a1ce72-3", fileName: "support-bilaga.png", resultName: "support-bilaga.pdf", toolId: "png-to-pdf", sourceFormat: "png", status: "completed", progress: 100, size: 1_500_000, durationMs: 11_000 },
    ],
  },
  "batch-c84de1": {
    items: [
      { id: "c84de1-1", fileName: "IMG_9912.heic", resultName: "IMG_9912.jpg", toolId: "heic-to-jpg", sourceFormat: "heic", status: "completed", progress: 100, size: 4_100_000, durationMs: 16_000 },
      { id: "c84de1-2", fileName: "IMG_9913.heic", resultName: "IMG_9913.jpg", toolId: "heic-to-jpg", sourceFormat: "heic", status: "completed", progress: 100, size: 4_000_000, durationMs: 15_000 },
      { id: "c84de1-3", fileName: "IMG_9914.heic", resultName: "IMG_9914.jpg", toolId: "heic-to-jpg", sourceFormat: "heic", status: "running", progress: 72, size: 4_300_000, note: "Kör fortfarande i aktiv kö." },
      { id: "c84de1-4", fileName: "IMG_9915.heic", resultName: "IMG_9915.jpg", toolId: "heic-to-jpg", sourceFormat: "heic", status: "queued", progress: 0, size: 4_250_000, note: "Väntar på ledig plats i batchen." },
    ],
    issueSummary: "5 filer återstår i den aktiva batchen. Körningen väntar inte på handpåläggning ännu.",
  },
  "batch-f1820d": {
    items: [
      { id: "f1820d-1", fileName: "brand-mark.svg", resultName: "brand-mark.png", toolId: "svg-to-png", sourceFormat: "svg", status: "completed", progress: 100, size: 140_000, durationMs: 6_000 },
      { id: "f1820d-2", fileName: "brand-mark-outline.svg", resultName: "brand-mark-outline.png", toolId: "svg-to-png", sourceFormat: "svg", status: "completed", progress: 100, size: 130_000, durationMs: 6_000 },
      { id: "f1820d-3", fileName: "favicon-1024.png", resultName: "favicon-1024.ico", toolId: "png-to-ico", sourceFormat: "png", status: "completed", progress: 100, size: 510_000, durationMs: 5_000 },
      { id: "f1820d-4", fileName: "partner-lockup.svg", resultName: "partner-lockup.png", toolId: "svg-to-png", sourceFormat: "svg", status: "canceled", progress: 38, size: 180_000, note: "Rasteriseringen avbröts efter att filen flaggats för saknad font." },
      { id: "f1820d-5", fileName: "appicon-source.png", resultName: "appicon-source.ico", toolId: "png-to-ico", sourceFormat: "png", status: "canceled", progress: 12, size: 750_000, note: "Exporten stoppades för att underlaget inte uppfyllde favicon-storleken." },
    ],
    issueSummary: "2 filer flaggades i leveransen. Båda kräver nytt underlag innan batchen körs om.",
  },
};
