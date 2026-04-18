"use client";

import { useState } from "react";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AreaChart } from "./AreaChart";

const ranges = {
  "7d": {
    label: "7 dagar",
    data: [
      { label: "Mån", value: 4200 },
      { label: "Tis", value: 4800 },
      { label: "Ons", value: 4500 },
      { label: "Tor", value: 6100 },
      { label: "Fre", value: 7300 },
      { label: "Lör", value: 6800 },
      { label: "Sön", value: 7900 },
    ],
  },
  "30d": {
    label: "30 dagar",
    data: Array.from({ length: 30 }, (_, i) => ({
      label: `${i + 1}`,
      value: Math.round(4000 + Math.sin(i / 3) * 1200 + i * 80 + Math.cos(i * 1.7) * 300),
    })),
  },
  "90d": {
    label: "90 dagar",
    data: Array.from({ length: 12 }, (_, i) => ({
      label: `V${i + 1}`,
      value: Math.round(28000 + Math.sin(i / 2) * 6000 + i * 1200),
    })),
  },
} as const;

type Range = keyof typeof ranges;

export function RevenueCard() {
  const [range, setRange] = useState<Range>("30d");
  const data = ranges[range].data;
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Intäkter</div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <div className="text-2xl font-semibold tracking-tight tabular-nums">
              {total.toLocaleString("sv-SE")} kr
            </div>
            <div className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight size={12} />
              12.4%
            </div>
          </div>
        </div>
        <div className="flex rounded-lg border bg-bg p-0.5">
          {(Object.keys(ranges) as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={clsx(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                range === r ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
              )}
            >
              {ranges[r].label}
            </button>
          ))}
        </div>
      </div>

      <AreaChart data={data} formatValue={(v) => `${v.toLocaleString("sv-SE")} kr`} />
    </Card>
  );
}
