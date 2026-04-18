"use client";

interface Props {
  data: { label: string; value: number }[];
  height?: number;
}

export function BarChart({ data, height = 180 }: Props) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 24);
        return (
          <div key={i} className="group flex flex-1 flex-col items-center gap-1.5">
            <div className="relative w-full flex-1 flex items-end">
              <div
                className="w-full rounded-md bg-fg/10 transition-colors group-hover:bg-fg/80"
                style={{ height: `${h}px` }}
              />
              <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md border bg-surface px-1.5 py-0.5 text-[11px] font-medium opacity-0 shadow-soft transition-opacity group-hover:opacity-100 tabular-nums">
                {d.value.toLocaleString("sv-SE")}
              </div>
            </div>
            <span className="text-[11px] text-muted">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
