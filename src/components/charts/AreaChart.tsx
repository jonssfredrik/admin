"use client";

import { useMemo, useState } from "react";

interface Props {
  data: { label: string; value: number }[];
  height?: number;
  formatValue?: (v: number) => string;
}

export function AreaChart({ data, height = 220, formatValue = (v) => v.toLocaleString("sv-SE") }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 800;
  const padX = 16;
  const padY = 20;

  const { path, area, points, max, min } = useMemo(() => {
    const values = data.map((d) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const span = max - min || 1;
    const stepX = (width - padX * 2) / Math.max(data.length - 1, 1);

    const points = data.map((d, i) => ({
      x: padX + i * stepX,
      y: padY + (1 - (d.value - min) / span) * (height - padY * 2),
      ...d,
    }));

    const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const area = `${path} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`;
    return { path, area, points, max, min };
  }, [data, height]);

  const activePoint = hover !== null ? points[hover] : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - rect.left) / rect.width) * width;
          let nearest = 0;
          let best = Infinity;
          points.forEach((p, i) => {
            const d = Math.abs(p.x - px);
            if (d < best) {
              best = d;
              nearest = i;
            }
          });
          setHover(nearest);
        }}
      >
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--fg))" stopOpacity="0.12" />
            <stop offset="100%" stopColor="rgb(var(--fg))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={padX}
            x2={width - padX}
            y1={padY + t * (height - padY * 2)}
            y2={padY + t * (height - padY * 2)}
            stroke="rgb(var(--border))"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
        ))}

        <path d={area} fill="url(#area-fill)" />
        <path d={path} fill="none" stroke="rgb(var(--fg))" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />

        {activePoint && (
          <>
            <line
              x1={activePoint.x}
              x2={activePoint.x}
              y1={padY}
              y2={height - padY}
              stroke="rgb(var(--border))"
              strokeWidth={1}
            />
            <circle cx={activePoint.x} cy={activePoint.y} r={4} fill="rgb(var(--surface))" stroke="rgb(var(--fg))" strokeWidth={2} />
          </>
        )}
      </svg>

      <div className="mt-2 flex justify-between px-2 text-[11px] text-muted">
        {data.map((d, i) => (
          <span key={i} className={i % Math.ceil(data.length / 7) === 0 ? "" : "opacity-0"}>
            {d.label}
          </span>
        ))}
      </div>

      {activePoint && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border bg-surface px-2.5 py-1.5 text-xs shadow-pop"
          style={{ left: `${(activePoint.x / width) * 100}%`, top: `${(activePoint.y / height) * 100}%` }}
        >
          <div className="text-[10px] uppercase tracking-wider text-muted">{activePoint.label}</div>
          <div className="font-semibold tabular-nums">{formatValue(activePoint.value)}</div>
        </div>
      )}

      <div className="sr-only">
        Max: {max}, Min: {min}
      </div>
    </div>
  );
}
