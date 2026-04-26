import { ReceiptText } from "lucide-react";
import type { AdminModuleDefinition } from "@/modules/types";

export const billingModule: AdminModuleDefinition = {
  id: "billing",
  title: "Fakturering",
  description: "Skapa manuella fakturor och få överblick över bolag, kunder och betalstatus.",
  area: "business",
  href: "/billing",
  icon: ReceiptText,
  children: [
    { href: "/billing", label: "Översikt", matchPaths: ["/billing/[id]"] },
    { href: "/billing/companies", label: "Mina företag" },
    { href: "/billing/customers", label: "Kunder" },
  ],
  metrics: [
    { label: "Fokus", value: "Fakturering", hint: "Manuella flöden" },
    { label: "Mönster", value: "Form + lista", hint: "Validerar affärsmoduler" },
  ],
};
