"use client";

import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";

export function MiniStat({ label, value, pct, tone }: { label: string; value: string; pct?: number; tone?: "warning" | "default" }) {
  return (
    <Card className="p-4">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted">{label}</div>
      <div className={clsx("mt-1.5 text-xl font-semibold tracking-tight tabular-nums", tone === "warning" && "text-amber-600 dark:text-amber-400")}>
        {value}
      </div>
      {typeof pct === "number" && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-fg/5">
          <div className={clsx("h-full rounded-full", pct > 85 ? "bg-amber-500" : "bg-fg/60")} style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      )}
    </Card>
  );
}

export function HealthRow({ ok, label, detail, warn }: { ok: boolean; label: string; detail: string; warn?: boolean }) {
  const Icon = !ok ? XCircle : warn ? AlertTriangle : CheckCircle2;
  const color = !ok ? "text-red-600 dark:text-red-400" : warn ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400";
  return (
    <div className="flex items-center gap-2.5">
      <Icon size={14} className={clsx("shrink-0", color)} />
      <span className="text-sm font-medium">{label}</span>
      <span className="flex-1 truncate text-xs text-muted">{detail}</span>
    </div>
  );
}

export function ResourceRow({ label, value, max }: { label: string; value: number; max: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted">{value}% · {max}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-fg/5">
        <div className="h-full rounded-full bg-fg/60" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function MetaRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={clsx("text-right", mono && "font-mono text-[12px]")}>{value}</dd>
    </div>
  );
}

export function SettingsRow({ label, desc, children }: { label: string; desc?: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-sm font-medium">{label}</div>
      {desc && <div className="mt-0.5 text-xs text-muted">{desc}</div>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function Toggle({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {desc && <div className="mt-0.5 text-xs text-muted">{desc}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={clsx("relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors", value ? "bg-fg" : "bg-fg/15")}
      >
        <span className={clsx("absolute top-0.5 h-[18px] w-[18px] rounded-full bg-surface shadow-soft transition-transform", value ? "translate-x-[18px]" : "translate-x-0.5")} />
      </button>
    </label>
  );
}
