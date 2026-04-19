import { Bot } from "lucide-react";
import type { AdminModuleDefinition } from "@/modules/types";

export const chatbotModule: AdminModuleDefinition = {
  id: "chatbot",
  title: "Admin AI",
  shortTitle: "AI",
  description: "Inbyggd AI-assistent med kontext för alla systemmoduler. Ställ frågor om JetWP, SnapTLD, Fakturering och mer.",
  area: "operations",
  href: "/chatbot",
  icon: Bot,
  children: [
    { href: "/chatbot", label: "Översikt" },
    { href: "/chatbot/installningar", label: "Inställningar" },
  ],
  metrics: [
    { label: "Typ", value: "Assistent", hint: "Konversationsbaserad AI" },
    { label: "Kontext", value: "4 moduler", hint: "JetWP, SnapTLD, Billing m.fl." },
  ],
};
