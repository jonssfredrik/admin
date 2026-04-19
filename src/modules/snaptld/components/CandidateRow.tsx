import Link from "next/link";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { ScoreBar } from "./ScoreBar";
import { VerdictBadge } from "./VerdictBadge";
import { ExpiryBadge } from "./ExpiryBadge";
import { WatchButton } from "./WatchButton";
import type { DomainAnalysis } from "@/modules/snaptld/data/core";

const tldStyles: Record<string, string> = {
  ".se": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  ".nu": "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  ".io": "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  ".com": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  ".net": "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export function CandidateRow({ domain }: { domain: DomainAnalysis }) {
  const tldClass = tldStyles[domain.tld] ?? "bg-fg/5 text-fg";
  return (
    <Link
      href={`/snaptld/${domain.slug}`}
      className="group flex items-center gap-4 rounded-xl border bg-surface p-3.5 transition-colors hover:bg-bg/60"
    >
      <div
        className={clsx(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-semibold",
          tldClass,
        )}
      >
        {domain.tld}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-semibold">{domain.domain}</span>
          <VerdictBadge verdict={domain.verdict} />
          <ExpiryBadge expiresAt={domain.expiresAt} />
        </div>
        <div className="mt-0.5 truncate text-xs text-muted">{domain.estimatedValue}</div>
      </div>
      <div className="w-40 shrink-0">
        <ScoreBar score={domain.totalScore} showValue />
      </div>
      <WatchButton slug={domain.slug} domain={domain.domain} variant="icon" />
      <ChevronRight size={16} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
