import { Server } from "lucide-react";
import type { AdminModuleDefinition } from "@/modules/types";

export const jetwpModule: AdminModuleDefinition = {
  id: "jetwp",
  title: "JetWP",
  description: "Kontrollpanel för WordPress-sajter, JetWP-agenter, jobb, larm och arbetsflöden.",
  area: "operations",
  href: "/jetwp",
  icon: Server,
  children: [
    { href: "/jetwp", label: "Översikt" },
    { href: "/jetwp/sites", label: "Sajter", matchPaths: ["/jetwp/[id]"] },
    { href: "/jetwp/jobs", label: "Jobb" },
    { href: "/jetwp/workflow", label: "Arbetsflöden" },
    { href: "/jetwp/inventory", label: "Inventering" },
    { href: "/jetwp/alerts", label: "Larm" },
    { href: "/jetwp/reports", label: "Rapporter" },
    { href: "/jetwp/agents", label: "Agenter" },
    { href: "/jetwp/onboarding", label: "Onboarding" },
  ],
  metrics: [
    { label: "Roll", value: "Drift", hint: "WordPress-flotta" },
    { label: "Yta", value: "9 kärnvyer", hint: "Nedskalad JetWP" },
  ],
};
