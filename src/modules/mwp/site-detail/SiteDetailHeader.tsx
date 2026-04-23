"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { SiteThumb } from "@/modules/mwp/components/SiteThumb";
import type { SiteRecord, SiteStatus } from "@/modules/mwp/data/core";

const statusConfig: Record<SiteStatus, { label: string; dot: string; text: string }> = {
  online: { label: "Tillgänglig", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  warning: { label: "Varning", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  maintenance: { label: "Underhåll", dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" },
  offline: { label: "Nere", dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
};

interface SiteDetailHeaderProps {
  site: SiteRecord;
  onPurgeCache: () => void;
  onOpenAdmin: () => void;
  isPurging?: boolean;
}

export function SiteDetailHeader({ site, onPurgeCache, onOpenAdmin, isPurging = false }: SiteDetailHeaderProps) {
  const cfg = statusConfig[site.status];

  return (
    <div>
      <Link href="/mwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
        <ArrowLeft size={12} />
        MWP
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <SiteThumb screenshot={site.screenshot} domain={site.domain} size="lg" />
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="truncate text-2xl font-semibold tracking-tight">{site.name}</h1>
              <div
                className={clsx(
                  "flex items-center gap-1.5 rounded-md border bg-surface px-2 py-0.5 text-xs font-medium",
                  cfg.text,
                )}
              >
                <span className={clsx("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                {cfg.label}
              </div>
              {site.environment === "staging" && (
                <span className="rounded bg-fg/5 px-1.5 py-0.5 text-[10px] font-medium text-muted">TESTMILJÖ</span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-3 text-sm text-muted">
              <a href={`https://${site.domain}`} className="inline-flex items-center gap-1 hover:text-fg">
                {site.domain}
                <ExternalLink size={12} />
              </a>
              <span>·</span>
              <span>{site.plan}</span>
              <span>·</span>
              <span className="font-mono text-xs">WP {site.wp} / PHP {site.php}</span>
              <span>·</span>
              <span>agent {site.agentVersion}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={onPurgeCache} disabled={isPurging}>
            <RefreshCw size={14} className="mr-1.5" />
            {isPurging ? "Tömmer cache..." : "Töm cache"}
          </Button>
          <Button onClick={onOpenAdmin}>
            <ExternalLink size={14} className="mr-1.5" />
            Öppna WP-admin
          </Button>
        </div>
      </div>
    </div>
  );
}
