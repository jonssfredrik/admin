"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { domainAnalyses } from "@/modules/snaptld/data/core";
import { useLastVisit } from "@/modules/snaptld/lib/lastVisit";

export function NewSinceBanner() {
  const lastVisit = useLastVisit();

  useEffect(() => {
    if (lastVisit.hydrated && !lastVisit.value) lastVisit.mark();
  }, [lastVisit.hydrated, lastVisit.value, lastVisit]);

  const newSince = useMemo(() => {
    if (!lastVisit.hydrated || !lastVisit.value) return [];
    const cutoff = new Date(lastVisit.value).getTime();
    return domainAnalyses.filter((d) => new Date(d.fetchedAt).getTime() > cutoff);
  }, [lastVisit.hydrated, lastVisit.value]);

  if (!lastVisit.hydrated || !lastVisit.value) return null;
  if (newSince.length === 0) return null;

  const topNew = [...newSince]
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 3);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
        <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">
          {newSince.length} nya domäner sedan ditt senaste besök
        </div>
        <div className="mt-0.5 truncate text-xs text-muted">
          Topp:{" "}
          {topNew.map((d, i) => (
            <span key={d.slug}>
              <Link href={`/snaptld/${d.slug}`} className="font-mono text-fg hover:underline">
                {d.domain}
              </Link>
              <span className="text-muted"> ({d.totalScore})</span>
              {i < topNew.length - 1 && <span className="text-muted"> · </span>}
            </span>
          ))}
        </div>
      </div>
      <Link
        href="/snaptld/queue"
        className="inline-flex items-center gap-1 rounded-md border bg-surface px-2.5 py-1 text-xs font-medium hover:bg-bg"
      >
        Visa alla
        <ArrowRight size={12} />
      </Link>
      <button
        onClick={lastVisit.mark}
        aria-label="Markera som sedda"
        className="rounded-md p-1.5 text-muted hover:bg-bg hover:text-fg"
      >
        <X size={14} />
      </button>
    </div>
  );
}
