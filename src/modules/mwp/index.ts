import { Server } from "lucide-react";
import type { AdminModuleDefinition } from "@/modules/types";

export const mwpModule: AdminModuleDefinition = {
  id: "mwp",
  title: "MWP",
  description: "Kontrollpanel för Managed WordPress med sajter, jobb, larm och driftflöden.",
  area: "operations",
  href: "/mwp",
  icon: Server,
  children: [
    { href: "/mwp", label: "Översikt" },
    { href: "/mwp/sites", label: "Sajter", matchPaths: ["/mwp/[id]"] },
    { href: "/mwp/jobs", label: "Jobb" },
    { href: "/mwp/workflow", label: "Arbetsflöden" },
    { href: "/mwp/security", label: "Säkerhet" },
    { href: "/mwp/inventory", label: "Inventering" },
    { href: "/mwp/alerts", label: "Larm" },
    { href: "/mwp/notifications", label: "Notifikationer" },
    { href: "/mwp/integrations", label: "Integrationer" },
    { href: "/mwp/reports", label: "Rapporter" },
    { href: "/mwp/agents", label: "Agenter" },
    { href: "/mwp/bulk-update", label: "Massuppdatering" },
    { href: "/mwp/staging", label: "Testmiljö" },
    { href: "/mwp/access", label: "Åtkomst" },
    { href: "/mwp/activity", label: "Aktivitet" },
    { href: "/mwp/health", label: "Serverhälsa" },
    { href: "/mwp/onboarding", label: "Onboarding" },
  ],
  metrics: [
    { label: "Roll", value: "Drift", hint: "Managed WordPress" },
    { label: "Yta", value: "18+ vyer", hint: "Största modulen" },
  ],
};
