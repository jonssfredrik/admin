import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ScoreBar } from "./ScoreBar";
import { VerdictBadge } from "./VerdictBadge";
import type { DomainAnalysis } from "@/modules/snaptld/types";
import { getSimilarDomains } from "@/modules/snaptld/selectors/similar-domains";
import { formatMoneyRange } from "@/modules/snaptld/lib/format";

export function SimilarDomains({ domain, domains }: { domain: DomainAnalysis; domains: DomainAnalysis[] }) {
  const ranked = getSimilarDomains(domain, domains);

  if (ranked.length === 0) return null;

  return (
    <Card>
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-muted" />
        <h3 className="text-sm font-semibold">Liknande domäner</h3>
        <span className="ml-auto text-[11px] text-muted">Baserat på TLD, längd och verdict</span>
      </div>
      <div className="mt-3 divide-y">
        {ranked.map((candidate) => (
          <Link
            key={candidate.slug}
            href={`/snaptld/${candidate.slug}`}
            className="group flex items-center gap-3 py-2.5 transition-colors"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fg/5 font-mono text-[10px] font-semibold">
              {candidate.tld}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">{candidate.domain}</span>
                <VerdictBadge verdict={candidate.verdict} />
              </div>
              <div className="truncate text-[11px] text-muted">{formatMoneyRange(candidate.estimatedValue)}</div>
            </div>
            <div className="w-28 shrink-0">
              <ScoreBar score={candidate.totalScore} showValue />
            </div>
            <ArrowRight size={14} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </Card>
  );
}
