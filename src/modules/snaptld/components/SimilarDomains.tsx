import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ScoreBar } from "./ScoreBar";
import { VerdictBadge } from "./VerdictBadge";
import { domainAnalyses, type DomainAnalysis } from "@/modules/snaptld/data/core";

function rootName(domain: string): string {
  return domain.split(".")[0];
}

function similarity(a: DomainAnalysis, b: DomainAnalysis): number {
  let score = 0;
  if (a.tld === b.tld) score += 40;
  const lenDiff = Math.abs(rootName(a.domain).length - rootName(b.domain).length);
  score += Math.max(0, 25 - lenDiff * 5);
  if (a.verdict === b.verdict) score += 20;
  const scoreDiff = Math.abs(a.totalScore - b.totalScore);
  score += Math.max(0, 15 - scoreDiff * 0.5);
  return score;
}

export function SimilarDomains({ domain }: { domain: DomainAnalysis }) {
  const others = domainAnalyses.filter((d) => d.slug !== domain.slug);
  const ranked = others
    .map((d) => ({ d, s: similarity(domain, d) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 4)
    .map((x) => x.d);

  if (ranked.length === 0) return null;

  return (
    <Card>
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-muted" />
        <h3 className="text-sm font-semibold">Liknande domäner</h3>
        <span className="ml-auto text-[11px] text-muted">Baserat på TLD, längd och verdict</span>
      </div>
      <div className="mt-3 divide-y">
        {ranked.map((d) => (
          <Link
            key={d.slug}
            href={`/snaptld/${d.slug}`}
            className="group flex items-center gap-3 py-2.5 transition-colors"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fg/5 font-mono text-[10px] font-semibold">
              {d.tld}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">{d.domain}</span>
                <VerdictBadge verdict={d.verdict} />
              </div>
              <div className="truncate text-[11px] text-muted">{d.estimatedValue}</div>
            </div>
            <div className="w-28 shrink-0">
              <ScoreBar score={d.totalScore} showValue />
            </div>
            <ArrowRight size={14} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </Card>
  );
}
