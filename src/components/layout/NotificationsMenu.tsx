"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Check, UserPlus, AlertTriangle, MessageSquare, CreditCard, type LucideIcon } from "lucide-react";
import clsx from "clsx";

type Tone = "neutral" | "success" | "warning" | "danger";

interface Notification {
  id: string;
  icon: LucideIcon;
  tone: Tone;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const initial: Notification[] = [
  { id: "1", icon: UserPlus, tone: "success", title: "Ny användare registrerad", body: "Ingmar Bergman accepterade din inbjudan", time: "2 min sedan", read: false },
  { id: "2", icon: AlertTriangle, tone: "warning", title: "Misslyckad inloggning", body: "3 försök från okänd IP — zlatan@company.se", time: "14 min sedan", read: false },
  { id: "3", icon: MessageSquare, tone: "neutral", title: "Nytt supportärende", body: "Greta Thunberg skickade en fråga", time: "1 tim sedan", read: false },
  { id: "4", icon: CreditCard, tone: "success", title: "Betalning mottagen", body: "24 400 kr från Acme AB", time: "3 tim sedan", read: true },
  { id: "5", icon: Bell, tone: "neutral", title: "Veckorapport klar", body: "Din rapport för v.16 är genererad", time: "igår", read: true },
];

const toneStyles: Record<Tone, string> = {
  neutral: "bg-fg/5 text-muted",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);

  const unread = items.filter((i) => !i.read).length;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const markAllRead = () => setItems((xs) => xs.map((x) => ({ ...x, read: true })));
  const markRead = (id: string) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, read: true } : x)));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifikationer"
        className={clsx(
          "relative rounded-lg p-2 transition-colors",
          open ? "bg-bg text-fg" : "text-muted hover:bg-bg hover:text-fg",
        )}
      >
        <Bell size={16} strokeWidth={1.75} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-1.5 w-1.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-40 w-[360px] overflow-hidden rounded-2xl border bg-surface shadow-pop">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight">Notifikationer</span>
              {unread > 0 && (
                <span className="rounded-md bg-fg/10 px-1.5 py-0.5 text-[10px] font-medium tabular-nums">
                  {unread}
                </span>
              )}
            </div>
            <button
              onClick={markAllRead}
              disabled={unread === 0}
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg disabled:opacity-40"
            >
              <Check size={12} />
              Markera alla
            </button>
          </div>

          <div className="max-h-[380px] overflow-y-auto">
            {items.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-muted">Inga notifikationer</div>
            )}
            {items.map((n) => {
              const Icon = n.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className="flex w-full items-start gap-3 border-b border-border/60 px-4 py-3 text-left transition-colors last:border-0 hover:bg-bg/50"
                >
                  <div className={clsx("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", toneStyles[n.tone])}>
                    <Icon size={14} strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-medium">{n.title}</div>
                      {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-fg" />}
                    </div>
                    <div className="mt-0.5 line-clamp-2 text-xs text-muted">{n.body}</div>
                    <div className="mt-1 text-[11px] text-muted">{n.time}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t px-4 py-2.5">
            <button className="w-full text-center text-xs text-muted hover:text-fg">
              Visa alla notifikationer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
