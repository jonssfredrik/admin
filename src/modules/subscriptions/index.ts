import { CreditCard } from "lucide-react";
import type { AdminModuleDefinition } from "@/modules/types";

export const subscriptionsModule: AdminModuleDefinition = {
  id: "subscriptions",
  title: "Abonnemang",
  shortTitle: "Prenumerationer",
  description: "Spåra och hantera återkommande prenumerationer, kostnader och förnyelsedatum.",
  area: "business",
  href: "/subscriptions",
  icon: CreditCard,
  children: [
    { href: "/subscriptions", label: "Översikt" },
    { href: "/subscriptions/renewals", label: "Förnyelser" },
    { href: "/subscriptions/calendar", label: "Kalender" },
  ],
  metrics: [
    { label: "Typ", value: "Kostnadsöversikt", hint: "Prenumerationer & fakturacykler" },
    { label: "Lagring", value: "Lokalt", hint: "Sparas i webbläsaren" },
  ],
};
