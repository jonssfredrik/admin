"use client";

import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import clsx from "clsx";
import { useChatbot } from "@/components/chatbot/ChatbotContext";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { moduleContexts } from "@/modules/chatbot/data/context";
import { useToast } from "@/components/toast/ToastProvider";

export function ChatbotSettingsPage() {
  const { activeModules, toggleModule, clearAllConversations, conversations } = useChatbot();
  const { success } = useToast();
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    clearAllConversations();
    success("Historik rensad", "Alla konversationer har tagits bort.");
  };

  const handleToggle = (id: string) => {
    toggleModule(id);
    const ctx = moduleContexts.find((m) => m.id === id);
    if (!ctx) return;
    const isNowActive = !activeModules.includes(id);
    success(
      isNowActive ? `${ctx.name} aktiverad` : `${ctx.name} inaktiverad`,
      isNowActive
        ? "Modulen ingår nu i AI:ns kontext."
        : "Modulen exkluderas från AI:ns kontext.",
    );
  };

  const totalMessages = conversations.reduce((sum, c) => sum + c.messages.length, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Inställningar" subtitle="Konfigurera Admin AI:ns beteende och kontext." />

      <Card>
        <div className="mb-4">
          <h2 className="text-sm font-semibold">Modulkontext</h2>
          <p className="mt-0.5 text-xs text-muted">
            Välj vilka moduler AI:n ska ha tillgång till i sina svar.
          </p>
        </div>
        <div className="flex flex-col divide-y">
          {moduleContexts.map((ctx) => {
            const active = activeModules.includes(ctx.id);
            return (
              <div
                key={ctx.id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <div className="text-sm font-medium">{ctx.name}</div>
                  <div className="text-xs text-muted">{ctx.description}</div>
                </div>
                <button
                  onClick={() => handleToggle(ctx.id)}
                  role="switch"
                  aria-checked={active}
                  aria-label={`Växla kontext för ${ctx.name}`}
                  className={clsx(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                    active ? "bg-fg" : "bg-fg/15",
                  )}
                >
                  <span
                    className={clsx(
                      "pointer-events-none inline-block h-4 w-4 rounded-full bg-bg shadow transition-transform",
                      active ? "translate-x-4" : "translate-x-0",
                    )}
                  />
                </button>
              </div>
            );
          })}
        </div>
        <p className="mt-4 rounded-lg border bg-bg px-3 py-2.5 text-xs text-muted">
          {activeModules.length === 0
            ? "Inga moduler är aktiva — AI:n kan bara svara på generella frågor."
            : `AI:n har kontext för ${activeModules.length} av ${moduleContexts.length} moduler.`}
        </p>
      </Card>

      <Card>
        <div className="mb-4">
          <h2 className="text-sm font-semibold">Preferenser</h2>
          <p className="mt-0.5 text-xs text-muted">Inställningar för chatbotens beteende.</p>
        </div>
        <div className="flex flex-col divide-y">
          {[
            { label: "Svenska svar", description: "AI:n svarar alltid på svenska", checked: true },
            {
              label: "Spara historik",
              description: "Konversationer sparas lokalt i webbläsaren",
              checked: true,
            },
            {
              label: "Skrivindikator",
              description: "Visa animerade punkter medan AI:n formulerar svar",
              checked: true,
            },
          ].map((pref) => (
            <div
              key={pref.label}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <div className="text-sm font-medium">{pref.label}</div>
                <div className="text-xs text-muted">{pref.description}</div>
              </div>
              <div
                className={clsx(
                  "flex h-5 w-5 items-center justify-center rounded-md border",
                  pref.checked ? "border-fg bg-fg text-bg" : "border-fg/20 bg-bg",
                )}
              >
                {pref.checked && <Check size={11} strokeWidth={2.5} />}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-1 text-sm font-semibold text-red-600 dark:text-red-400">Farlig zon</h2>
        <p className="mb-4 text-xs text-muted">Åtgärder som inte kan ångras.</p>
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
          <div>
            <div className="text-sm font-medium">Rensa all historik</div>
            <div className="text-xs text-muted">
              {conversations.length > 0
                ? `${conversations.length} ${conversations.length === 1 ? "konversation" : "konversationer"} (${totalMessages} meddelanden) raderas.`
                : "Inga konversationer att rensa."}
            </div>
          </div>
          <button
            onClick={() => setConfirmClear(true)}
            disabled={conversations.length === 0}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-red-600 transition-colors hover:bg-red-500/10 disabled:opacity-40 dark:text-red-400"
          >
            <Trash2 size={13} />
            Rensa
          </button>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={handleClear}
        title="Rensa all historik"
        description={`${conversations.length} ${conversations.length === 1 ? "konversation" : "konversationer"} tas bort permanent. Åtgärden kan inte ångras.`}
        confirmLabel="Rensa historik"
        tone="danger"
      />
    </div>
  );
}
