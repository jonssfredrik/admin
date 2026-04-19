import { abonnemangModule } from "@/modules/abonnemang";
import { billingModule } from "@/modules/billing";
import { chatbotModule } from "@/modules/chatbot";
import { fileConverterModule } from "@/modules/file-converter";
import { jetwpModule } from "@/modules/jetwp";
import { snaptldModule } from "@/modules/snaptld";

export const adminModules = [jetwpModule, snaptldModule, chatbotModule, billingModule, abonnemangModule, fileConverterModule];
