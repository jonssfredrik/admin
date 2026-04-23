"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Minus, RotateCcw, Save } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { categoryMeta, type AnalysisCategory } from "@/modules/snaptld/data/core";
import { ScoreBar } from "@/modules/snaptld/components/ScoreBar";
import {
  buildWeightRanking,
  getWeightEntries,
  parseWeightsConfig,
  updateWeightInYaml,
} from "@/modules/snaptld/selectors/weights";
import { resetWeightsAction, saveWeightsAction } from "@/modules/snaptld/actions";
import { useAsyncAction } from "@/modules/snaptld/lib/useAsyncAction";
import type { DomainAnalysis } from "@/modules/snaptld/types";

export function WeightsPage({
  domains,
  initialYaml,
}: {
  domains: DomainAnalysis[];
  initialYaml: string;
}) {
  const toast = useToast();
  const saveAction = useAsyncAction();
  const resetAction = useAsyncAction();
  const [savedYaml, setSavedYaml] = useState(initialYaml);
  const [yaml, setYaml] = useState(initialYaml);

  const draftConfig = useMemo(() => parseWeightsConfig(yaml), [yaml]);
  const appliedConfig = useMemo(() => parseWeightsConfig(savedYaml), [savedYaml]);
  const weightEntries = useMemo(() => getWeightEntries(draftConfig.weights), [draftConfig.weights]);
  const ranking = useMemo(
    () => buildWeightRanking(domains, appliedConfig.weights, draftConfig.weights),
    [domains, appliedConfig.weights, draftConfig.weights],
  );
  const dirty = yaml !== savedYaml;
  const movers = ranking.filter((row) => row.currentRank !== row.nextRank).length;

  const handleReset = async () => {
    try {
      const next = await resetAction.run(() => resetWeightsAction());
      setSavedYaml(next);
      setYaml(next);
      toast.info("Återställd", "Standardvikter laddade");
    } catch (error) {
      toast.error("Kunde inte återställa vikter", error instanceof Error ? error.message : "Försök igen");
    }
  };

  const handleSave = async () => {
    try {
      const next = await saveAction.run(() => saveWeightsAction(yaml));
      setSavedYaml(next);
      setYaml(next);
      toast.success("Sparat", "Det aktiva utkastet är nu sparat på serversidan");
    } catch (error) {
      toast.error("Kunde inte spara vikter", error instanceof Error ? error.message : "Försök igen");
    }
  };

  const handleWeightChange = (key: AnalysisCategory, nextValue: number) => {
    setYaml((current) => updateWeightInYaml(current, key, nextValue));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Scoring-vikter"
          subtitle="Anpassa viktkonfigurationen som styr scoring och preview."
        />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="gap-1.5"
            disabled={resetAction.isPending}
            onClick={handleReset}
          >
            <RotateCcw size={14} />
            {resetAction.isPending ? "Återställer..." : "Återställ"}
          </Button>
          <Button
            className="gap-1.5"
            disabled={yaml === savedYaml || saveAction.isPending}
            onClick={handleSave}
          >
            <Save size={14} />
            {saveAction.isPending ? "Sparar..." : "Spara"}
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
            onChange={(event) => setYaml(event.target.value)}
            spellCheck={false}
            className="h-[480px] w-full resize-none bg-transparent px-5 py-4 font-mono text-xs leading-relaxed outline-none"
          />
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold tracking-tight">Förhandsvisning</h2>
          <p className="text-xs text-muted">Dra i reglagen för att justera vikterna direkt i utkastet</p>
          <div className="mt-4 space-y-3">
            {weightEntries.map(({ key, pct, value }) => (
              <div key={key}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{categoryMeta[key as AnalysisCategory].label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular-nums text-muted">{value}</span>
                    <span className="font-mono tabular-nums text-muted">{pct}%</span>
                  </div>
                </div>
                <div className="mt-1">
                  <ScoreBar score={pct * 3} tone="neutral" />
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={1}
                  value={value}
                  disabled={saveAction.isPending || resetAction.isPending}
                  onChange={(event) => handleWeightChange(key, Number(event.target.value))}
                  className="mt-2 w-full accent-fg"
                  aria-label={`Justera vikt för ${categoryMeta[key as AnalysisCategory].label}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border bg-bg/40 p-3 text-xs text-muted">
            Spara uppdaterar det serverförberedda viktutkastet. Ingen extern backend krävs ännu.
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
                : "Inga osparade ändringar, visar aktuell rangordning"}
            </div>
          </div>
        </div>
        <div className="divide-y">
          {ranking.map((row) => {
            const delta = row.currentRank - row.nextRank;
            const scoreDelta = row.nextScore - row.currentScore;
            return (
              <div key={row.slug} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                <div className="w-8 font-mono text-xs font-semibold tabular-nums">#{row.nextRank}</div>
                <div className="min-w-0 flex-1 truncate font-medium">{row.domain}</div>
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
                  <ScoreBar score={row.nextScore} showValue />
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
