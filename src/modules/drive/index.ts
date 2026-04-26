import { Cloud } from "lucide-react";
import type { AdminModuleDefinition } from "@/modules/types";

export const driveModule: AdminModuleDefinition = {
  id: "drive",
  title: "Drive",
  description: "Webbaserad filhantering med previews, delning och förberett API-kontrakt för serverlagring.",
  area: "workspace",
  href: "/drive",
  icon: Cloud,
  metrics: [
    { label: "Läge", value: "Mock API", hint: "Redo för backend" },
    { label: "Preview", value: "Rich", hint: "Bild, PDF, text och kod" },
  ],
};
