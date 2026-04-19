import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { CommandPalette } from "@/components/command/CommandPalette";
import { ChatbotProvider } from "@/components/chatbot/ChatbotContext";
import { ChatPanel } from "@/components/chatbot/ChatPanel";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatbotProvider>
      <div className="flex h-screen bg-bg text-fg">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto px-8 py-6">{children}</main>
        </div>
        <CommandPalette />
        <ChatPanel />
      </div>
    </ChatbotProvider>
  );
}
