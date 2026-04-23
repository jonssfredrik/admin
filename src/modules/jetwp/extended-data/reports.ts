export interface ReportPreset {
  id: string;
  name: string;
  format: "pdf" | "csv";
  scope: string;
  generatedAt: string;
}

export const reportPresets: ReportPreset[] = [
  { id: "rp-1", name: "Månadsrapport kund", format: "pdf", scope: "Per sajt", generatedAt: "2026-04-18 08:00" },
  { id: "rp-2", name: "Inventory-export", format: "csv", scope: "Hela flottan", generatedAt: "2026-04-19 07:30" },
];
