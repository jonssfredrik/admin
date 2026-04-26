"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CircleSlash,
  Download,
  Eye,
  EyeOff,
  LoaderCircle,
  RefreshCcw,
  Search,
  X,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/Input";
import { Table, Th, Td } from "@/components/ui/Table";
import { RowMenu } from "@/components/ui/RowMenu";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Input";
import { useToast } from "@/components/toast/ToastProvider";
import { ScoreBar } from "@/modules/snaptld/components/ScoreBar";
import { VerdictBadge } from "@/modules/snaptld/components/VerdictBadge";
import { ExpiryBadge } from "@/modules/snaptld/components/ExpiryBadge";
import { WatchButton } from "@/modules/snaptld/components/WatchButton";
import { Checkbox } from "@/modules/snaptld/components/Checkbox";
import { SnapTldUserStateProvider, useSnapTldUserState } from "@/modules/snaptld/client/SnapTldUserStateProvider";
import { formatMoneyRange } from "@/modules/snaptld/lib/format";
import { analyzeQueueAction, rerunAnalysisAction } from "@/modules/snaptld/actions";
import type { QueueSortDir, QueueSortKey } from "@/modules/snaptld/selectors/queue";
import { verdictMeta } from "@/modules/snaptld/data/core";
import type { AnalysisCategory, AnalyzeQueueInput, DomainAnalysis, PaginatedResult, QueuePageMeta, SnapTldUserState, Verdict } from "@/modules/snaptld/types";

const verdictFilters: { id: "all" | Verdict; label: string }[] = [
  { id: "all", label: "Alla" },
  { id: "excellent", label: verdictMeta.excellent.label },
  { id: "good", label: verdictMeta.good.label },
  { id: "mediocre", label: verdictMeta.mediocre.label },
  { id: "skip", label: verdictMeta.skip.label },
];

const PAGE_SIZE = 20;
type AnalysisStep = AnalyzeQueueInput["steps"][number];

const queueAnalysisSteps: { id: AnalysisStep; label: string; hint: string }[] = [
  { id: "overview", label: "Översikt", hint: "Kör alla analyssteg och räknar total score" },
  { id: "structure", label: "Struktur", hint: "Längd, tecken och stavning" },
  { id: "lexical", label: "Lexikal", hint: "Ord, begriplighet och språkkänsla" },
  { id: "brand", label: "Varumärke", hint: "Brandbarhet och namnkänsla" },
  { id: "market", label: "Marknad", hint: "Målgrupp och kommersiell intent" },
  { id: "risk", label: "Risk", hint: "Juridik och varningssignaler" },
  { id: "salability", label: "Säljbarhet", hint: "Köpare, likviditet och flip-potential" },
  { id: "seo", label: "SEO", hint: "Länksignaler och sökpotential" },
  { id: "history", label: "Historik", hint: "Wayback och tidigare innehåll" },
];

export function QueuePage({
  domains,
  initialUserState,
}: {
  domains: PaginatedResult<DomainAnalysis> & { meta: QueuePageMeta };
  initialUserState: SnapTldUserState;
}) {
  return (
    <SnapTldUserStateProvider initialState={initialUserState}>
      <QueuePageContent domains={domains} />
    </SnapTldUserStateProvider>
  );
}

