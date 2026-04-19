"use client";

import { useState } from "react";
import { Bot, Clock, MessageSquare, Pencil, Trash2, Zap } from "lucide-react";
import clsx from "clsx";
import { useChatbot, type Conversation } from "@/components/chatbot/ChatbotContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { StatCard } from "@/components/ui/StatCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { moduleContexts } from "@/modules/chatbot/data/context";
import { useToast } from "@/components/toast/ToastProvider";

function formatRelative(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0)
    return (
      "Idag " +
      d.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })
    );
  if (diffDays === 1) return "Igår";
  if (diffDays < 7) return `${diffDays} dagar sedan`;
  return d.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
}

function ConversationRow({
  conv,
  isActive,
  onOpen,
  onDelete,
}: {
  conv: Conversation;
  isActive: boolean;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const userCount = conv.messages.filter((m) => m.role === "user").length;
  return (
    <div className="group flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors hover:bg-bg">
      <div
        className={clsx(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isActive ? "bg-fg text-bg" : "border bg-surface",
        )}
      >
        <MessageSquare size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{conv.title}</span>
          {isActive && (
            <span className="shrink-0 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              Aktiv
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
          <Clock size={10} />
          <span>{formatRelative(conv.updatedAt)}</span>
          <span>·</span>
          <span>{conv.messages.length} meddelanden</span>
          <span>·</span>
          <span>{userCount} {userCount === 1 ? "fråga" : "frågor"}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onOpen}
          className="rounded-lg px-2.5 py-1.5 text-xs text-muted transition-colors hover:bg-surface hover:text-fg"
        >
          Öppna
        </button>
        <button
          onClick={onDelete}
          aria-label="Ta bort"
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export function ChatbotOverviewPage() {
  const {
    conversations,
    activeConversation,
    activeModules,
    open,
    switchConversation,
    startNewConversation,
    deleteConversation,
  } = useChatbot();
  const { success } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);

  const totalMessages = conversations.reduce((sum, c) => sum + c.messages.length, 0);

  const handleOpen = (id: string) => {
    switchConversation(id);
    open();
  };

  const handleNewChat = () => {
    startNewConversation();
    open();
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteConversation(deleteTarget.id);
    success("Konversation borttagen", `"${deleteTarget.title}" har tagits bort.`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Admin AI"
          subtitle="Inbyggd AI-assistent med kontext för systemets moduler."
        />
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" onClick={() => open()} className="h-8 px-3 text-xs">
            Öppna chat
          </Button>
          <Button variant="primary" onClick={handleNewChat} className="h-8 gap-1.5 px-3 text-xs">
            <Pencil size={13} />
            Ny chat
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Konversationer" value={String(conversations.length)} />
        <StatCard label="Totalt meddelanden" value={String(totalMessages)} />
        <StatCard
          label="Aktiva moduler"
          value={String(activeModules.length)}
          hint="av 4 tillgängliga"
        />
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Aktiv kontext</h2>
            <p className="mt-0.5 text-xs text-muted">Moduler som AI:n har tillgång till</p>
          </div>
          <a
            href="/chatbot/installningar"
            className="text-xs text-muted underline-offset-2 hover:text-fg hover:underline"
          >
            Hantera
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {moduleContexts.map((ctx) => {
            const active = activeModules.includes(ctx.id);
            return (
              <div
                key={ctx.id}
                className={clsx(
                  "flex items-start gap-3 rounded-xl border p-3",
                  active ? "border-fg/10 bg-bg" : "opacity-40",
                )}
              >
                <div
                  className={clsx(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    active ? "bg-emerald-500/10" : "bg-fg/5",
                  )}
                >
                  <Zap
                    size={13}
                    className={active ? "text-emerald-600 dark:text-emerald-400" : "text-muted"}
                  />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs font-medium">{ctx.name}</div>
                  <div className="truncate text-[11px] text-muted">{ctx.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Konversationshistorik</h2>
            <p className="mt-0.5 text-xs text-muted">
              {conversations.length > 0
                ? `${conversations.length} sparade ${conversations.length === 1 ? "konversation" : "konversationer"}`
                : "Inga sparade konversationer ännu"}
            </p>
          </div>
          {conversations.length > 0 && (
            <Button variant="ghost" onClick={handleNewChat} className="h-7 gap-1.5 px-3 text-xs">
              <Pencil size={12} />
              Ny chat
            </Button>
          )}
        </div>

        {conversations.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-bg shadow-soft">
              <Bot size={20} className="text-muted" />
            </div>
            <div>
              <p className="text-sm font-medium">Inga konversationer ännu</p>
              <p className="mt-1 text-xs text-muted">
                Öppna chatten och ställ din första fråga till Admin AI.
              </p>
            </div>
            <Button variant="secondary" onClick={handleNewChat} className="h-8 px-4 text-xs">
              Starta konversation
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {conversations.map((conv) => (
              <ConversationRow
                key={conv.id}
                conv={conv}
                isActive={conv.id === activeConversation?.id}
                onOpen={() => handleOpen(conv.id)}
                onDelete={() => setDeleteTarget(conv)}
              />
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Ta bort konversation"
        description={deleteTarget ? `"${deleteTarget.title}" tas bort permanent.` : ""}
        confirmLabel="Ta bort"
        tone="danger"
      />
    </div>
  );
}
