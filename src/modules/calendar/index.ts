import { CalendarDays } from "lucide-react";
import type { AdminModuleDefinition } from "@/modules/types";

export const calendarModule: AdminModuleDefinition = {
  id: "calendar",
  title: "Kalender",
  description: "Personlig kalender med egna händelser och samlad vy från andra moduler.",
  area: "workspace",
  href: "/calendar",
  icon: CalendarDays,
  children: [
    { href: "/calendar", label: "Månad" },
    { href: "/calendar/week", label: "Vecka" },
    { href: "/calendar/agenda", label: "Agenda" },
  ],
  metrics: [
    { label: "Källor", value: "4", hint: "Egna + aggregerade datum" },
    { label: "Lagring", value: "Lokalt", hint: "localStorage i webbläsaren" },
  ],
};
