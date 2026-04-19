"use client";

import { useMemo, useState } from "react";
import { Activity, Database, Radar, Sparkles, Upload } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { AreaChart } from "@/components/charts/AreaChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { BarChart } from "@/components/charts/BarChart";
import { useToast } from "@/components/toast/ToastProvider";
import {
  domainAnalyses,
  scoreTrend,
  volumePerDay,
  verdictMeta,
  type Verdict,
} from "@/modules/snaptld/data/core";
import { feedSources } from "@/modules/snaptld/data/feeds";
import { CandidateRow } from "@/modules/snaptld/components/CandidateRow";
import { ImportDialog } from "@/modules/snaptld/components/ImportDialog";
import { AnalysisProgress } from "@/modules/snaptld/components/AnalysisProgress";
import { NewSinceBanner } from "@/modules/snaptld/components/NewSinceBanner";

const verdictColors: Record<Verdict, string> = {
  excellent: "#10b981",
  good: "#34d399",
  mediocre: "#f59e0b",
  skip: "#ef4444",
};

export function SnapTLDOverviewPage() {
  const toast = useToast();
  const [importOpen, setImportOpen] = useState(false);

  const stats = useMemo(() => {
    const total = domainAnalyses.length;
    const excellent = domainAnalyses.filter((d) => d.verdict === "excellent").length;
    const good = domainAnalyses.filter((d) => d.verdict === "good").length;
    const avg = Math.round(
      domainAnalyses.reduce((s, d) => s + d.totalScore, 0) / Math.max(total, 1),
    );
    return { total, excellent, good, avg };
  }, []);

  const topCandidates = [...domainAnalyses]
    .filter((d) => d.status === "analyzed")
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 5);

  const verdictDonut = (["excellent", "good", "mediocre", "skip"] as Verdict[]).map((v) => ({
    label: verdictMeta[v].label,
    value: domainAnalyses.filter((d) => d.verdict === v).length,
    color: verdictColors[v],
  })).filter((s) => s.value > 0);

  const activeFeeds = feedSources.filter((f) => f.status === "active").length;
  const running = domainAnalyses.find((d) => d.status === "running");

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="SnapTLD"
          subtitle="Analyserar och poängsätter nyligen utgångna domäner för att hitta återregistreringsvärde."
        />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="gap-1.5"
            onClick={() => toast.info("Hämtar alla feeds", "Detta kan ta några minuter")}
          >
            <Radar size={14} />
            Kör alla feeds
          </Button>
          <Button className="gap-1.5" onClick={() => setImportOpen(true)}>
            <Upload size={14} />
            Importera
          </Button>
        </div>
      </div>

      <NewSinceBanner />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Analyserade idag" value={String(stats.total)} delta={12} hint="Över alla källor" />
        <StatCard label="Topp-kandidater" value={String(stats.excellent + stats.good)} delta={8} hint={`${stats.excellent} utmärkta · ${stats.good} bra`} />
        <StatCard label="Snittscore" value={String(stats.avg)} delta={3} hint="Av 100" />
        <StatCard label="Aktiva feeds" value={`${activeFeeds}/${feedSources.length}`} hint="Körs automatiskt" />
      </div>

      {running && (
        <AnalysisProgress completed={5} />
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Snittscore över tid</h2>
              <p className="text-xs text-muted">Rullande 7-dagars medelvärde</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Activity size={13} />
              Senaste 8 dagarna
            </div>
          </div>
          <div className="mt-4">
            <AreaChart data={scoreTrend} height={200} formatValue={(v) => `${v} p`} />
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold tracking-tight">Utlåtandefördelning</h2>
          <p className="text-xs text-muted">Efter total-score</p>
          <div className="mt-6">
            <DonutChart data={verdictDonut} size={150} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Topp-kandidater</h2>
              <p className="text-xs text-muted">Senast analyserade med högst score</p>
            </div>
            <Sparkles size={14} className="text-muted" />
          </div>
          <div className="mt-4 space-y-2">
            {topCandidates.map((d) => (
              <CandidateRow key={d.slug} domain={d} />
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Volym per dag</h2>
              <p className="text-xs text-muted">Analyserade domäner</p>
            </div>
            <Database size={14} className="text-muted" />
          </div>
          <div className="mt-6">
            <BarChart data={volumePerDay} height={180} />
          </div>
        </Card>
      </div>

      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
