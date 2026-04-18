"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Settings, CreditCard, HelpCircle, LogOut, ChevronsUpDown, type LucideIcon } from "lucide-react";
import clsx from "clsx";

const me = {
  name: "Fredrik Jonsson",
  email: "fredrik@company.se",
  role: "Admin",
  initials: "F",
};

interface Item {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  shortcut?: string;
  danger?: boolean;
}

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const close = () => setOpen(false);

  const groups: Item[][] = [
    [
      { label: "Profil", icon: User, onClick: () => { close(); router.push("/settings"); }, shortcut: "⇧⌘P" },
      { label: "Inställningar", icon: Settings, onClick: () => { close(); router.push("/settings"); }, shortcut: "⌘," },
      { label: "Fakturering", icon: CreditCard, onClick: () => { close(); router.push("/settings"); } },
    ],
    [
      { label: "Hjälp & support", icon: HelpCircle, onClick: close },
    ],
    [
      { label: "Logga ut", icon: LogOut, onClick: () => { close(); router.push("/login"); }, shortcut: "⇧⌘Q", danger: true },
    ],
  ];

  return (
    <div ref={ref} className="relative ml-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "flex items-center gap-1 rounded-lg p-0.5 pr-1 transition-colors",
          open ? "bg-bg" : "hover:bg-bg",
        )}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-fg/10 text-[11px] font-medium">
          {me.initials}
        </div>
        <ChevronsUpDown size={12} className="text-muted" strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-40 w-64 overflow-hidden rounded-2xl border bg-surface shadow-pop">
          <div className="flex items-center gap-3 border-b px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-fg/10 text-xs font-semibold">
              {me.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <div className="truncate text-sm font-medium">{me.name}</div>
                <span className="rounded bg-fg/5 px-1 py-0.5 text-[10px] font-medium text-muted">{me.role}</span>
              </div>
              <div className="truncate text-xs text-muted">{me.email}</div>
            </div>
          </div>

          {groups.map((group, gi) => (
            <div key={gi} className={clsx("p-1", gi < groups.length - 1 && "border-b")}>
              {group.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className={clsx(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                      item.danger
                        ? "text-red-600 hover:bg-red-500/10 dark:text-red-400"
                        : "text-fg/90 hover:bg-bg hover:text-fg",
                    )}
                  >
                    <Icon size={15} strokeWidth={1.75} className={item.danger ? "" : "text-muted"} />
                    <span className="flex-1">{item.label}</span>
                    {item.shortcut && (
                      <kbd className="text-[10px] font-medium text-muted">{item.shortcut}</kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
