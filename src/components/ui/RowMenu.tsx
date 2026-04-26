"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

const MENU_WIDTH = 192;
const VIEWPORT_GAP = 8;

export function RowMenu({ items }: { items: RowMenuEntry[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, items.length]);

  function updatePosition() {
    if (!btnRef.current) return;

    const buttonRect = btnRef.current.getBoundingClientRect();
    const estimatedHeight = menuRef.current?.offsetHeight ?? Math.max(120, items.length * 34 + 8);
    const openUp = window.innerHeight - buttonRect.bottom < estimatedHeight + VIEWPORT_GAP;

    const top = openUp
      ? Math.max(VIEWPORT_GAP, buttonRect.top - estimatedHeight - 4)
      : Math.min(window.innerHeight - estimatedHeight - VIEWPORT_GAP, buttonRect.bottom + 4);

    const left = Math.min(
      window.innerWidth - MENU_WIDTH - VIEWPORT_GAP,
      Math.max(VIEWPORT_GAP, buttonRect.right - MENU_WIDTH),
    );

    setPosition({ top, left });
  }

  const menu =
    open && mounted
      ? createPortal(
          <div
            ref={menuRef}
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="fixed z-[60] overflow-hidden rounded-lg border bg-surface p-1 shadow-pop"
          >
            {items.map((entry, index) => {
              if ("divider" in entry) return <div key={`divider-${index}`} className="my-1 h-px bg-border" />;
              const Icon = entry.icon;
              return (
                <button
                  key={`${entry.label}-${index}`}
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
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div ref={rootRef} className="relative inline-block">
        <button
          ref={btnRef}
          onClick={() => {
            if (!open) updatePosition();
            setOpen((value) => !value);
          }}
          className={clsx(
            "rounded-md p-1 transition-colors",
            open ? "bg-bg text-fg" : "text-muted hover:bg-bg hover:text-fg",
          )}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
      {menu}
    </>
  );
}
