"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowDown, ArrowUp, Database, Download, RefreshCcw, Search, Upload, X } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { Badge, Table, Td, Th } from "@/components/ui/Table";
import { RowMenu } from "@/components/ui/RowMenu";
import { useToast } from "@/components/toast/ToastProvider";
import { ExpiryBadge } from "@/modules/snaptld/components/ExpiryBadge";
import { ImportDialog } from "@/modules/snaptld/components/ImportDialog";
import { ScoreBar } from "@/modules/snaptld/components/ScoreBar";
import { VerdictBadge } from "@/modules/snaptld/components/VerdictBadge";
import { WatchButton } from "@/modules/snaptld/components/WatchButton";
import { SnapTldUserStateProvider } from "@/modules/snaptld/client/SnapTldUserStateProvider";
import { formatDateTime, formatMoneyRange } from "@/modules/snaptld/lib/format";
import { rerunAnalysisAction } from "@/modules/snaptld/actions";
import type { ImportedSortDir, ImportedSortKey } from "@/modules/snaptld/selectors/imports";
import type { AnalysisCategory, ImportedDomainRecord, ImportedDomainsMeta, PaginatedResult, SnapTldUserState } from "@/modules/snaptld/types";

const statusMeta = {
  analyzed: { label: "Analyserad", tone: "success" },
  queued: { label: "Köad", tone: "warning" },
  running: { label: "Körs", tone: "warning" },
  failed: { label: "Misslyckad", tone: "danger" },
} as const;

const sourceTones = {
  internetstiftelsen: "success",
  manual: "neutral",
  csv: "warning",
  url: "neutral",
} as const;

const statusFilters = [
  { id: "all", label: "Alla statusar" },
  { id: "analyzed", label: "Analyserade" },
  { id: "running", label: "Körs" },
  { id: "queued", label: "Köade" },
  { id: "failed", label: "Misslyckade" },
] as const;

const PAGE_SIZE = 100;

const analysisStepMeta: Array<{ id: AnalysisCategory; label: string; short: string }> = [
  { id: "structure", label: "Struktur", short: "St" },
  { id: "lexical", label: "Lexikal", short: "Le" },
  { id: "brand", label: "Varumärke", short: "Br" },
  { id: "market", label: "Marknad", short: "Ma" },
  { id: "risk", label: "Risk", short: "Ri" },
  { id: "salability", label: "Säljbarhet", short: "Sä" },
  { id: "seo", label: "SEO", short: "Se" },
  { id: "history", label: "Historik", short: "Hi" },
];

