"use client";

import { useEffect, useState } from "react";
import { AlarmClock, Clock } from "lucide-react";
import clsx from "clsx";
import { expiryInfo } from "@/modules/snaptld/lib/urgency";

const toneClasses = {
  danger: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  neutral: "border-border bg-fg/5 text-muted",
  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
} as const;

interface Props {
  expiresAt: string;
  variant?: "short" | "long";
  className?: string;
}

export function ExpiryBadge({ expiresAt, variant = "short", className }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const info = expiryInfo(expiresAt, now ?? new Date(expiresAt));
  const Icon = info.tone === "danger" ? AlarmClock : Clock;

  return (
    <span
      title={info.label}
      className={clsx(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
        toneClasses[info.tone],
        className,
      )}
    >
      <Icon size={11} className={clsx(info.tone === "danger" && "animate-pulse")} />
      {variant === "short" ? info.short : info.label}
    </span>
  );
}
