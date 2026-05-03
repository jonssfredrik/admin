import { Cloud } from "lucide-react";
import type { AdminModuleDefinition } from "@/modules/types";

export const driveModule: AdminModuleDefinition = {
  id: "drive",
  title: "Drive",
  description: "Webbaserad filhantering med previews, mappar, ZIP-nedladdning och serverlagring.",
  area: "workspace",
  href: "/drive",
  icon: Cloud,
  metrics: [
    { label: "Läge", value: "Server", hint: "SQLite och lokal storage" },
    { label: "Preview", value: "Rich", hint: "Bild, PDF, text och kod" },
  ],
};
