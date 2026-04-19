import { FolderCog } from "lucide-react";
import type { AdminModuleDefinition } from "@/modules/types";

export const fileConverterModule: AdminModuleDefinition = {
  id: "file-converter",
  title: "Konvertera filer",
  shortTitle: "Konvertera",
  description: "Konvertera filer i batch, följ kön i realtid och återanvänd presets för återkommande jobb.",
  area: "business",
  href: "/convert-files",
  icon: FolderCog,
  children: [
    { href: "/convert-files", label: "Översikt" },
    { href: "/convert-files/history", label: "Historik" },
    { href: "/convert-files/presets", label: "Presets" },
  ],
  metrics: [
    { label: "Stöd", value: "13 flöden", hint: "JPG, PNG, WEBP, PDF, HEIC, SVG, ICO" },
    { label: "Läge", value: "Batchkö", hint: "Staging, presets och historik i samma arbetsyta" },
  ],
};
