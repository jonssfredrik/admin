import { Workflow } from "lucide-react";
import type { AdminModuleDefinition } from "@/modules/types";

export const wpOrchestratorModule: AdminModuleDefinition = {
  id: "wp-orchestrator",
  title: "WP Orchestrator",
  shortTitle: "WP Orchestrator",
  description:
    "Frontend-demo för en AI-orkestrator som planerar och simulerar lokal WordPress-utveckling med agents, WP-CLI och REST-actions.",
  area: "operations",
  href: "/wp-orchestrator",
  icon: Workflow,
  children: [
    { href: "/wp-orchestrator", label: "Studio" },
    { href: "/wp-orchestrator/actions", label: "Action-logg" },
    { href: "/wp-orchestrator/settings", label: "Inställningar" },
  ],
  metrics: [
    { label: "Läge", value: "Demo", hint: "Frontend-only med mockad pipeline" },
    { label: "Flöde", value: "Agents", hint: "Plan, build och QA i samma studio" },
  ],
};
