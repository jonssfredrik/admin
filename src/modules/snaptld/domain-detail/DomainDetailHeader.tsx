"use client";

import Link from "next/link";
import clsx from "clsx";
import { AlertTriangle, ArrowLeft, Download, ExternalLink, RefreshCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BigScoreRing } from "@/modules/snaptld/components/ScoreBar";
import { VerdictBadge } from "@/modules/snaptld/components/VerdictBadge";
import { WatchButton } from "@/modules/snaptld/components/WatchButton";
import { ExpiryBadge } from "@/modules/snaptld/components/ExpiryBadge";
import type { DomainAnalysis } from "@/modules/snaptld/types";
import { useToast } from "@/components/toast/ToastProvider";
import { formatMoneyRange, formatRelativeDaysSince } from "@/modules/snaptld/lib/format";
import { isIisSource, iisLifecycleDates, iisPhaseInfo } from "@/modules/snaptld/lib/iis-lifecycle";

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

const phaseLabels: Record<string, string> = {
  active: "Aktiv",
  expired: "Utgången",
  deactivated: "Deaktiverad",
  deregistered: "Avregistreras",
  released: "Frisläppt",
};

const phaseTones: Record<string, string> = {
  active: "text-muted",
  expired: "text-amber-600 dark:text-amber-400",
  deactivated: "text-amber-600 dark:text-amber-400",
  deregistered: "text-red-600 dark:text-red-400",
  released: "text-emerald-600 dark:text-emerald-400",
};

// A step is "done" once we've passed that transition date.
const stepDoneWhen: Record<string, string[]> = {
  expiresAt:      ["expired", "deactivated", "deregistered", "released"],
  deactivatedAt:  ["deactivated", "deregistered", "released"],
  deregisteredAt: ["deregistered", "released"],
  releasedAt:     ["released"],
};

function IisLifecycleTimeline({ releasedAt }: { releasedAt: string }) {
  const { phase } = iisPhaseInfo(releasedAt);
  const dates = iisLifecycleDates(releasedAt);

  const steps: Array<{ dateKey: keyof typeof dates; label: string }> = [
    { dateKey: "expiresAt",      label: "Förfaller" },
    { dateKey: "deactivatedAt",  label: "Deaktiveras" },
    { dateKey: "deregisteredAt", label: "Avregistreras" },
    { dateKey: "releasedAt",     label: "Frisläpps" },
  ];

  let nextMarked = false;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {steps.map((step, i) => {
        const done = stepDoneWhen[step.dateKey]?.includes(phase) ?? false;
        const isNext = !done && !nextMarked;
        if (isNext) nextMarked = true;

        return (
          <div key={step.dateKey} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-border">›</span>}
            <div className={clsx(
              "text-xs",
              done && "text-muted line-through opacity-50",
              isNext && clsx("font-medium", phaseTones[phase]),
              !done && !isNext && "text-muted",
            )}>
              <span className="opacity-70">{step.label}: </span>
              <span className="font-mono">{dates[step.dateKey]}</span>
            </div>
          </div>
        );
      })}
      <span className={clsx("text-xs font-medium", phaseTones[phase])}>
        — {phaseLabels[phase]}
      </span>
    </div>
  );
}

export function DomainDetailHeader({ domain, onRerun }: { domain: DomainAnalysis; onRerun?: () => void }) {
  const toast = useToast();
  const age = daysSince(domain.fetchedAt);
  const stale = age >= 7;
  const isIis = isIisSource(domain.source);

  return (
    <div className="space-y-4">
      <Link
        href="/snaptld/queue"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg"
      >
        <ArrowLeft size={13} />
        Tillbaka till analyskö
      </Link>

      <Card className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <BigScoreRing score={domain.totalScore} maxScore={domain.scoreMax} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{domain.domain}</h1>
              <VerdictBadge verdict={domain.verdict} size="md" />
              <ExpiryBadge expiresAt={domain.expiresAt} source={domain.source} variant="long" />
            </div>
            <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
              <div>
                <dt className="inline">Källa: </dt>
                <dd className="inline font-medium capitalize text-fg">{domain.source.replace("-", " ")}</dd>
              </div>
              {isIis ? (
                <div className="w-full mt-0.5">
                  <IisLifecycleTimeline releasedAt={domain.expiresAt} />
                </div>
              ) : (
                <div>
                  <dt className="inline">Utgår: </dt>
                  <dd className="inline font-mono text-fg">{domain.expiresAt}</dd>
                </div>
              )}
              <div>
                <dt className="inline">Senast analyserad: </dt>
                <dd
                  className={clsx(
                    "inline font-mono",
                    stale ? "text-amber-600 dark:text-amber-400" : "text-fg",
                  )}
                >
                  {domain.fetchedAt} ({formatRelativeDaysSince(domain.fetchedAt)})
                </dd>
              </div>
              <div>
                <dt className="inline">Uppskattat värde: </dt>
                <dd className="inline font-medium text-fg">{formatMoneyRange(domain.estimatedValue)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={stale ? "primary" : "secondary"}
            className="gap-1.5"
            onClick={() => {
              onRerun?.();
              toast.info("Analys kölagd", domain.domain);
            }}
          >
            {stale ? <AlertTriangle size={14} /> : <RefreshCcw size={14} />}
            {stale ? "Kör om (inaktuell)" : "Kör om"}
          </Button>
          <Button variant="secondary" className="gap-1.5" onClick={() => toast.success("Rapport nedladdad", domain.domain)}>
            <Download size={14} />
            Rapport
          </Button>
          <WatchButton slug={domain.slug} domain={domain.domain} />
          <a
            href={`https://whois.iis.se/?q=${encodeURIComponent(domain.domain)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-surface px-3.5 text-sm font-medium text-muted transition-colors hover:bg-bg hover:text-fg"
          >
            <ExternalLink size={14} />
            WHOIS
          </a>
        </div>
      </Card>
    </div>
  );
}
