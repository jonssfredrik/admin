import clsx from "clsx";
import { toneForScore, type Tone } from "@/modules/snaptld/data/core";

const fills: Record<Tone, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  neutral: "bg-fg/40",
};

interface Props {
  score: number;
  showValue?: boolean;
  thick?: boolean;
  tone?: Tone;
}

export function ScoreBar({ score, showValue, thick, tone }: Props) {
  const resolved = tone ?? toneForScore(score);
  return (
    <div className="flex items-center gap-2">
      <div className={clsx("flex-1 overflow-hidden rounded-full bg-fg/5", thick ? "h-2" : "h-1")}>
        <div
          className={clsx("h-full rounded-full transition-all", fills[resolved])}
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </div>
      {showValue && (
        <span className="w-9 text-right font-mono text-xs tabular-nums text-muted">{score}</span>
      )}
    </div>
  );
}

export function BigScoreRing({ score }: { score: number }) {
  const radius = 44;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;
  const tone = toneForScore(score);
  const stroke = tone === "success"
    ? "#10b981"
    : tone === "warning"
      ? "#f59e0b"
      : tone === "danger"
        ? "#ef4444"
        : "rgb(var(--fg) / 0.4)";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={110} height={110} className="-rotate-90">
        <circle cx={55} cy={55} r={radius} fill="none" stroke="rgb(var(--border))" strokeWidth={8} />
        <circle
          cx={55}
          cy={55}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold tabular-nums tracking-tight">{score}</div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted">av 100</div>
      </div>
    </div>
  );
}
