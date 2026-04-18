"use client";

import { AlertTriangle } from "lucide-react";
import clsx from "clsx";
import { Dialog } from "./Dialog";
import { Button } from "./Button";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Bekräfta",
  cancelLabel = "Avbryt",
  tone = "default",
}: Props) {
  const isDanger = tone === "danger";
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{cancelLabel}</Button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={clsx(
              "inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium transition-colors",
              isDanger
                ? "bg-red-600 text-white hover:bg-red-600/90 dark:bg-red-500 dark:hover:bg-red-500/90"
                : "bg-fg text-bg hover:opacity-90",
            )}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      {isDanger && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
          <span className="text-muted">Denna åtgärd kan inte ångras.</span>
        </div>
      )}
    </Dialog>
  );
}
