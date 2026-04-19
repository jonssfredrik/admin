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
import type { DomainAnalysis } from "@/modules/snaptld/data/core";
import { useToast } from "@/components/toast/ToastProvider";

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

export function DomainDetailHeader({ domain }: { domain: DomainAnalysis }) {
  const toast = useToast();
  const age = daysSince(domain.fetchedAt);
  const stale = age >= 7;

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
          <BigScoreRing score={domain.totalScore} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{domain.domain}</h1>
              <VerdictBadge verdict={domain.verdict} size="md" />
              <ExpiryBadge expiresAt={domain.expiresAt} variant="long" />
            </div>
            <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
              <div>
                <dt className="inline">Källa: </dt>
                <dd className="inline font-medium capitalize text-fg">{domain.source.replace("-", " ")}</dd>
              </div>
              <div>
                <dt className="inline">Utgår: </dt>
                <dd className="inline font-mono text-fg">{domain.expiresAt}</dd>
              </div>
              <div>
                <dt className="inline">Senast analyserad: </dt>
                <dd
                  className={clsx(
                    "inline font-mono",
                    stale ? "text-amber-600 dark:text-amber-400" : "text-fg",
                  )}
                >
                  {domain.fetchedAt} ({age === 0 ? "idag" : `${age}d sedan`})
                </dd>
              </div>
              <div>
                <dt className="inline">Uppskattat värde: </dt>
                <dd className="inline font-medium text-fg">{domain.estimatedValue}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={stale ? "primary" : "secondary"}
            className="gap-1.5"
            onClick={() => toast.info("Analys kölagd", domain.domain)}
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
