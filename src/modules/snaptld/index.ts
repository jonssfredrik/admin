import { Radar } from "lucide-react";
import type { AdminModuleDefinition } from "@/modules/types";

export const snaptldModule: AdminModuleDefinition = {
  id: "snaptld",
  title: "SnapTLD",
  shortTitle: "SnapTLD",
  description:
    "Analyserar och poängsätter nyligen utgångna domäner för att hitta värdefulla återregistreringar.",
  area: "operations",
  href: "/snaptld",
  icon: Radar,
  children: [
    { href: "/snaptld", label: "Översikt" },
    { href: "/snaptld/queue", label: "Analyskö", matchPaths: ["/snaptld/[domain]"] },
    { href: "/snaptld/sources", label: "Källor" },
    { href: "/snaptld/reports", label: "Rapporter" },
    { href: "/snaptld/weights", label: "Vikter" },
    { href: "/snaptld/settings", label: "Inställningar" },
  ],
  metrics: [
    { label: "Fokus", value: "Scoring", hint: "8 analysdimensioner" },
    { label: "Indata", value: "Feeds + import", hint: "JSON, CSV, URL, fritext" },
  ],
};
