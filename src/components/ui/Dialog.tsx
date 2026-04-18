"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export function Dialog({ open, onClose, title, description, children, footer, size = "md" }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 animate-fade-in bg-black/30 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "relative w-full animate-dialog-in overflow-hidden rounded-2xl border bg-surface shadow-pop",
          sizes[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold tracking-tight">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Stäng"
            className="-mr-1 -mt-1 shrink-0 rounded-md p-1.5 text-muted hover:bg-bg hover:text-fg"
          >
            <X size={15} />
          </button>
        </div>

        {children && <div className="px-5 py-4">{children}</div>}

        {footer && <div className="flex justify-end gap-2 border-t bg-bg/40 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}
