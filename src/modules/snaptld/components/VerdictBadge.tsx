import clsx from "clsx";
import { verdictMeta, type Verdict } from "@/modules/snaptld/data/core";

const tones = {
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  danger: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  neutral: "bg-fg/5 text-muted border-border",
} as const;

export function VerdictBadge({ verdict, size = "sm" }: { verdict: Verdict; size?: "sm" | "md" }) {
  const meta = verdictMeta[verdict];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-md border font-medium",
        tones[meta.tone],
        size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", {
        "bg-emerald-500": meta.tone === "success",
        "bg-amber-500": meta.tone === "warning",
        "bg-red-500": meta.tone === "danger",
        "bg-muted": meta.tone === "neutral",
      })} />
      {meta.label}
    </span>
  );
}
