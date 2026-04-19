import { Card } from "@/components/ui/Card";
import { ScoreBar } from "@/modules/snaptld/components/ScoreBar";
import { SignalList } from "@/modules/snaptld/components/SignalList";
import type { DomainAnalysis } from "@/modules/snaptld/data/core";

function MozStat({ label, value, max = 100, hint }: { label: string; value: number; max?: number; hint?: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <Card>
      <div className="text-xs font-medium uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <div className="text-2xl font-semibold tabular-nums">{value.toLocaleString("sv-SE")}</div>
        {max === 100 && <div className="text-xs text-muted">/ {max}</div>}
      </div>
      {max === 100 ? (
        <div className="mt-3">
          <ScoreBar score={pct} thick />
        </div>
      ) : null}
      {hint && <div className="mt-2 text-xs text-muted">{hint}</div>}
    </Card>
  );
}

export function SeoTab({ domain }: { domain: DomainAnalysis }) {
  const { seo } = domain;
  const cat = domain.categories.seo;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MozStat label="Domain Authority" value={seo.domainAuthority} hint="Moz DA" />
        <MozStat label="Page Authority" value={seo.pageAuthority} hint="Moz PA" />
        <MozStat label="Backlinks" value={seo.backlinks} max={Math.max(seo.backlinks, 1000)} hint="Totalt" />
        <MozStat label="Refererande domäner" value={seo.referringDomains} max={Math.max(seo.referringDomains, 100)} />
        <MozStat label="Spam-poäng" value={seo.spamScore} hint={seo.spamScore > 10 ? "Förhöjd — granska" : "Låg risk"} />
      </div>

      <Card className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">SEO-signaler</h2>
          <p className="text-xs text-muted">Integrerade från Moz API</p>
        </div>
        <SignalList signals={cat.signals} />
      </Card>
    </div>
  );
}
