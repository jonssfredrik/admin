import { subscriptionsModule } from "@/modules/subscriptions";
import { billingModule } from "@/modules/billing";
import { calendarModule } from "@/modules/calendar";
import { chatbotModule } from "@/modules/chatbot";
import { fileConverterModule } from "@/modules/file-converter";
import { jetwpModule } from "@/modules/jetwp";
import { snaptldModule } from "@/modules/snaptld";

export const adminModules = [
  jetwpModule,
  snaptldModule,
  chatbotModule,
  billingModule,
  subscriptionsModule,
  fileConverterModule,
  calendarModule,
];