function QueuePageContent({ domains }: { domains: PaginatedResult<DomainAnalysis> & { meta: QueuePageMeta } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const userState = useSnapTldUserState();

  const queryParam = searchParams.get("q") ?? "";
  const verdict = (searchParams.get("verdict") as (typeof verdictFilters)[number]["id"] | null) ?? "all";
  const tld = searchParams.get("tld") ?? "all";
  const tagFilter = searchParams.get("tag");
  const onlyWatched = searchParams.get("watched") === "1";
  const showHidden = searchParams.get("hidden") === "1";
  const sortKey = (searchParams.get("sort") as QueueSortKey | null) ?? "score";
  const sortDir = (searchParams.get("dir") as QueueSortDir | null) ?? "desc";
  const [query, setQuery] = useState(queryParam);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [analyzingQueue, setAnalyzingQueue] = useState(false);
  const [queueDialogOpen, setQueueDialogOpen] = useState(false);

  const pageRows = domains.items;
  const uniqueTlds = domains.meta.uniqueTlds;
  const pageCount = domains.totalPages;
  const clampedPage = domains.page - 1;

  const visibleSelectedCount = pageRows.filter((row) => selected.has(row.slug)).length;
  const allOnPageSelected = pageRows.length > 0 && visibleSelectedCount === pageRows.length;

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || (key === "page" && value === "1")) next.delete(key);
      else next.set(key, value);
    });
    router.push(`/snaptld/queue${next.toString() ? `?${next.toString()}` : ""}`);
  };

  const toggleSort = (key: QueueSortKey) => {
    const nextDir = sortKey === key ? (sortDir === "asc" ? "desc" : "asc") : key === "domain" ? "asc" : "desc";
    updateParams({ sort: key, dir: nextDir, page: "1" });
  };

  const toggleSelection = (slug: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const toggleSelectPage = () => {
    setSelected((current) => {
      const next = new Set(current);
      if (allOnPageSelected) pageRows.forEach((row) => next.delete(row.slug));
      else pageRows.forEach((row) => next.add(row.slug));
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const bulkWatch = async () => {
    const slugs = Array.from(selected);
    await userState.addWatchMany(slugs);
    toast.success(`Bevakar ${slugs.length} domäner`);
    clearSelection();
  };

  const bulkHide = async () => {
    const slugs = Array.from(selected);
    await userState.addHiddenMany(slugs);
    toast.success(`${slugs.length} domäner dolda`);
    clearSelection();
  };

  const bulkReviewed = async () => {
    const slugs = Array.from(selected);
    await userState.addReviewedMany(slugs);
    toast.success(`${slugs.length} markerade som granskade`);
    clearSelection();
  };

  const bulkExport = () => {
    const slugs = Array.from(selected);
    const rows = pageRows.filter((domain) => slugs.includes(domain.slug));
    const csv = [
      "domain,score,verdict,expires,source,value_min,value_max,currency",
      ...rows.map((row) =>
        [
          row.domain,
          row.totalScore,
          row.verdict,
          row.expiresAt,
          row.source,
          row.estimatedValue.min,
          row.estimatedValue.max,
          row.estimatedValue.currency,
        ].join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `snaptld-urval-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exporterat ${rows.length} domäner`);
    clearSelection();
  };

  const resetFilters = () => {
    setQuery("");
    updateParams({ q: null, verdict: null, tld: null, tag: null, watched: null, hidden: null, page: null });
  };

  const allTags = Array.from(new Set(Object.values(userState.state.notes).flatMap((note) => note.tags))).sort();
  const activeFilters =
    (queryParam ? 1 : 0) + (verdict !== "all" ? 1 : 0) + (tld !== "all" ? 1 : 0) + (tagFilter ? 1 : 0) + (onlyWatched ? 1 : 0);

  const rerunAnalysis = async (domain: DomainAnalysis) => {
    await rerunAnalysisAction(domain.slug);
    toast.success("Analys körd", domain.domain);
    router.refresh();
  };

  const analyzeQueue = async (input: AnalyzeQueueInput) => {
    try {
      setAnalyzingQueue(true);
      const result = await analyzeQueueAction(input);
      toast.success(
        result.analyzed > 0 ? "Analyskö körd" : "Inget att analysera",
        `${result.analyzed} analyserade · ${result.remaining} kvar`,
      );
      setQueueDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Kunde inte köra analyskön", error instanceof Error ? error.message : "Okänt fel");
    } finally {
      setAnalyzingQueue(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Analyskö"
          subtitle="Alla analyserade domäner. Filtrera, sortera, markera och agera i grupp."
        />
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button variant="secondary" className="gap-1.5" disabled={analyzingQueue} onClick={() => setQueueDialogOpen(true)}>
            {analyzingQueue ? <LoaderCircle size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
            {analyzingQueue ? "Analyserar..." : "Kör analyskö"}
          </Button>
          <div className="flex items-center gap-3 text-xs text-muted">
            {userState.state.reviewed.length > 0 && <span>{userState.state.reviewed.length} granskade</span>}
            {userState.state.hidden.length > 0 && (
              <button
                onClick={() => updateParams({ hidden: showHidden ? null : "1", page: "1" })}
                className="inline-flex items-center gap-1 hover:text-fg"
              >
                {showHidden ? <Eye size={12} /> : <EyeOff size={12} />}
                {userState.state.hidden.length} dolda
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
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
              placeholder="Sök domän eller källa..."
            />
          </form>

          <div className="flex gap-1 rounded-lg border bg-surface p-1">
            {verdictFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => updateParams({ verdict: filter.id, page: "1" })}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  verdict === filter.id ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                )}
              >
                {filter.label}
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

          <button
            onClick={() => updateParams({ watched: onlyWatched ? null : "1", page: "1" })}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
              onlyWatched ? "border-fg bg-fg text-bg" : "bg-surface text-muted hover:bg-bg hover:text-fg",
            )}
          >
            <Bookmark size={12} />
            Bevakade
            {userState.state.watchlist.length > 0 && (
              <span className={clsx("rounded px-1 tabular-nums", onlyWatched ? "bg-bg/20" : "bg-fg/10")}>
                {userState.state.watchlist.length}
              </span>
            )}
          </button>

          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 border-l pl-2">
              <span className="text-[11px] text-muted">Taggar:</span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => updateParams({ tag: tagFilter === tag ? null : tag, page: "1" })}
                  className={clsx(
                    "rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
                    tagFilter === tag ? "bg-fg text-bg" : "border bg-surface text-muted hover:text-fg",
                  )}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

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
        <div className="text-xs text-muted">
          {domains.total} resultat
          {showHidden && " · visar dolda"}
        </div>
      </div>

      {selected.size > 0 && (
        <div className="sticky top-4 z-20 flex items-center justify-between gap-3 rounded-xl border bg-fg text-bg shadow-pop px-4 py-2.5">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold tabular-nums">{selected.size} valda</span>
            <button onClick={clearSelection} className="text-bg/70 hover:text-bg">
              Rensa
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <BulkButton icon={Bookmark} onClick={bulkWatch}>Bevaka</BulkButton>
            <BulkButton icon={Download} onClick={bulkExport}>Exportera</BulkButton>
            <BulkButton icon={Eye} onClick={bulkReviewed}>Markera granskade</BulkButton>
            <BulkButton icon={CircleSlash} onClick={bulkHide}>Dölj</BulkButton>
          </div>
        </div>
      )}

      <AnalyzeQueueDialog
        open={queueDialogOpen}
        onClose={() => setQueueDialogOpen(false)}
        onRun={analyzeQueue}
        pending={analyzingQueue}
        selectedSlugs={Array.from(selected)}
      />

      <Table>
        <thead>
          <tr>
            <Th className="w-8 pr-0">
              <Checkbox
                checked={allOnPageSelected}
                indeterminate={visibleSelectedCount > 0 && !allOnPageSelected}
                onChange={toggleSelectPage}
                ariaLabel="Markera alla på sidan"
              />
            </Th>
            <Th className="w-8" />
            <SortableTh active={sortKey === "domain"} dir={sortDir} onClick={() => toggleSort("domain")}>
              Domän
            </SortableTh>
            <SortableTh active={sortKey === "verdict"} dir={sortDir} onClick={() => toggleSort("verdict")}>
              Utlåtande
            </SortableTh>
            <SortableTh className="w-52" active={sortKey === "score"} dir={sortDir} onClick={() => toggleSort("score")}>
              Score
            </SortableTh>
            <SortableTh active={sortKey === "expires"} dir={sortDir} onClick={() => toggleSort("expires")}>
              Utgår
            </SortableTh>
            <SortableTh active={sortKey === "source"} dir={sortDir} onClick={() => toggleSort("source")}>
              Källa
            </SortableTh>
            <SortableTh className="text-right" active={sortKey === "value"} dir={sortDir} onClick={() => toggleSort("value")}>
              Värde
            </SortableTh>
            <Th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {pageRows.length === 0 && (
            <tr>
              <Td colSpan={9} className="py-10 text-center text-sm text-muted">
                Inga domäner matchar filtren.
              </Td>
            </tr>
          )}
          {pageRows.map((domain) => {
            const isSelected = selected.has(domain.slug);
            const isReviewed = userState.hasReviewed(domain.slug);
            return (
              <tr
                key={domain.slug}
                className={clsx(
                  "transition-colors hover:bg-bg/50",
                  isSelected && "bg-fg/[0.03]",
                  isReviewed && "opacity-60",
                )}
              >
                <Td className="pr-0">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleSelection(domain.slug)}
                    ariaLabel={`Välj ${domain.domain}`}
                  />
                </Td>
                <Td className="pr-0">
                  <WatchButton slug={domain.slug} domain={domain.domain} variant="icon" />
                </Td>
                <Td>
                  <Link href={`/snaptld/${domain.slug}`} className="block">
                    <div className="flex items-center gap-2 font-medium hover:underline">
                      {domain.domain}
                      {isReviewed && (
                        <span className="rounded bg-fg/5 px-1 text-[10px] font-medium uppercase tracking-wider text-muted">
                          Granskad
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted">Hämtad {domain.fetchedAt}</div>
                  </Link>
                </Td>
                <Td>
                  <VerdictBadge verdict={domain.verdict} />
                </Td>
                <Td>
                  <ScoreBar score={domain.totalScore} showValue />
                </Td>
                <Td>
                  <ExpiryBadge expiresAt={domain.expiresAt} variant="long" />
                </Td>
                <Td className="text-xs capitalize text-muted">{domain.source.replace("-", " ")}</Td>
                <Td className="text-right text-xs font-medium">{formatMoneyRange(domain.estimatedValue)}</Td>
                <Td>
                  <RowMenu
                    items={[
                      { label: "Öppna detalj", onClick: () => window.location.assign(`/snaptld/${domain.slug}`) },
                      { label: "Kör om analys", icon: RefreshCcw, onClick: () => void rerunAnalysis(domain) },
                      { label: "Exportera rapport", icon: Download, onClick: () => toast.success("Rapport nedladdad", domain.domain) },
                      { divider: true },
                      {
                        label: isReviewed ? "Ångra granskad" : "Markera granskad",
                        icon: Eye,
                        onClick: () => userState.toggleReviewed(domain.slug),
                      },
                      {
                        label: userState.hasHidden(domain.slug) ? "Visa igen" : "Dölj domän",
                        icon: userState.hasHidden(domain.slug) ? Eye : EyeOff,
                        onClick: () => userState.toggleHidden(domain.slug),
                      },
                    ]}
                  />
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {domains.total > PAGE_SIZE && (
        <div className="flex items-center justify-between text-xs text-muted">
          <div>
            Visar {clampedPage * PAGE_SIZE + 1}–{Math.min((clampedPage + 1) * PAGE_SIZE, domains.total)} av {domains.total}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              className="h-8 px-2"
              disabled={clampedPage === 0}
              onClick={() => updateParams({ page: String(clampedPage) })}
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="px-2 font-mono tabular-nums text-fg">
              {clampedPage + 1} / {pageCount}
            </span>
            <Button
              variant="secondary"
              className="h-8 px-2"
              disabled={clampedPage >= pageCount - 1}
              onClick={() => updateParams({ page: String(clampedPage + 2) })}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyzeQueueDialog({
  open,
  onClose,
  onRun,
  pending,
  selectedSlugs,
}: {
  open: boolean;
  onClose: () => void;
  onRun: (input: AnalyzeQueueInput) => void | Promise<void>;
  pending: boolean;
  selectedSlugs: string[];
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [scope, setScope] = useState<AnalyzeQueueInput["scope"]>("queued");
  const [limitMode, setLimitMode] = useState<"limit" | "all">("limit");
  const [limit, setLimit] = useState(25);
  const [dateMode, setDateMode] = useState<"any" | "before" | "after">("any");
  const [date, setDate] = useState(today);
  const [missingStep, setMissingStep] = useState<AnalysisCategory>("seo");
  const [sortBy, setSortBy] = useState<NonNullable<AnalyzeQueueInput["sortBy"]>>("oldest-imported");
  const [steps, setSteps] = useState<AnalysisStep[]>(["overview"]);

  const selectedAvailable = selectedSlugs.length > 0;
  const canRun = steps.length > 0 && (scope !== "selected" || selectedAvailable);

  const toggleStep = (step: AnalysisStep) => {
    setSteps((current) => (current.includes(step) ? current.filter((item) => item !== step) : [...current, step]));
  };

  const run = () => {
    if (!canRun) return;
    void onRun({
      scope,
      slugs: scope === "selected" ? selectedSlugs : undefined,
      limit: limitMode === "all" ? "all" : limit,
      steps,
      sortBy,
      missingStep: scope === "missing-step" ? missingStep : null,
      dateFilter: dateMode === "any" ? null : { direction: dateMode, date },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={pending ? () => undefined : onClose}
      title="Kör analyskö"
      description="Välj vilka domäner som ska analyseras, i vilken ordning och vilka analyssteg som ska köras."
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>Avbryt</Button>
          <Button onClick={run} disabled={!canRun || pending} className="gap-1.5">
            {pending ? <LoaderCircle size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
            {pending ? "Analyserar..." : "Starta körning"}
          </Button>
        </>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <div>
            <Label>Urval</Label>
            <div className="mt-2 grid gap-2">
              {[
                { id: "queued", label: "Endast köade", hint: "Domäner som inte har analyserats ännu." },
                { id: "not-analyzed", label: "Alla förutom redan analyserade", hint: "Tar queued, running och failed." },
                { id: "all", label: "Alla domäner", hint: "Analyserar om även redan analyserade." },
                { id: "missing-step", label: "Saknar analyssteg", hint: "Välj vilket steg som måste saknas." },
                { id: "selected", label: `Markerade domäner (${selectedSlugs.length})`, hint: "Använder kryssade rader på sidan." },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.id === "selected" && !selectedAvailable}
                  onClick={() => setScope(item.id as AnalyzeQueueInput["scope"])}
                  className={clsx(
                    "rounded-xl border p-3 text-left transition-colors",
                    scope === item.id ? "border-fg bg-fg/5" : "hover:bg-bg/60",
                    item.id === "selected" && !selectedAvailable && "cursor-not-allowed opacity-50",
                  )}
                >
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="mt-0.5 text-xs text-muted">{item.hint}</div>
                </button>
              ))}
            </div>
          </div>

          {scope === "missing-step" && (
            <div>
              <Label htmlFor="missing-step">Saknat steg</Label>
              <select
                id="missing-step"
                value={missingStep}
                onChange={(event) => setMissingStep(event.target.value as AnalysisCategory)}
                className="mt-1.5 w-full rounded-lg border bg-surface px-3 py-2 text-sm outline-none focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
              >
                {queueAnalysisSteps.filter((step) => step.id !== "overview").map((step) => (
                  <option key={step.id} value={step.id}>{step.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Antal</Label>
              <div className="mt-1.5 flex rounded-lg border bg-surface p-1">
                <button type="button" onClick={() => setLimitMode("limit")} className={clsx("flex-1 rounded-md px-2 py-1.5 text-xs font-medium", limitMode === "limit" ? "bg-fg text-bg" : "text-muted hover:bg-bg")}>Begränsa</button>
                <button type="button" onClick={() => setLimitMode("all")} className={clsx("flex-1 rounded-md px-2 py-1.5 text-xs font-medium", limitMode === "all" ? "bg-fg text-bg" : "text-muted hover:bg-bg")}>Alla</button>
              </div>
              {limitMode === "limit" && (
                <Input
                  type="number"
                  min={1}
                  max={1000}
                  value={limit}
                  onChange={(event) => setLimit(Math.max(1, Math.min(Number(event.target.value) || 1, 1000)))}
                  className="mt-2"
                />
              )}
            </div>

            <div>
              <Label htmlFor="queue-sort">Sortering</Label>
              <select
                id="queue-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as NonNullable<AnalyzeQueueInput["sortBy"]>)}
                className="mt-1.5 w-full rounded-lg border bg-surface px-3 py-2 text-sm outline-none focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
              >
                <option value="oldest-imported">Äldst importerade först</option>
                <option value="newest-imported">Nyast importerade först</option>
                <option value="expires-soon">Utgår tidigast först</option>
                <option value="highest-score">Högst score först</option>
                <option value="lowest-score">Lägst score först</option>
                <option value="domain">Domän A-Ö</option>
              </select>
            </div>
          </div>

          <div>
            <Label>Importdatum</Label>
            <div className="mt-1.5 grid gap-2 sm:grid-cols-[140px_1fr]">
              <select
                value={dateMode}
                onChange={(event) => setDateMode(event.target.value as typeof dateMode)}
                className="rounded-lg border bg-surface px-3 py-2 text-sm outline-none focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
              >
                <option value="any">Alla datum</option>
                <option value="before">Tillagda före</option>
                <option value="after">Tillagda efter</option>
              </select>
              <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} disabled={dateMode === "any"} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>Analyssteg</Label>
              <span className="text-[11px] text-muted">{steps.length} valda</span>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {queueAnalysisSteps.map((step) => {
                const active = steps.includes(step.id);
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    className={clsx(
                      "rounded-xl border p-3 text-left transition-colors",
                      active ? "border-fg bg-fg/5" : "hover:bg-bg/60",
                    )}
                  >
                    <div className="text-sm font-medium">{step.label}</div>
                    <div className="mt-0.5 text-xs text-muted">{step.hint}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

function BulkButton({
  icon: Icon,
  onClick,
  children,
}: {
  icon: typeof Bookmark;
  onClick: () => void | Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => void onClick()}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-bg/90 transition-colors hover:bg-bg/10 hover:text-bg"
    >
      <Icon size={13} />
      {children}
    </button>
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
  dir: QueueSortDir;
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
        {active ? (dir === "asc" ? <ArrowUp size={10} /> : <ArrowDown size={10} />) : <span className="inline-block h-[10px] w-[10px]" />}
      </button>
    </Th>
  );
}
