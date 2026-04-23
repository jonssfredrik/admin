"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
import { getImportedRows, getImportedStats, getImportedUniqueSources, getImportedUniqueTlds, type ImportedSortDir, type ImportedSortKey } from "@/modules/snaptld/selectors/imports";
import type { ImportedDomainRecord, SnapTldUserState } from "@/modules/snaptld/types";

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
  domains: ImportedDomainRecord[];
  initialUserState: SnapTldUserState;
}) {
  return (
    <SnapTldUserStateProvider initialState={initialUserState}>
      <ImportedDomainsPageContent domains={domains} />
    </SnapTldUserStateProvider>
  );
}

function ImportedDomainsPageContent({ domains }: { domains: ImportedDomainRecord[] }) {
  const toast = useToast();
  const [importOpen, setImportOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusFilters)[number]["id"]>("all");
  const [source, setSource] = useState<"all" | ImportedDomainRecord["source"]>("all");
  const [tld, setTld] = useState<"all" | string>("all");
  const [sortKey, setSortKey] = useState<ImportedSortKey>("importedAt");
  const [sortDir, setSortDir] = useState<ImportedSortDir>("desc");

  const uniqueTlds = useMemo(() => getImportedUniqueTlds(domains), [domains]);
  const uniqueSources = useMemo(() => getImportedUniqueSources(domains), [domains]);
  const stats = useMemo(() => getImportedStats(domains), [domains]);
  const filtered = useMemo(
    () => getImportedRows(domains, { query, status, source, tld }, sortKey, sortDir),
    [domains, query, status, source, tld, sortKey, sortDir],
  );

  const activeFilters =
    (query ? 1 : 0) + (status !== "all" ? 1 : 0) + (source !== "all" ? 1 : 0) + (tld !== "all" ? 1 : 0);

  const resetFilters = () => {
    setQuery("");
    setStatus("all");
    setSource("all");
    setTld("all");
  };

  const toggleSort = (key: ImportedSortKey) => {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir(key === "domain" ? "asc" : "desc");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Databas"
          subtitle="Alla importerade domäner i SnapTLD. Visar hela den mockade databasen, oavsett analysstatus."
        />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="gap-1.5"
            onClick={() => {
              exportCsv(filtered);
              toast.success("Databas exporterad", `${filtered.length} domäner i CSV`);
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
        <StatCard label="Domäner i databasen" value={String(domains.length)} hint="Mockad totalvolym" />
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
            {filtered.length} visade
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              className="pl-9"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sök domän, batch eller importör..."
            />
          </div>

          <div className="flex gap-1 rounded-lg border bg-surface p-1">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatus(filter.id)}
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
              onClick={() => setSource("all")}
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
                onClick={() => setSource(item.id)}
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
              onClick={() => setTld("all")}
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
                onClick={() => setTld(value)}
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
              <Th>Status</Th>
              <Th>Källa</Th>
              <SortableTh active={sortKey === "importedAt"} dir={sortDir} onClick={() => toggleSort("importedAt")}>
                Importerad
              </SortableTh>
              <SortableTh active={sortKey === "expiresAt"} dir={sortDir} onClick={() => toggleSort("expiresAt")}>
                Utgår
              </SortableTh>
              <SortableTh className="w-52" active={sortKey === "score"} dir={sortDir} onClick={() => toggleSort("score")}>
                Score
              </SortableTh>
              <Th>Utlåtande</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <Td colSpan={9} className="py-10 text-center text-sm text-muted">
                  Inga importerade domäner matchar filtren.
                </Td>
              </tr>
            )}
            {filtered.map((domain) => (
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
                  <ScoreBar score={domain.totalScore} showValue />
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
                        onClick: () => toast.info("Analys kölagd", domain.domain),
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
