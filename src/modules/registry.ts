import { subscriptionsModule } from "@/modules/subscriptions";
import { billingModule } from "@/modules/billing";
import { calendarModule } from "@/modules/calendar";
import { chatbotModule } from "@/modules/chatbot";
import { driveModule } from "@/modules/drive";
import { fileConverterModule } from "@/modules/file-converter";
import { jetwpModule } from "@/modules/jetwp";
import { snaptldModule } from "@/modules/snaptld";
import { wpOrchestratorModule } from "@/modules/wp-orchestrator";

export const adminModules = [
  jetwpModule,
  snaptldModule,
  wpOrchestratorModule,
  chatbotModule,
  billingModule,
  subscriptionsModule,
  fileConverterModule,
  driveModule,
  calendarModule,
];
