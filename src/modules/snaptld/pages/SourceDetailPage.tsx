"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, CalendarClock, ExternalLink, Globe } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { formatDateTime, formatFeedSchedule, formatMoneyRange } from "@/modules/snaptld/lib/format";
import type { FeedSource, ImportedDomainRecord, Verdict } from "@/modules/snaptld/types";

const verdictTone: Record<Verdict, "success" | "warning" | "danger" | "neutral"> = {
  excellent: "success",
  good: "success",
  mediocre: "warning",
  skip: "danger",
};

const verdictLabel: Record<Verdict, string> = {
  excellent: "Utmärkt",
  good: "Bra",
  mediocre: "Mediokra",
  skip: "Skippa",
};

const statusTone = {
  analyzed: "success",
  queued: "neutral",
  running: "warning",
  failed: "danger",
} as const;

const statusLabel = {
  analyzed: "Analyserad",
  queued: "Köad",
  running: "Körs",
  failed: "Fel",
} as const;

const feedStatusTone = {
  active: "success",
  paused: "neutral",
  error: "danger",
} as const;

const feedStatusLabel = {
  active: "Aktiv",
  paused: "Pausad",
  error: "Fel",
} as const;

interface Props {
  feed: FeedSource;
  domains: ImportedDomainRecord[];
}

export function SourceDetailPage({ feed, domains }: Props) {
  const stats = useMemo(() => {
    const total = domains.length;
    const analyzed = domains.filter((d) => d.status === "analyzed").length;
    const queued = domains.filter((d) => d.status === "queued").length;
    const running = domains.filter((d) => d.status === "running").length;
    const scored = domains.filter((d) => d.totalScore > 0);
    const avgScore =
      scored.length > 0
        ? Math.round(scored.reduce((sum, d) => sum + d.totalScore, 0) / scored.length)
        : 0;
    const verdicts: Record<Verdict, number> = { excellent: 0, good: 0, mediocre: 0, skip: 0 };
    domains.forEach((d) => {
      verdicts[d.verdict] += 1;
    });
    const batches = new Set(domains.map((d) => d.batchId)).size;
    return { total, analyzed, queued, running, avgScore, verdicts, batches };
  }, [domains]);

  const topDomains = useMemo(
    () => [...domains].sort((a, b) => b.totalScore - a.totalScore).slice(0, 25),
    [domains],
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/snaptld/sources"
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"
        >
          <ArrowLeft size={12} />
          Tillbaka till källor
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <PageHeader title={feed.name} subtitle={feed.url} />
        <div className="flex items-center gap-2">
          <Badge tone={feedStatusTone[feed.status]}>{feedStatusLabel[feed.status]}</Badge>
          <a
            href={feed.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-surface px-3.5 text-sm font-medium transition-colors hover:bg-bg"
          >
            <ExternalLink size={14} />
            Öppna feed
          </a>
        </div>
      </div>

      <Card>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-4">
          <div className="text-muted text-xs">TLD</div>
          <div className="font-medium">{feed.tld}</div>
          <div className="text-muted text-xs">Typ</div>
          <div className="font-medium uppercase">{feed.type}</div>
          <div className="text-muted text-xs">Kadens</div>
          <div className="inline-flex items-center gap-1.5 font-medium">
            <CalendarClock size={12} className="text-muted" />
            {formatFeedSchedule(feed.schedule)}
          </div>
          <div className="text-muted text-xs">Senaste hämtning</div>
          <div className="font-mono text-xs">{formatDateTime(feed.lastFetchedAt)}</div>
        </dl>
      </Card>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Totalt importerade" value={stats.total.toLocaleString("sv-SE")} hint={`${stats.batches} batcher`} />
        <StatCard label="Analyserade" value={stats.analyzed.toLocaleString("sv-SE")} hint={`${stats.queued} köade · ${stats.running} körs`} />
        <StatCard label="Snittpoäng" value={stats.avgScore > 0 ? String(stats.avgScore) : "—"} hint="Endast analyserade" />
        <StatCard label="Senaste körning" value={feed.domainsLastRun.toLocaleString("sv-SE")} hint="Hämtade i senaste run" />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(Object.keys(stats.verdicts) as Verdict[]).map((key) => (
          <Card key={key} className="flex items-center justify-between gap-3 py-3">
            <div>
              <div className="text-xs text-muted">{verdictLabel[key]}</div>
              <div className="text-xl font-semibold tabular-nums">
                {stats.verdicts[key].toLocaleString("sv-SE")}
              </div>
            </div>
            <Badge tone={verdictTone[key]}>{Math.round((stats.verdicts[key] / Math.max(1, stats.total)) * 100)}%</Badge>
          </Card>
        ))}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight">Toppdomäner från denna källa</h2>
          {domains.length > topDomains.length && (
            <span className="text-xs text-muted">Visar topp {topDomains.length} av {domains.length}</span>
          )}
        </div>
        {domains.length === 0 ? (
          <Card className="flex items-center gap-3 text-sm text-muted">
            <Globe size={14} />
            Inga importerade domäner ännu från denna källa.
          </Card>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Domän</Th>
                <Th>Status</Th>
                <Th>Omdöme</Th>
                <Th className="text-right">Poäng</Th>
                <Th className="text-right">Värde</Th>
                <Th>Importerad</Th>
                <Th>Batch</Th>
              </tr>
            </thead>
            <tbody>
              {topDomains.map((domain) => (
                <tr key={domain.slug} className="hover:bg-bg/40">
                  <Td className="font-medium">
                    <Link href={`/snaptld/${domain.slug}`} className="hover:underline">
                      {domain.domain}
                    </Link>
                  </Td>
                  <Td>
                    <Badge tone={statusTone[domain.status]}>{statusLabel[domain.status]}</Badge>
                  </Td>
                  <Td>
                    <Badge tone={verdictTone[domain.verdict]}>{verdictLabel[domain.verdict]}</Badge>
                  </Td>
                  <Td className={clsx("text-right tabular-nums", domain.totalScore >= 80 && "font-semibold")}>
                    {domain.totalScore || "—"}
                  </Td>
                  <Td className="text-right tabular-nums text-xs text-muted">
                    {domain.estimatedValue.max > 0 ? formatMoneyRange(domain.estimatedValue) : "—"}
                  </Td>
                  <Td className="font-mono text-xs text-muted">{formatDateTime(domain.importedAt)}</Td>
                  <Td className="font-mono text-xs text-muted">{domain.batchId}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>
    </div>
  );
}
