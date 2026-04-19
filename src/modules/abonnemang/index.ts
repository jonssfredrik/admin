import { CreditCard } from "lucide-react";
import type { AdminModuleDefinition } from "@/modules/types";

export const abonnemangModule: AdminModuleDefinition = {
  id: "abonnemang",
  title: "Abonnemang",
  shortTitle: "Prenumerationer",
  description: "Spåra och hantera återkommande prenumerationer, kostnader och förnyelsedatum.",
  area: "business",
  href: "/abonnemang",
  icon: CreditCard,
  children: [
    { href: "/abonnemang", label: "Översikt" },
    { href: "/abonnemang/fornyelsel", label: "Förnyelser" },
  ],
  metrics: [
    { label: "Typ", value: "Kostnadsöversikt", hint: "Prenumerationer & fakturacykler" },
    { label: "Lagring", value: "Lokalt", hint: "Sparas i webbläsaren" },
  ],
};
