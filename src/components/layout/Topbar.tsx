"use client";

import { Bot, Search } from "lucide-react";
import clsx from "clsx";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NotificationsMenu } from "./NotificationsMenu";
import { UserMenu } from "./UserMenu";
import { useChatbot } from "@/components/chatbot/ChatbotContext";

export function Topbar() {
  const { toggle, isOpen } = useChatbot();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-surface px-6">
      <button
        onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
        className="group flex w-full max-w-sm items-center gap-2 rounded-lg border bg-bg py-1.5 pl-3 pr-2 text-sm text-muted transition-colors hover:border-fg/20"
      >
        <Search size={15} />
        <span className="flex-1 text-left">Sök eller kör kommando...</span>
        <kbd className="hidden items-center gap-0.5 rounded border bg-surface px-1.5 py-0.5 text-[10px] font-medium md:inline-flex">
          ⌘K
        </kbd>
      </button>
      <div className="flex items-center gap-1">
        <button
          onClick={toggle}
          aria-label="Öppna AI-chat"
          aria-pressed={isOpen}
          className={clsx(
            "flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-bg hover:text-fg",
            isOpen && "bg-bg text-fg",
          )}
        >
          <Bot size={16} strokeWidth={1.75} />
        </button>
        <ThemeToggle />
        <NotificationsMenu />
        <UserMenu />
      </div>
    </header>
  );
}
