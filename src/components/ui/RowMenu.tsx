"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, type LucideIcon } from "lucide-react";
import clsx from "clsx";

export interface RowMenuItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  danger?: boolean;
  divider?: never;
}

export type RowMenuEntry = RowMenuItem | { divider: true };

export function RowMenu({ items }: { items: RowMenuEntry[] }) {
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

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

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setUp(window.innerHeight - rect.bottom < 240);
    }
    setOpen((v) => !v);
  };

  return (
    <div ref={ref} className="relative inline-block">
      <button
        ref={btnRef}
        onClick={handleOpen}
        className={clsx(
          "rounded-md p-1 transition-colors",
          open ? "bg-bg text-fg" : "text-muted hover:bg-bg hover:text-fg",
        )}
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div
          className={clsx(
            "absolute right-0 z-30 w-48 overflow-hidden rounded-lg border bg-surface p-1 shadow-pop",
            up ? "bottom-[calc(100%+4px)]" : "top-[calc(100%+4px)]",
          )}
        >
          {items.map((entry, i) => {
            if ("divider" in entry) return <div key={`d-${i}`} className="my-1 h-px bg-border" />;
            const Icon = entry.icon;
            return (
              <button
                key={entry.label}
                onClick={() => {
                  setOpen(false);
                  entry.onClick();
                }}
                className={clsx(
                  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                  entry.danger
                    ? "text-red-600 hover:bg-red-500/10 dark:text-red-400"
                    : "text-fg/90 hover:bg-bg hover:text-fg",
                )}
              >
                {Icon && <Icon size={14} strokeWidth={1.75} className={entry.danger ? "" : "text-muted"} />}
                <span>{entry.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
