"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Minus, RotateCcw, Save } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { defaultWeightsYaml } from "@/modules/snaptld/data/weights";
import { categoryMeta, domainAnalyses, type AnalysisCategory, type DomainAnalysis } from "@/modules/snaptld/data/core";
import { ScoreBar } from "@/modules/snaptld/components/ScoreBar";

function parseWeights(yaml: string): Partial<Record<AnalysisCategory, number>> {
  const out: Partial<Record<AnalysisCategory, number>> = {};
  const match = yaml.match(/weights:\s*([\s\S]*?)(?:\n\w|$)/);
  if (!match) return out;
  const keys: AnalysisCategory[] = [
    "structure", "lexical", "brand", "market", "risk", "salability", "seo", "history",
  ];
  for (const key of keys) {
    const re = new RegExp(`\\n\\s+${key}:\\s*(\\d+(?:\\.\\d+)?)`, "i");
    const m = match[1].match(re);
    if (m) out[key] = parseFloat(m[1]);
  }
  return out;
}

const ALL_KEYS: AnalysisCategory[] = [
  "structure", "lexical", "brand", "market", "risk", "salability", "seo", "history",
];

function weightedScore(domain: DomainAnalysis, weights: Partial<Record<AnalysisCategory, number>>): number {
  const sum = ALL_KEYS.reduce((s, k) => s + (weights[k] ?? 0), 0) || 1;
  const acc = ALL_KEYS.reduce((s, k) => s + domain.categories[k].score * (weights[k] ?? 0), 0);
  return Math.round(acc / sum);
}

interface RankRow {
  slug: string;
  domain: string;
  currentScore: number;
  nextScore: number;
  currentRank: number;
  nextRank: number;
}

function buildRanking(
  current: Partial<Record<AnalysisCategory, number>>,
  next: Partial<Record<AnalysisCategory, number>>,
): RankRow[] {
  const currentScored = domainAnalyses.map((d) => ({ d, score: weightedScore(d, current) }));
  const nextScored = domainAnalyses.map((d) => ({ d, score: weightedScore(d, next) }));
  const currentOrder = [...currentScored].sort((a, b) => b.score - a.score).map((x) => x.d.slug);
  const nextOrder = [...nextScored].sort((a, b) => b.score - a.score).map((x) => x.d.slug);

  return nextScored
    .map(({ d, score }) => ({
      slug: d.slug,
      domain: d.domain,
      currentScore: currentScored.find((x) => x.d.slug === d.slug)!.score,
      nextScore: score,
      currentRank: currentOrder.indexOf(d.slug) + 1,
      nextRank: nextOrder.indexOf(d.slug) + 1,
    }))
    .sort((a, b) => a.nextRank - b.nextRank);
}

export function WeightsPage() {
  const toast = useToast();
  const [yaml, setYaml] = useState(defaultWeightsYaml);
  const [saved, setSaved] = useState(defaultWeightsYaml);

  const weights = parseWeights(yaml);
  const total = Object.values(weights).reduce((s, v) => s + (v ?? 0), 0) || 1;
  const savedWeights = useMemo(() => parseWeights(saved), [saved]);
  const ranking = useMemo(() => buildRanking(savedWeights, weights), [savedWeights, weights]);
  const dirty = yaml !== saved;
  const movers = ranking.filter((r) => r.currentRank !== r.nextRank).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Scoring-vikter"
          subtitle="Anpassa hur totalpoängen beräknas via YAML-konfiguration."
        />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="gap-1.5"
            onClick={() => {
              setYaml(defaultWeightsYaml);
              toast.info("Återställd", "Standardvikter laddade");
            }}
          >
            <RotateCcw size={14} />
            Återställ
          </Button>
          <Button
            className="gap-1.5"
            disabled={yaml === saved}
            onClick={() => {
              setSaved(yaml);
              toast.success("Sparat", "Vikterna tillämpas vid nästa analys");
            }}
          >
            <Save size={14} />
            Spara
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3 p-0">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <div className="text-sm font-semibold">weights.yml</div>
            <div className="font-mono text-[11px] text-muted">{yaml.split("\n").length} rader</div>
          </div>
          <textarea
            value={yaml}
            onChange={(e) => setYaml(e.target.value)}
            spellCheck={false}
            className="h-[480px] w-full resize-none bg-transparent px-5 py-4 font-mono text-xs leading-relaxed outline-none"
          />
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold tracking-tight">Förhandsvisning</h2>
          <p className="text-xs text-muted">Viktfördelning normaliserad till 100%</p>
          <div className="mt-4 space-y-3">
            {(Object.keys(categoryMeta) as AnalysisCategory[]).map((key) => {
              const w = weights[key] ?? 0;
              const pct = Math.round((w / total) * 100);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{categoryMeta[key].label}</span>
                    <span className="font-mono tabular-nums text-muted">{pct}%</span>
                  </div>
                  <div className="mt-1">
                    <ScoreBar score={pct * 3} tone="neutral" />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-lg border bg-bg/40 p-3 text-xs text-muted">
            Ändringar tillämpas på alla nya analyser. Befintliga poäng räknas om när du klickar "Kör om" i analyskön.
          </div>
        </Card>
      </div>

      <Card className="p-0">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div>
            <div className="text-sm font-semibold">Dry-run: ny rangordning</div>
            <div className="text-xs text-muted">
              {dirty
                ? `${movers} av ${ranking.length} domäner byter placering med de nya vikterna`
                : "Inga osparade ändringar — visar aktuell rangordning"}
            </div>
          </div>
        </div>
        <div className="divide-y">
          {ranking.map((r) => {
            const delta = r.currentRank - r.nextRank;
            const scoreDelta = r.nextScore - r.currentScore;
            return (
              <div key={r.slug} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                <div className="w-8 font-mono text-xs font-semibold tabular-nums">#{r.nextRank}</div>
                <div className="min-w-0 flex-1 truncate font-medium">{r.domain}</div>
                <div className="flex w-24 items-center justify-end gap-1 text-xs">
                  {delta === 0 ? (
                    <span className="inline-flex items-center gap-1 text-muted">
                      <Minus size={11} /> oförändrad
                    </span>
                  ) : delta > 0 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <ArrowUp size={11} /> +{delta}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                      <ArrowDown size={11} /> {delta}
                    </span>
                  )}
                </div>
                <div className="w-32 shrink-0">
                  <ScoreBar score={r.nextScore} showValue />
                </div>
                <div
                  className={clsx(
                    "w-14 text-right font-mono text-[11px] tabular-nums",
                    scoreDelta > 0 && "text-emerald-600 dark:text-emerald-400",
                    scoreDelta < 0 && "text-red-600 dark:text-red-400",
                    scoreDelta === 0 && "text-muted",
                  )}
                >
                  {scoreDelta > 0 ? "+" : ""}
                  {scoreDelta}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
