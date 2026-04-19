import { Globe } from "lucide-react";
import type { AdminModuleDefinition } from "@/modules/types";

export const domainsModule: AdminModuleDefinition = {
  id: "domains",
  title: "Domäner",
  description: "Hantera domänportföljen, försäljningsvärde, förnyelser och operativ status.",
  area: "operations",
  href: "/domains",
  icon: Globe,
  children: [
    { href: "/domains", label: "Översikt" },
  ],
  metrics: [
    { label: "Fokus", value: "Portfölj", hint: "Värde och förnyelser" },
    { label: "Mönster", value: "Listor", hint: "Filter och status" },
  ],
};
