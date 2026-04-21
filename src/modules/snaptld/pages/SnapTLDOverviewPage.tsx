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
import { domainAnalyses, scoreTrend, volumePerDay } from "@/modules/snaptld/data/core";
import { feedSources } from "@/modules/snaptld/data/feeds";
import { CandidateRow } from "@/modules/snaptld/components/CandidateRow";
import { ImportDialog } from "@/modules/snaptld/components/ImportDialog";
import { AnalysisProgress } from "@/modules/snaptld/components/AnalysisProgress";
import { NewSinceBanner } from "@/modules/snaptld/components/NewSinceBanner";
import { getActiveFeedCount, getOverviewStats, getRunningDomain, getTopCandidates, getVerdictDonut } from "@/modules/snaptld/selectors/overview";

export function SnapTLDOverviewPage() {
  const toast = useToast();
  const [importOpen, setImportOpen] = useState(false);

  const stats = useMemo(() => getOverviewStats(domainAnalyses), []);
  const topCandidates = useMemo(() => getTopCandidates(domainAnalyses), []);
  const verdictDonut = useMemo(() => getVerdictDonut(domainAnalyses), []);
  const activeFeeds = useMemo(() => getActiveFeedCount(feedSources), []);
  const running = useMemo(() => getRunningDomain(domainAnalyses), []);

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

      {running && <AnalysisProgress completed={5} />}

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
            <AreaChart data={scoreTrend} height={200} formatValue={(value) => `${value} p`} />
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
            {topCandidates.map((domain) => (
              <CandidateRow key={domain.slug} domain={domain} />
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
