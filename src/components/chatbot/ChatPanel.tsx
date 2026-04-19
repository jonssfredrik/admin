"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Clock, MessageSquare, Pencil, Send, Sparkles, Trash2, X } from "lucide-react";
import clsx from "clsx";
import { useChatbot, type ChatMessage, type Conversation } from "./ChatbotContext";
import { moduleContexts } from "@/modules/chatbot/data/context";

type PanelView = "chat" | "history";

const SUGGESTIONS = [
  "Vad kan du hjälpa mig med?",
  "Berätta om JetWP",
  "Hur fungerar SnapTLD?",
  "Vad finns i Fakturering?",
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
}

function formatRelative(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return formatTime(iso);
  if (diffDays === 1) return "Igår";
  if (diffDays < 7) return `${diffDays} dagar sedan`;
  return d.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={clsx("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
      <div
        className={clsx(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser ? "rounded-br-sm bg-fg text-bg" : "rounded-bl-sm border bg-bg text-fg",
        )}
      >
        {msg.content}
      </div>
      <span className="px-1 text-[10px] text-muted">{formatTime(msg.timestamp)}</span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start">
      <div className="rounded-2xl rounded-bl-sm border bg-bg px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function WelcomeState({ onSuggestion }: { onSuggestion: (s: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-bg shadow-soft">
        <Bot size={24} className="text-fg" />
      </div>
      <div>
        <h2 className="text-base font-semibold">Hej! Jag är Admin AI.</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Ställ en fråga om systemets moduler — JetWP, SnapTLD, Fakturering och mer.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="rounded-lg border bg-bg px-3 py-2 text-left text-sm text-muted transition-colors hover:border-fg/20 hover:text-fg"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function ConversationItem({
  conv,
  isActive,
  onSelect,
  onDelete,
}: {
  conv: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const userCount = conv.messages.filter((m) => m.role === "user").length;
  return (
    <div
      className={clsx(
        "group flex items-start gap-3 rounded-xl border px-3 py-3 transition-colors",
        isActive ? "border-fg/15 bg-bg" : "border-transparent hover:border-fg/10 hover:bg-bg/60",
      )}
    >
      <button className="flex flex-1 items-start gap-3 text-left" onClick={onSelect}>
        <div
          className={clsx(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
            isActive ? "bg-fg text-bg" : "border bg-bg",
          )}
        >
          <MessageSquare size={13} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium leading-snug">{conv.title}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
            <span>{formatRelative(conv.updatedAt)}</span>
            <span>·</span>
            <span>{userCount} {userCount === 1 ? "fråga" : "frågor"}</span>
          </div>
        </div>
      </button>
      <button
        onClick={onDelete}
        aria-label="Ta bort konversation"
        className="mt-0.5 rounded-md p-1 text-muted opacity-0 transition-all hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function HistoryView({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onNewChat,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="p-3 pb-2">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-xl border border-dashed bg-bg px-3 py-2.5 text-sm text-muted transition-colors hover:border-fg/20 hover:text-fg"
        >
          <Pencil size={13} />
          Ny konversation
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-bg">
            <Clock size={18} className="text-muted" />
          </div>
          <div>
            <p className="text-sm font-medium">Inga sparade chattar</p>
            <p className="mt-0.5 text-xs text-muted">Starta en ny konversation ovan.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 pt-1">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
            {conversations.length} {conversations.length === 1 ? "konversation" : "konversationer"}
          </p>
          <div className="flex flex-col gap-1">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={conv.id === activeId}
                onSelect={() => onSelect(conv.id)}
                onDelete={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ChatPanel() {
  const {
    isOpen,
    close,
    messages,
    sendMessage,
    isTyping,
    activeModules,
    conversations,
    activeConversation,
    startNewConversation,
    switchConversation,
    deleteConversation,
  } = useChatbot();

  const [view, setView] = useState<PanelView>("chat");
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (view === "chat") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, view]);

  useEffect(() => {
    if (isOpen && view === "chat") {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, view]);

  // Reset to chat view when panel opens
  useEffect(() => {
    if (isOpen) setView("chat");
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;
    setInput("");
    sendMessage(text);
  };

  const handleNewChat = () => {
    startNewConversation();
    setView("chat");
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const handleSelectConversation = (id: string) => {
    switchConversation(id);
    setView("chat");
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const handleDelete = (id: string) => {
    deleteConversation(id);
    // stay in history view to let user see the updated list
  };

  const activeCount = moduleContexts.filter((m) => activeModules.includes(m.id)).length;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[49] bg-fg/5" onClick={close} aria-hidden />
      )}

      <div
        className={clsx(
          "fixed top-14 right-0 bottom-0 z-[50] flex w-[380px] flex-col border-l bg-surface shadow-pop",
          "transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Admin AI chat"
        role="complementary"
      >
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          {view === "history" ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("chat")}
                  className="rounded-lg p-1.5 text-muted transition-colors hover:bg-bg hover:text-fg"
                  aria-label="Tillbaka till chat"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M8.84 2.5L3.5 7.5l5.34 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span className="text-sm font-semibold">Historik</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleNewChat}
                  aria-label="Ny konversation"
                  className="rounded-lg p-1.5 text-muted transition-colors hover:bg-bg hover:text-fg"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={close}
                  aria-label="Stäng"
                  className="rounded-lg p-1.5 text-muted transition-colors hover:bg-bg hover:text-fg"
                >
                  <X size={15} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-bg">
                  <Bot size={15} className="text-fg" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    Admin AI
                    <Sparkles size={11} className="text-amber-500" />
                  </div>
                  <div className="text-[11px] text-muted">
                    {activeCount} {activeCount === 1 ? "modul" : "moduler"} med kontext
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setView("history")}
                  aria-label="Visa historik"
                  title="Historik"
                  className={clsx(
                    "relative rounded-lg p-1.5 text-muted transition-colors hover:bg-bg hover:text-fg",
                  )}
                >
                  <Clock size={15} />
                  {conversations.length > 0 && (
                    <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-fg" />
                  )}
                </button>
                <button
                  onClick={handleNewChat}
                  aria-label="Ny konversation"
                  title="Ny konversation"
                  className="rounded-lg p-1.5 text-muted transition-colors hover:bg-bg hover:text-fg"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={close}
                  aria-label="Stäng chat"
                  className="rounded-lg p-1.5 text-muted transition-colors hover:bg-bg hover:text-fg"
                >
                  <X size={15} />
                </button>
              </div>
            </>
          )}
        </header>

        {/* Body */}
        {view === "history" ? (
          <HistoryView
            conversations={conversations}
            activeId={activeConversation?.id ?? null}
            onSelect={handleSelectConversation}
            onDelete={handleDelete}
            onNewChat={handleNewChat}
          />
        ) : (
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            {messages.length === 0 && !isTyping ? (
              <WelcomeState onSuggestion={(s) => sendMessage(s)} />
            ) : (
              <>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={bottomRef} />
              </>
            )}
          </div>
        )}

        {/* Footer — only in chat view */}
        {view === "chat" && (
          <footer className="shrink-0 border-t p-3">
            {activeConversation && (
              <p className="mb-2 truncate px-1 text-[10px] text-muted">
                {activeConversation.title}
              </p>
            )}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Skriv ett meddelande..."
                disabled={isTyping}
                className="flex-1 rounded-lg border bg-bg px-3 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-fg/10 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Skicka"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-fg text-bg transition-opacity hover:opacity-80 disabled:opacity-30"
              >
                <Send size={14} />
              </button>
            </form>
            <p className="mt-2 text-center text-[10px] text-muted">
              Enter för att skicka · Svar är simulerade
            </p>
          </footer>
        )}
      </div>
    </>
  );
}
