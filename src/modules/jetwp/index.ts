import { Server } from "lucide-react";
import type { AdminModuleDefinition } from "@/modules/types";

export const jetwpModule: AdminModuleDefinition = {
  id: "jetwp",
  title: "JetWP",
  description: "Kontrollpanel för Managed WordPress med sajter, jobb, larm och driftflöden.",
  area: "operations",
  href: "/jetwp",
  icon: Server,
  children: [
    { href: "/jetwp", label: "Översikt" },
    { href: "/jetwp/sites", label: "Sajter" },
    { href: "/jetwp/jobs", label: "Jobb" },
    { href: "/jetwp/backups", label: "Säkerhetskopior" },
    { href: "/jetwp/workflow", label: "Arbetsflöden" },
    { href: "/jetwp/security", label: "Säkerhet" },
    { href: "/jetwp/inventory", label: "Inventering" },
    { href: "/jetwp/alerts", label: "Larm" },
    { href: "/jetwp/notifications", label: "Notifikationer" },
    { href: "/jetwp/integrations", label: "Integrationer" },
    { href: "/jetwp/reports", label: "Rapporter" },
    { href: "/jetwp/agents", label: "Agenter" },
    { href: "/jetwp/bulk-update", label: "Massuppdatering" },
    { href: "/jetwp/staging", label: "Testmiljö" },
    { href: "/jetwp/access", label: "Åtkomst" },
    { href: "/jetwp/activity", label: "Aktivitet" },
    { href: "/jetwp/health", label: "Serverhälsa" },
    { href: "/jetwp/onboarding", label: "Onboarding" },
  ],
  metrics: [
    { label: "Roll", value: "Drift", hint: "Managed WordPress" },
    { label: "Yta", value: "18+ vyer", hint: "Största modulen" },
  ],
};
