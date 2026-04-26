"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Activity, Database, Radar, Search, Sparkles, Upload } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { AreaChart } from "@/components/charts/AreaChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { BarChart } from "@/components/charts/BarChart";
import { useToast } from "@/components/toast/ToastProvider";
import { runActiveFeedsAction } from "@/modules/snaptld/actions";
import { CandidateRow } from "@/modules/snaptld/components/CandidateRow";
import { ImportDialog } from "@/modules/snaptld/components/ImportDialog";
import { AnalysisProgress } from "@/modules/snaptld/components/AnalysisProgress";
import { NewSinceBanner } from "@/modules/snaptld/components/NewSinceBanner";
import { SnapTldUserStateProvider } from "@/modules/snaptld/client/SnapTldUserStateProvider";
import { getActiveFeedCount, getOverviewStats, getRunningDomain, getTopCandidates, getVerdictDonut } from "@/modules/snaptld/selectors/overview";
import type { DomainAnalysis, FeedSource, SnapTldUserState } from "@/modules/snaptld/types";

export function SnapTLDOverviewPage({
  domains,
  feeds,
  scoreTrend,
  volumePerDay,
  initialUserState,
}: {
  domains: DomainAnalysis[];
  feeds: FeedSource[];
  scoreTrend: { label: string; value: number }[];
  volumePerDay: { label: string; value: number }[];
  initialUserState: SnapTldUserState;
}) {
  return (
    <SnapTldUserStateProvider initialState={initialUserState}>
      <SnapTLDOverviewPageContent domains={domains} feeds={feeds} scoreTrend={scoreTrend} volumePerDay={volumePerDay} />
    </SnapTldUserStateProvider>
  );
}

function EmptyState({
  icon,
  title,
  description,
  compact = false,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 text-center ${
        compact ? "min-h-[150px] py-8" : "min-h-[220px] py-10"
      }`}
    >
      <div className="mb-3 rounded-full border bg-surface p-2 text-muted shadow-soft">{icon}</div>
      <div className="text-sm font-medium tracking-tight">{title}</div>
      <p className="mt-1 max-w-sm text-xs leading-5 text-muted">{description}</p>
    </div>
  );
}

function SnapTLDOverviewPageContent({
  domains,
  feeds,
  scoreTrend,
  volumePerDay,
}: {
  domains: DomainAnalysis[];
  feeds: FeedSource[];
  scoreTrend: { label: string; value: number }[];
  volumePerDay: { label: string; value: number }[];
}) {
  const toast = useToast();
  const [importOpen, setImportOpen] = useState(false);
  const [runningFeeds, setRunningFeeds] = useState(false);

  const stats = useMemo(() => getOverviewStats(domains), [domains]);
  const topCandidates = useMemo(() => getTopCandidates(domains), [domains]);
  const verdictDonut = useMemo(() => getVerdictDonut(domains), [domains]);
  const activeFeeds = useMemo(() => getActiveFeedCount(feeds), [feeds]);
  const running = useMemo(() => getRunningDomain(domains), [domains]);
  const hasScoreTrend = scoreTrend.length > 0;
  const hasVolumePerDay = volumePerDay.length > 0;
  const hasTopCandidates = topCandidates.length > 0;
  const hasVerdictDonut = verdictDonut.length > 0;

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
            disabled={runningFeeds}
            onClick={async () => {
              try {
                setRunningFeeds(true);
                const result = await runActiveFeedsAction();
                toast.success(
                  "Feeds hämtade",
                  `${result.feeds} feeds · ${result.imported} importerade · ${result.duplicates} dubletter`,
                );
              } catch (error) {
                toast.error("Kunde inte hämta feeds", error instanceof Error ? error.message : "Okänt fel");
              } finally {
                setRunningFeeds(false);
              }
            }}
          >
            <Radar size={14} />
            {runningFeeds ? "Hämtar..." : "Kör alla feeds"}
          </Button>
          <Button className="gap-1.5" onClick={() => setImportOpen(true)}>
            <Upload size={14} />
            Importera
          </Button>
        </div>
      </div>

      <NewSinceBanner domains={domains} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Analyserade idag" value={String(stats.analyzedToday)} hint={`${stats.total} analyserade totalt`} />
        <StatCard label="Domäner i databasen" value={stats.totalDomains.toLocaleString("sv-SE")} hint="Importerade och köade" />
        <StatCard label="Importerade idag" value={stats.importedToday.toLocaleString("sv-SE")} hint="Från aktiva feeds" />
        <StatCard label="Aktiva feeds" value={`${activeFeeds}/${feeds.length}`} hint="Körs automatiskt" />
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
            {hasScoreTrend ? (
              <AreaChart data={scoreTrend} height={200} formatValue={(value) => `${value} p`} />
            ) : (
              <EmptyState icon={<Activity size={16} />} title="Ingen scorehistorik än" description="Kör analys på importerade domäner för att bygga upp trenden." />
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold tracking-tight">Utlåtandefördelning</h2>
          <p className="text-xs text-muted">Efter total-score</p>
          <div className="mt-6">
            {hasVerdictDonut ? (
              <DonutChart data={verdictDonut} size={150} />
            ) : (
              <EmptyState icon={<Sparkles size={16} />} title="Ingen fördelning" description="Utlåtanden visas när minst en domän har analyserats." compact />
            )}
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
            {hasTopCandidates ? (
              topCandidates.map((domain) => <CandidateRow key={domain.slug} domain={domain} />)
            ) : (
              <EmptyState icon={<Search size={16} />} title="Inga kandidater än" description="Importerade domäner behöver analyseras innan de kan rankas som kandidater." />
            )}
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
            {hasVolumePerDay ? (
              <BarChart data={volumePerDay} height={180} />
            ) : (
              <EmptyState icon={<Database size={16} />} title="Ingen analysvolym" description="Volymen visas per dag när analyser har slutförts." compact />
            )}
          </div>
        </Card>
      </div>

      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