function exportCsv(rows: ImportedDomainRecord[]) {
  const csv = [
    "domain,status,source,imported_at,expires_at,score,value_min,value_max,currency,batch_id",
    ...rows.map((row) =>
      [
        row.domain,
        row.status,
        row.source,
        row.importedAt,
        row.expiresAt,
        row.totalScore,
        row.estimatedValue.min,
        row.estimatedValue.max,
        row.estimatedValue.currency,
        row.batchId,
      ].join(","),
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `snaptld-databas-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function ImportedDomainsPage({
  domains,
  initialUserState,
}: {
  domains: PaginatedResult<ImportedDomainRecord> & { meta: ImportedDomainsMeta };
  initialUserState: SnapTldUserState;
}) {
  return (
    <SnapTldUserStateProvider initialState={initialUserState}>
      <ImportedDomainsPageContent domains={domains} />
    </SnapTldUserStateProvider>
  );
}

function ImportedDomainsPageContent({ domains }: { domains: PaginatedResult<ImportedDomainRecord> & { meta: ImportedDomainsMeta } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [importOpen, setImportOpen] = useState(false);
  const queryParam = searchParams.get("q") ?? "";
  const status = (searchParams.get("status") as (typeof statusFilters)[number]["id"] | null) ?? "all";
  const source = (searchParams.get("source") as "all" | ImportedDomainRecord["source"] | null) ?? "all";
  const tld = searchParams.get("tld") ?? "all";
  const sortKey = (searchParams.get("sort") as ImportedSortKey | null) ?? "importedAt";
  const sortDir = (searchParams.get("dir") as ImportedSortDir | null) ?? "desc";
  const [query, setQuery] = useState(queryParam);

  const uniqueTlds = domains.meta.uniqueTlds;
  const uniqueSources = domains.meta.uniqueSources;
  const stats = domains.meta;
  const paginated = domains.items;
  const page = domains.page;
  const totalPages = domains.totalPages;

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || (key === "page" && value === "1")) next.delete(key);
      else next.set(key, value);
    });
    router.push(`/snaptld/domains${next.toString() ? `?${next.toString()}` : ""}`);
  };

  const activeFilters =
    (queryParam ? 1 : 0) + (status !== "all" ? 1 : 0) + (source !== "all" ? 1 : 0) + (tld !== "all" ? 1 : 0);

  const resetFilters = () => {
    setQuery("");
    updateParams({ q: null, status: null, source: null, tld: null, page: null });
  };

  const toggleSort = (key: ImportedSortKey) => {
    const nextDir = sortKey === key ? (sortDir === "asc" ? "desc" : "asc") : key === "domain" ? "asc" : "desc";
    updateParams({ sort: key, dir: nextDir, page: "1" });
  };

  const rerunAnalysis = async (domain: ImportedDomainRecord) => {
    await rerunAnalysisAction(domain.slug);
    toast.success("Analys körd", domain.domain);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Databas"
          subtitle="Alla importerade domäner i SnapTLD. Filtrera, sortera och följ analysstatus."
        />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="gap-1.5"
            onClick={() => {
              exportCsv(paginated);
              toast.success("Aktuell sida exporterad", `${paginated.length} domäner i CSV`);
            }}
          >
            <Download size={14} />
            Exportera
          </Button>
          <Button className="gap-1.5" onClick={() => setImportOpen(true)}>
            <Upload size={14} />
            Importera
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Domäner i databasen" value={String(stats.totalDomains)} hint="Totalvolym" />
        <StatCard label="Importerade idag" value={String(stats.importedToday)} delta={9} hint="Senaste batchkörningen" />
        <StatCard label="Analyserade" value={String(stats.analyzed)} hint={`${stats.running} körs just nu`} />
        <StatCard label="Importbatcher" value={String(stats.uniqueBatches)} hint="Över alla källor" />
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Importerade domäner</h2>
            <p className="text-xs text-muted">Filtrera på källa, TLD och status innan du går vidare till detaljvyn.</p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-muted">
            <Database size={13} />
            {domains.total} totalt
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <form
            className="relative min-w-[240px] flex-1 max-w-sm"
            onSubmit={(event) => {
              event.preventDefault();
              updateParams({ q: query.trim(), page: "1" });
            }}
          >
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              className="pl-9"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onBlur={() => updateParams({ q: query.trim(), page: "1" })}
              placeholder="Sök domän, batch eller importör..."
            />
          </form>

          <div className="flex gap-1 rounded-lg border bg-surface p-1">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => updateParams({ status: filter.id, page: "1" })}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  status === filter.id ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex gap-1 rounded-lg border bg-surface p-1">
            <button
              onClick={() => updateParams({ source: "all", page: "1" })}
              className={clsx(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                source === "all" ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
              )}
            >
              Alla källor
            </button>
            {uniqueSources.map((item) => (
              <button
                key={item.id}
                onClick={() => updateParams({ source: item.id, page: "1" })}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  source === item.id ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex gap-1 rounded-lg border bg-surface p-1">
            <button
              onClick={() => updateParams({ tld: "all", page: "1" })}
              className={clsx(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                tld === "all" ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
              )}
            >
              Alla TLD
            </button>
            {uniqueTlds.map((value) => (
              <button
                key={value}
                onClick={() => updateParams({ tld: value, page: "1" })}
                className={clsx(
                  "rounded-md px-2 py-1 font-mono text-xs font-medium transition-colors",
                  tld === value ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                )}
              >
                {value}
              </button>
            ))}
          </div>

          {activeFilters > 0 && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"
            >
              <X size={12} />
              Rensa filter
            </button>
          )}
        </div>

        <Table>
          <thead>
            <tr>
              <Th className="w-8" />
              <SortableTh active={sortKey === "domain"} dir={sortDir} onClick={() => toggleSort("domain")}>
                Domän
              </SortableTh>
              <SortableTh active={sortKey === "status"} dir={sortDir} onClick={() => toggleSort("status")}>
                Status
              </SortableTh>
              <SortableTh active={sortKey === "source"} dir={sortDir} onClick={() => toggleSort("source")}>
                Källa
              </SortableTh>
              <SortableTh active={sortKey === "importedAt"} dir={sortDir} onClick={() => toggleSort("importedAt")}>
                Importerad
              </SortableTh>
              <SortableTh active={sortKey === "expiresAt"} dir={sortDir} onClick={() => toggleSort("expiresAt")}>
                Utgår
              </SortableTh>
              <SortableTh className="w-52" active={sortKey === "score"} dir={sortDir} onClick={() => toggleSort("score")}>
                Score
              </SortableTh>
              <SortableTh active={sortKey === "verdict"} dir={sortDir} onClick={() => toggleSort("verdict")}>
                Utlåtande
              </SortableTh>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {domains.total === 0 && (
              <tr>
                <Td colSpan={9} className="py-10 text-center text-sm text-muted">
                  Inga importerade domäner matchar filtren.
                </Td>
              </tr>
            )}
            {paginated.map((domain) => (
              <tr key={domain.slug} className="transition-colors hover:bg-bg/50">
                <Td className="pr-0">
                  <WatchButton slug={domain.slug} domain={domain.domain} variant="icon" />
                </Td>
                <Td>
                  <Link href={`/snaptld/${domain.slug}`} className="block">
                    <div className="flex items-center gap-2 font-medium hover:underline">
                      {domain.domain}
                      <span className="rounded bg-fg/5 px-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                        {domain.tld}
                      </span>
                    </div>
                    <div className="text-xs text-muted">
                      {domain.batchId} · {domain.importedBy}
                    </div>
                  </Link>
                </Td>
                <Td>
                  <Badge tone={statusMeta[domain.status].tone}>{statusMeta[domain.status].label}</Badge>
                </Td>
                <Td>
                  <Badge tone={sourceTones[domain.source]}>{domain.sourceLabel}</Badge>
                </Td>
                <Td className="text-xs text-muted">{formatDateTime(domain.importedAt)}</Td>
                <Td>
                  <ExpiryBadge expiresAt={domain.expiresAt} variant="long" />
                </Td>
                <Td>
                  <div className="space-y-1.5">
                    <ScoreBar score={domain.totalScore} showValue />
                    <AnalysisStepIndicator steps={domain.analysisSteps ?? []} />
                  </div>
                </Td>
                <Td>
                  <VerdictBadge verdict={domain.verdict} />
                </Td>
                <Td>
                  <RowMenu
                    items={[
                      { label: "Öppna detalj", onClick: () => window.location.assign(`/snaptld/${domain.slug}`) },
                      {
                        label: "Kör om analys",
                        icon: RefreshCcw,
                        onClick: () => void rerunAnalysis(domain),
                      },
                      {
                        label: "Exportera rad",
                        icon: Download,
                        onClick: () => {
                          exportCsv([domain]);
                          toast.success("Rad exporterad", domain.domain);
                        },
                      },
                    ]}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>

        {domains.total > 0 && (
          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <span className="text-sm text-muted">
              Sida {page} av {totalPages} · visar {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, domains.total)} av {domains.total}
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => updateParams({ page: String(page - 1) })} disabled={page === 1}>
                Föregående
              </Button>
              <Button
                variant="secondary"
                onClick={() => updateParams({ page: String(page + 1) })}
                disabled={page === totalPages}
              >
                Nästa
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}

function SortableTh({
  children,
  active,
  dir,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active: boolean;
  dir: ImportedSortDir;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Th className={className}>
      <button
        onClick={onClick}
        className={clsx(
          "-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors",
          active ? "text-fg" : "hover:text-fg",
        )}
      >
        {children}
        {active ? dir === "asc" ? <ArrowUp size={10} /> : <ArrowDown size={10} /> : <span className="inline-block h-[10px] w-[10px]" />}
      </button>
    </Th>
  );
}

function AnalysisStepIndicator({ steps }: { steps: AnalysisCategory[] }) {
  const completed = new Set(steps);
  const label = steps.length > 0
    ? `Analyserad: ${analysisStepMeta.filter((step) => completed.has(step.id)).map((step) => step.label).join(", ")}`
    : "Ej analyserad";

  return (
    <div className="flex items-center gap-1" title={label} aria-label={label}>
      {analysisStepMeta.map((step) => {
        const active = completed.has(step.id);
        return (
          <span
            key={step.id}
            className={clsx(
              "h-1.5 w-3 rounded-full transition-colors",
              active ? "bg-fg/70" : "bg-fg/10",
            )}
          />
        );
      })}
      <span className="ml-1 text-[10px] font-medium tabular-nums text-muted">
        {steps.length}/8
      </span>
    </div>
  );
}
