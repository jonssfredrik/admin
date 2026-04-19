"use client";

import clsx from "clsx";
import { Check, Minus } from "lucide-react";

interface Props {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
}

export function Checkbox({ checked, indeterminate, onChange, ariaLabel }: Props) {
  const on = checked || indeterminate;
  return (
    <button
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={clsx(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
        on ? "border-fg bg-fg text-bg" : "border-fg/20 bg-surface hover:border-fg/40",
      )}
    >
      {indeterminate ? <Minus size={10} strokeWidth={3} /> : checked ? <Check size={10} strokeWidth={3} /> : null}
    </button>
  );
}
