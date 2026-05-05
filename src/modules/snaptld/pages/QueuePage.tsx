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

const statusFilters: Array<{ id: "all" | DomainAnalysis["status"]; label: string }> = [
  { id: "all", label: "Alla statusar" },
  { id: "queued", label: "Koad" },
  { id: "running", label: "Kors" },
  { id: "analyzed", label: "Analyserad" },
  { id: "failed", label: "Misslyckad" },
];

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [20, 50, 100, 200] as const;
type AnalysisStep = AnalyzeQueueInput["steps"][number];
type SelectedSubAnalyses = NonNullable<AnalyzeQueueInput["selectedSubAnalyses"]>;

const analysisStepMeta: Array<{ id: AnalysisCategory; label: string; short: string }> = [
  { id: "structure", label: "Struktur", short: "St" },
  { id: "lexical", label: "Lexikal", short: "Le" },
  { id: "brand", label: "Varumarke", short: "Br" },
  { id: "market", label: "Marknad", short: "Ma" },
  { id: "risk", label: "Risk", short: "Ri" },
  { id: "salability", label: "Saljbarhet", short: "Sa" },
  { id: "seo", label: "SEO", short: "Se" },
  { id: "history", label: "Historik", short: "Hi" },
];

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

const analysisStepRequirements: Record<AnalysisStep, string[]> = {
  overview: ["Alla lokala regler", "OpenAI for AI-delar", "Moz for SEO-metrik", "WHOIS/RDAP och Wayback for historik"],
  structure: ["Kors lokalt", "Ingen API-nyckel"],
  lexical: ["Kors lokalt", "Svenskt lexikon i projektet", "Ingen API-nyckel"],
  brand: ["Lokal brandbarhet", "OpenAI API-nyckel for AI-bedomning"],
  market: ["Lokal nischmatchning", "OpenAI API-nyckel for marknadsbedomning"],
  risk: ["Lokala språkliga riskflaggor", "OpenAI API-nyckel for extern varumarkeskontroll"],
  salability: ["Lokal saljbarhetsmodell", "OpenAI API-nyckel for koparanalys"],
  seo: ["Lokal keyword-relevans", "Moz API-nyckel for DA/PA och backlinks"],
  history: ["WHOIS/RDAP-natverksanrop", "Wayback API for snapshots"],
};

const analysisSubStepMeta: Record<AnalysisCategory, Array<{
  id: string;
  label: string;
  hint: string;
  maxScore: number;
  apiLabel: string;
  usesApiKey: boolean;
}>> = {
  structure: [
    { id: "structure-local", label: "Lokal struktur", hint: "Langd, tecken, segmentering och form", maxScore: 100, apiLabel: "Lokal", usesApiKey: false },
  ],
  lexical: [
    { id: "lexicon-local", label: "Svenskt lexikon", hint: "Ordtraff, begriplighet och sprakkansla", maxScore: 100, apiLabel: "Lokal", usesApiKey: false },
  ],
  brand: [
    { id: "brand-local", label: "Lokal brandbarhet", hint: "Langd, uttal, generiskhet och namnkansla", maxScore: 70, apiLabel: "Lokal", usesApiKey: false },
    { id: "brand-ai", label: "AI-varumarkesbedomning", hint: "Extern AI-bedomning av varumarkespotential", maxScore: 30, apiLabel: "OpenAI API", usesApiKey: true },
  ],
  market: [
    { id: "market-local", label: "Lokal nischmatchning", hint: "Svenska ord och kommersiella synonymkluster", maxScore: 60, apiLabel: "Lokal", usesApiKey: false },
    { id: "market-ai", label: "AI-marknadsbedomning", hint: "Extern AI-bedomning av malgrupp och intent", maxScore: 40, apiLabel: "OpenAI API", usesApiKey: true },
  ],
  risk: [
    { id: "risk-local", label: "Sprakliga riskflaggor", hint: "Lokala ord- och tolkningsrisker", maxScore: 50, apiLabel: "Lokal", usesApiKey: false },
    { id: "risk-trademark", label: "Extern varumarkeskontroll", hint: "AI-hjalpt riskunderlag for varumarke", maxScore: 50, apiLabel: "OpenAI API", usesApiKey: true },
  ],
  salability: [
    { id: "salability-local", label: "Lokal saljbarhet", hint: "Begriplighet, marknadsstod och rimlig langd", maxScore: 60, apiLabel: "Lokal", usesApiKey: false },
    { id: "salability-ai", label: "AI-koparanalys", hint: "Extern AI-bedomning av kopare och flip-potential", maxScore: 40, apiLabel: "OpenAI API", usesApiKey: true },
  ],
  seo: [
    { id: "seo-keyword-local", label: "Lokal keyword-relevans", hint: "Sokordssignaler fran lokala lexikon", maxScore: 35, apiLabel: "Lokal", usesApiKey: false },
    { id: "seo-moz", label: "Moz DA/PA och backlinks", hint: "Extern lank- och auktoritetsdata", maxScore: 65, apiLabel: "Moz API", usesApiKey: true },
  ],
  history: [
    { id: "history-whois", label: "WHOIS-alder (RDAP)", hint: "Registreringsdatum och alderssignal", maxScore: 50, apiLabel: "RDAP", usesApiKey: false },
    { id: "history-wayback", label: "Wayback-snapshots", hint: "Tidigare innehall och arkivhistorik", maxScore: 50, apiLabel: "Wayback API", usesApiKey: true },
  ],
};

function buildDefaultSelectedSubAnalyses(): SelectedSubAnalyses {
  return analysisStepMeta.reduce<SelectedSubAnalyses>((acc, step) => {
    acc[step.id] = analysisSubStepMeta[step.id].map((subStep) => subStep.id);
    return acc;
  }, {});
}

const analysisSubStepOptions = analysisStepMeta.flatMap((step) =>
  analysisSubStepMeta[step.id].map((subStep) => ({
    category: step.id,
    categoryLabel: step.label,
    id: subStep.id,
    label: subStep.label,
    apiLabel: subStep.apiLabel,
  })),
);

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
  const status = (searchParams.get("status") as (typeof statusFilters)[number]["id"] | null) ?? "all";
  const tld = searchParams.get("tld") ?? "all";
  const source = searchParams.get("src") ?? "all";
  const tagFilter = searchParams.get("tag");
  const onlyWatched = searchParams.get("watched") === "1";
  const showHidden = searchParams.get("hidden") === "1";
  const hideReviewed = searchParams.get("notreviewed") === "1";
  const minScore = Number(searchParams.get("smin") ?? 0);
  const maxScore = Number(searchParams.get("smax") ?? 0);
  const minDaysUntilExpiry = Number(searchParams.get("emin") ?? 0);
  const maxDaysUntilExpiry = Number(searchParams.get("emax") ?? searchParams.get("expiry") ?? 0);
  const importedAfter = searchParams.get("iafter") ?? "";
  const importedBefore = searchParams.get("ibefore") ?? "";
  const domainLength = searchParams.get("len") ?? "all";
  const minDomainLength = Number(searchParams.get("lmin") ?? 0);
  const maxDomainLength = Number(searchParams.get("lmax") ?? 0);
  const minValue = Number(searchParams.get("vmin") ?? 0);
  const maxValue = Number(searchParams.get("vmax") ?? 0);
  const analysisStepMode = (searchParams.get("amode") as "all" | "none" | "complete" | "has" | "missing" | null) ?? "all";
  const analysisStep = (searchParams.get("astep") as AnalysisCategory | null) ?? "seo";
  const subAnalysisMode = (searchParams.get("samode") as "all" | "has" | "missing" | null) ?? "all";
  const subAnalysisId = searchParams.get("sasub") ?? "brand-local";
  const sortKey = (searchParams.get("sort") as QueueSortKey | null) ?? "score";
  const sortDir = (searchParams.get("dir") as QueueSortDir | null) ?? "desc";
  const [query, setQuery] = useState(queryParam);
  const [scoreMinInput, setScoreMinInput] = useState(searchParams.get("smin") ?? "");
  const [scoreMaxInput, setScoreMaxInput] = useState(searchParams.get("smax") ?? "");
  const [lengthMinInput, setLengthMinInput] = useState(searchParams.get("lmin") ?? "");
  const [lengthMaxInput, setLengthMaxInput] = useState(searchParams.get("lmax") ?? "");
  const [expiryMinInput, setExpiryMinInput] = useState(searchParams.get("emin") ?? "");
  const [expiryMaxInput, setExpiryMaxInput] = useState(searchParams.get("emax") ?? searchParams.get("expiry") ?? "");
  const [importedAfterInput, setImportedAfterInput] = useState(importedAfter);
  const [importedBeforeInput, setImportedBeforeInput] = useState(importedBefore);
  const [valueMinInput, setValueMinInput] = useState(searchParams.get("vmin") ?? "");
  const [valueMaxInput, setValueMaxInput] = useState(searchParams.get("vmax") ?? "");
  const [customPageSize, setCustomPageSize] = useState(PAGE_SIZE_OPTIONS.includes(domains.pageSize as (typeof PAGE_SIZE_OPTIONS)[number]) ? "" : String(domains.pageSize));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [analyzingQueue, setAnalyzingQueue] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"filters" | "analysis">("filters");

  const pageRows = domains.items;
  const pageSize = domains.pageSize;
  const scoreRangeFilters = [
    { id: "all", label: "Alla scores", min: "", max: "" },
    ...domains.meta.scoreBuckets.map((bucket) => ({
      id: `${bucket.min ?? ""}-${bucket.max ?? ""}`,
      label: bucket.label,
      min: bucket.min === null ? "" : String(bucket.min),
      max: bucket.max === null ? "" : String(bucket.max),
    })),
  ];
  const uniqueTlds = domains.meta.uniqueTlds;
  const uniqueSources = domains.meta.uniqueSources;
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
      "domain,score,verdict,imported_at,expires,source,value_min,value_max,currency",
      ...rows.map((row) =>
        [
          row.domain,
          row.totalScore,
          row.verdict,
          row.importedAt ?? "",
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
    setScoreMinInput("");
    setScoreMaxInput("");
    setLengthMinInput("");
    setLengthMaxInput("");
    setExpiryMinInput("");
    setExpiryMaxInput("");
    setImportedAfterInput("");
    setImportedBeforeInput("");
    setValueMinInput("");
    setValueMaxInput("");
    updateParams({ q: null, verdict: null, status: null, tld: null, src: null, tag: null, watched: null, hidden: null, notreviewed: null, smin: null, smax: null, emin: null, emax: null, expiry: null, iafter: null, ibefore: null, len: null, lmin: null, lmax: null, vmin: null, vmax: null, amode: null, astep: null, samode: null, sasub: null, page: null });
  };

  const allTags = Array.from(new Set(Object.values(userState.state.notes).flatMap((note) => note.tags))).sort();
  const activeFilters =
    (queryParam ? 1 : 0) +
    (verdict !== "all" ? 1 : 0) +
    (status !== "all" ? 1 : 0) +
    (tld !== "all" ? 1 : 0) +
    (source !== "all" ? 1 : 0) +
    (tagFilter ? 1 : 0) +
    (onlyWatched ? 1 : 0) +
    (hideReviewed ? 1 : 0) +
    (minScore > 0 ? 1 : 0) +
    (maxScore > 0 ? 1 : 0) +
    (minDaysUntilExpiry > 0 ? 1 : 0) +
    (maxDaysUntilExpiry > 0 ? 1 : 0) +
    (importedAfter ? 1 : 0) +
    (importedBefore ? 1 : 0) +
    (domainLength !== "all" ? 1 : 0) +
    (minDomainLength > 0 ? 1 : 0) +
    (maxDomainLength > 0 ? 1 : 0) +
    (minValue > 0 ? 1 : 0) +
    (maxValue > 0 ? 1 : 0) +
    (analysisStepMode !== "all" ? 1 : 0) +
    (subAnalysisMode !== "all" ? 1 : 0);

  const applyCustomRanges = () => {
    updateParams({
      smin: scoreMinInput.trim(),
      smax: scoreMaxInput.trim(),
      lmin: lengthMinInput.trim(),
      lmax: lengthMaxInput.trim(),
      emin: expiryMinInput.trim(),
      emax: expiryMaxInput.trim(),
      iafter: importedAfterInput.trim(),
      ibefore: importedBeforeInput.trim(),
      vmin: valueMinInput.trim(),
      vmax: valueMaxInput.trim(),
      expiry: null,
      len: null,
      page: "1",
    });
  };

  const updatePageSize = (nextPageSize: number) => {
    const normalized = Math.max(1, Math.min(Math.floor(nextPageSize), 1000));
    updateParams({ ps: normalized === DEFAULT_PAGE_SIZE ? null : String(normalized), page: "1" });
  };

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
      router.refresh();
    } catch (error) {
      toast.error("Kunde inte köra analyskön", error instanceof Error ? error.message : "Okänt fel");
    } finally {
      setAnalyzingQueue(false);
    }
  };

  return (
    <div className="-my-6 -mr-8 grid min-h-[calc(100vh-3.5rem)] grid-cols-[minmax(0,1fr)_340px] gap-x-6">
      <div className="col-start-1 py-6">
        <PageHeader
          title="Analyskö"
          subtitle="Alla analyserade domäner. Filtrera, sortera, markera och agera i grupp."
        />
      </div>

      <aside className="sticky top-[-1.5rem] col-start-2 row-start-1 row-span-2 flex h-[calc(100vh-3.5rem)] flex-col border-l bg-surface">
        <div className="border-b p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Analyskö</h2>
              <p className="mt-0.5 text-xs text-muted">
                {domains.total} resultat{showHidden && " · visar dolda"}
              </p>
            </div>
            {activeFilters > 0 && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted hover:bg-bg hover:text-fg"
              >
                <X size={12} />
                Rensa
              </button>
            )}
          </div>
          <div className="flex gap-1 rounded-lg border bg-bg p-1">
            {([
              { id: "filters", label: "Filter" },
              { id: "analysis", label: "Kör analys" },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSidebarTab(tab.id)}
                className={clsx(
                  "flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                  sidebarTab === tab.id ? "bg-fg text-bg" : "text-muted hover:bg-surface hover:text-fg",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted">
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

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        <div className="space-y-4">
          {sidebarTab === "filters" ? (
            <>
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

          <div className="flex flex-wrap gap-1 rounded-lg border bg-surface p-1">
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

          <div className="flex flex-wrap gap-1 rounded-lg border bg-surface p-1">
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

          <div className="flex flex-wrap items-center gap-1 rounded-lg border bg-surface p-1">
            {([
              { id: "all", label: "Alla steg" },
              { id: "none", label: "Ej analyserad" },
              { id: "complete", label: "8/8 steg" },
              { id: "has", label: "Har steg" },
              { id: "missing", label: "Saknar steg" },
            ] as const).map((filter) => (
              <button
                key={filter.id}
                onClick={() => updateParams({ amode: filter.id, astep: filter.id === "has" || filter.id === "missing" ? analysisStep : null, page: "1" })}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  analysisStepMode === filter.id ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                )}
              >
                {filter.label}
              </button>
            ))}
            {(analysisStepMode === "has" || analysisStepMode === "missing") && (
              <select
                value={analysisStep}
                onChange={(event) => updateParams({ astep: event.target.value, page: "1" })}
                className="h-7 rounded-md border bg-bg px-2 text-xs outline-none focus:border-fg/30"
              >
                {analysisStepMeta.map((step) => (
                  <option key={step.id} value={step.id}>{step.label}</option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2 rounded-lg border bg-surface p-2">
            <div className="flex flex-wrap items-center gap-1">
              {([
                { id: "all", label: "Alla subdelar" },
                { id: "has", label: "Har subdel" },
                { id: "missing", label: "Saknar subdel" },
              ] as const).map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => updateParams({ samode: filter.id, sasub: filter.id === "has" || filter.id === "missing" ? subAnalysisId : null, page: "1" })}
                  className={clsx(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    subAnalysisMode === filter.id ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            {(subAnalysisMode === "has" || subAnalysisMode === "missing") && (
              <select
                value={subAnalysisId}
                onChange={(event) => updateParams({ sasub: event.target.value, page: "1" })}
                className="w-full rounded-md border bg-bg px-2 py-1.5 text-xs outline-none focus:border-fg/30"
              >
                {analysisStepMeta.map((step) => (
                  <optgroup key={step.id} label={step.label}>
                    {analysisSubStepMeta[step.id].map((subStep) => (
                      <option key={subStep.id} value={subStep.id}>
                        {subStep.label} - {subStep.apiLabel}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-wrap gap-1 rounded-lg border bg-surface p-1">
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

          {uniqueSources.length > 1 && (
            <div className="flex flex-wrap gap-1 rounded-lg border bg-surface p-1">
              <button
                onClick={() => updateParams({ src: "all", page: "1" })}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  source === "all" ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                )}
              >
                Alla källor
              </button>
              {uniqueSources.map((value) => (
                <button
                  key={value}
                  onClick={() => updateParams({ src: value, page: "1" })}
                  className={clsx(
                    "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                    source === value ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                  )}
                >
                  {value.replace("-", " ")}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1 rounded-lg border bg-surface p-1">
            {([
              { id: "all", label: "Alla längder" },
              { id: "short", label: "Kort (≤7)" },
              { id: "medium", label: "Medel (8–12)" },
              { id: "long", label: "Lång (13+)" },
            ] as const).map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setLengthMinInput("");
                  setLengthMaxInput("");
                  updateParams({ len: opt.id, lmin: null, lmax: null, page: "1" });
                }}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  domainLength === opt.id && minDomainLength === 0 && maxDomainLength === 0 ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex gap-1 flex-wrap rounded-lg border bg-surface p-1">
            {scoreRangeFilters.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setScoreMinInput(opt.min);
                  setScoreMaxInput(opt.max);
                  updateParams({ smin: opt.min, smax: opt.max, page: "1" });
                }}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  (opt.id === "all"
                    ? minScore === 0 && maxScore === 0
                    : String(minScore || "") === opt.min && String(maxScore || "") === opt.max)
                    ? "bg-fg text-bg"
                    : "text-muted hover:bg-bg hover:text-fg",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex gap-1 flex-wrap rounded-lg border bg-surface p-1">
            {([
              { id: "0", label: "Alla datum" },
              { id: "7", label: "≤7d" },
              { id: "14", label: "≤14d" },
              { id: "30", label: "≤30d" },
            ] as const).map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setExpiryMinInput("");
                  setExpiryMaxInput(opt.id === "0" ? "" : opt.id);
                  updateParams({ emin: null, emax: opt.id === "0" ? null : opt.id, expiry: null, page: "1" });
                }}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  minDaysUntilExpiry === 0 && String(maxDaysUntilExpiry || 0) === opt.id ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <form
            className="flex flex-col w-full gap-2 rounded-lg border bg-surface p-2"
            onSubmit={(event) => {
              event.preventDefault();
              applyCustomRanges();
            }}
          >
            <RangeInputs
              label="Score"
              minValue={scoreMinInput}
              maxValue={scoreMaxInput}
              minPlaceholder={String(domains.meta.scoreRange.min)}
              maxPlaceholder={String(domains.meta.scoreRange.max)}
              onMinChange={setScoreMinInput}
              onMaxChange={setScoreMaxInput}
            />
            <RangeInputs
              label="Tecken"
              minValue={lengthMinInput}
              maxValue={lengthMaxInput}
              minPlaceholder={String(domains.meta.labelLengthRange.min)}
              maxPlaceholder={String(domains.meta.labelLengthRange.max)}
              onMinChange={setLengthMinInput}
              onMaxChange={setLengthMaxInput}
            />
            <RangeInputs
              label="Utgar om dagar"
              minValue={expiryMinInput}
              maxValue={expiryMaxInput}
              minPlaceholder="0"
              maxPlaceholder="30"
              onMinChange={setExpiryMinInput}
              onMaxChange={setExpiryMaxInput}
            />
            <div>
              <div className="mb-1 text-[11px] font-medium text-muted">Importerad</div>
              <div className="grid grid-cols-2 gap-1">
                <Input
                  type="date"
                  value={importedAfterInput}
                  onChange={(event) => setImportedAfterInput(event.target.value)}
                  aria-label="Importerad fran"
                />
                <Input
                  type="date"
                  value={importedBeforeInput}
                  onChange={(event) => setImportedBeforeInput(event.target.value)}
                  aria-label="Importerad till"
                />
              </div>
            </div>
            <RangeInputs
              label="Varde SEK"
              minValue={valueMinInput}
              maxValue={valueMaxInput}
              minPlaceholder={String(domains.meta.valueRange.min)}
              maxPlaceholder={String(domains.meta.valueRange.max)}
              onMinChange={setValueMinInput}
              onMaxChange={setValueMaxInput}
            />
            <Button variant="secondary" className="self-end" type="submit">
              Filtrera
            </Button>
          </form>

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

          {userState.state.reviewed.length > 0 && (
            <button
              onClick={() => updateParams({ notreviewed: hideReviewed ? null : "1", page: "1" })}
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
                hideReviewed ? "border-fg bg-fg text-bg" : "bg-surface text-muted hover:bg-bg hover:text-fg",
              )}
            >
              <Eye size={12} />
              Dölj granskade
              <span className={clsx("rounded px-1 tabular-nums", hideReviewed ? "bg-bg/20" : "bg-fg/10")}>
                {userState.state.reviewed.length}
              </span>
            </button>
          )}

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
        <div className="text-xs text-muted">
          {domains.total} resultat
          {showHidden && " · visar dolda"}
        </div>
            </>
          ) : (
            <AnalysisQueuePanel
              onRun={analyzeQueue}
              pending={analyzingQueue}
              selectedSlugs={Array.from(selected)}
            />
          )}
      </div>
      </div>

      </aside>

      <div className="col-start-1 row-start-2 space-y-6 pb-6">
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
            <SortableTh className="w-36" active={sortKey === "analysis"} dir={sortDir} onClick={() => toggleSort("analysis")}>
              Analyssteg
            </SortableTh>
            <SortableTh className="w-28" active={sortKey === "subanalysis"} dir={sortDir} onClick={() => toggleSort("subanalysis")}>
              Subdelar
            </SortableTh>
            <SortableTh active={sortKey === "expires"} dir={sortDir} onClick={() => toggleSort("expires")}>
              Utgår
            </SortableTh>
            <SortableTh active={sortKey === "imported"} dir={sortDir} onClick={() => toggleSort("imported")}>
              Importerad
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
              <Td colSpan={12} className="py-10 text-center text-sm text-muted">
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
                  <VerdictBadge verdict={domain.verdict} status={domain.status} analyzed={getDomainAnalysisSteps(domain).length > 0} />
                </Td>
                <Td>
                  <ScoreBar score={domain.totalScore} maxScore={domain.scoreMax} showValue />
                </Td>
                <Td>
                  <AnalysisStepIndicator steps={getDomainAnalysisSteps(domain)} coverage={getDomainAnalysisCoverage(domain)} />
                </Td>
                <Td className="text-xs text-muted">
                  <span className="font-medium tabular-nums text-fg">{domain.subAnalysisCount ?? domain.completedSubAnalysisIds?.length ?? 0}</span>
                  <span className="text-muted">/{analysisSubStepOptions.length}</span>
                </Td>
                <Td>
                  <ExpiryBadge expiresAt={domain.expiresAt} source={domain.source} variant="long" />
                </Td>
                <Td className="text-xs text-muted">{domain.importedAt ? domain.importedAt.slice(0, 10) : "-"}</Td>
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

      {domains.total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <div>
            Visar {clampedPage * pageSize + 1}-{Math.min((clampedPage + 1) * pageSize, domains.total)} av {domains.total}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="mr-1">Per sida</span>
              <div className="flex gap-1 flex-wrap rounded-lg border bg-surface p-1">
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setCustomPageSize("");
                      updatePageSize(option);
                    }}
                    className={clsx(
                      "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                      pageSize === option ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <form
                className="flex items-center gap-1"
                onSubmit={(event) => {
                  event.preventDefault();
                  updatePageSize(Number(customPageSize) || pageSize);
                }}
              >
                <Input
                  type="number"
                  min={1}
                  max={1000}
                  value={customPageSize}
                  onChange={(event) => setCustomPageSize(event.target.value)}
                  placeholder="Custom"
                  className={clsx(
                    "h-8 w-24 px-2 text-xs",
                    !PAGE_SIZE_OPTIONS.includes(pageSize as (typeof PAGE_SIZE_OPTIONS)[number]) && "border-fg/40",
                  )}
                />
                <Button variant="secondary" className="h-8 px-2 text-xs" type="submit">
                  OK
                </Button>
              </form>
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
        </div>
      )}
      </div>
    </div>
  );
}

function RangeInputs({
  label,
  minValue,
  maxValue,
  minPlaceholder,
  maxPlaceholder,
  onMinChange,
  onMaxChange,
}: {
  label: string;
  minValue: string;
  maxValue: string;
  minPlaceholder: string;
  maxPlaceholder: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-1 text-[11px] font-medium text-muted">{label}</div>
      <div className="grid grid-cols-2 gap-1.5">
        <Input
          type="number"
          min={0}
          value={minValue}
          onChange={(event) => onMinChange(event.target.value)}
          placeholder={`Min ${minPlaceholder}`}
          className="h-8 px-2 text-xs"
        />
        <Input
          type="number"
          min={0}
          value={maxValue}
          onChange={(event) => onMaxChange(event.target.value)}
          placeholder={`Max ${maxPlaceholder}`}
          className="h-8 px-2 text-xs"
        />
      </div>
    </div>
  );
}

function getDomainAnalysisSteps(domain: DomainAnalysis) {
  return analysisStepMeta
    .filter((step) => {
      const category = domain.categories[step.id];
      return category.score > 0 || category.signals.length > 0 || Boolean(category.verdict);
    })
    .map((step) => step.id);
}

function getDomainAnalysisCoverage(domain: DomainAnalysis): Partial<Record<AnalysisCategory, number>> {
  return analysisStepMeta.reduce<Partial<Record<AnalysisCategory, number>>>((acc, step) => {
    const category = domain.categories[step.id];
    if (category.subAnalyses?.length) {
      const total = category.subAnalyses.reduce((sum, item) => sum + item.maxScore, 0);
      const available = category.subAnalyses.filter((item) => item.status === "complete").reduce((sum, item) => sum + item.maxScore, 0);
      acc[step.id] = total > 0 ? Math.round((available / total) * 100) : 0;
    } else {
      acc[step.id] = Math.max(0, Math.min(100, category.scoreMax ?? 0));
    }
    return acc;
  }, {});
}

function AnalysisStepIndicator({
  steps,
  coverage,
}: {
  steps: AnalysisCategory[];
  coverage?: Partial<Record<AnalysisCategory, number>>;
}) {
  const completed = new Set(steps);
  const label = steps.length > 0
    ? `Analyserad: ${analysisStepMeta.filter((step) => completed.has(step.id)).map((step) => step.label).join(", ")}`
    : "Ej analyserad";

  return (
    <div className="flex items-center gap-1" title={label} aria-label={label}>
      {analysisStepMeta.map((step) => {
        const pct = coverage?.[step.id] ?? (completed.has(step.id) ? 100 : 0);
        return (
          <span
            key={step.id}
            className={clsx(
              "h-1.5 w-3 rounded-full transition-colors",
              pct >= 100 ? "bg-fg/70" : pct > 0 ? "bg-fg/35" : "bg-fg/10",
            )}
            title={`${step.label}: ${pct}% tackning`}
          />
        );
      })}
      <span className="ml-1 text-[10px] font-medium tabular-nums text-muted">
        {steps.length}/8
      </span>
    </div>
  );
}

function AnalysisQueuePanel({
  onRun,
  pending,
  selectedSlugs,
}: {
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
  const [selectedSubAnalyses, setSelectedSubAnalyses] = useState<SelectedSubAnalyses>(() => buildDefaultSelectedSubAnalyses());

  const selectedAvailable = selectedSlugs.length > 0;
  const selectedCategories = steps.includes("overview")
    ? analysisStepMeta.map((step) => step.id)
    : steps.filter((step): step is AnalysisCategory => step !== "overview");
  const selectedSubStepCount = selectedCategories.reduce((sum, category) => sum + (selectedSubAnalyses[category]?.length ?? 0), 0);
  const canRun = steps.length > 0 && selectedSubStepCount > 0 && (scope !== "selected" || selectedAvailable);

  const toggleStep = (step: AnalysisStep) => {
    setSteps((current) => (current.includes(step) ? current.filter((item) => item !== step) : [...current, step]));
  };

  const toggleSubStep = (category: AnalysisCategory, subStepId: string) => {
    setSelectedSubAnalyses((current) => {
      const currentIds = current[category] ?? [];
      const nextIds = currentIds.includes(subStepId)
        ? currentIds.filter((id) => id !== subStepId)
        : [...currentIds, subStepId];
      return { ...current, [category]: nextIds };
    });
    setSteps((current) => {
      if (current.includes("overview") || current.includes(category)) return current;
      return [...current, category];
    });
  };

  const run = () => {
    if (!canRun) return;
    void onRun({
      scope,
      slugs: scope === "selected" ? selectedSlugs : undefined,
      limit: limitMode === "all" ? "all" : limit,
      steps,
      selectedSubAnalyses,
      sortBy,
      missingStep: scope === "missing-step" ? missingStep : null,
      dateFilter: dateMode === "any" ? null : { direction: dateMode, date },
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-bg p-3">
        <div className="text-sm font-semibold tracking-tight">Kör analys</div>
        <div className="mt-1 text-xs text-muted">Välj vilka domäner som ska analyseras, ordning och analyssteg.</div>
        <Button onClick={run} disabled={!canRun || pending} className="mt-3 w-full gap-1.5">
          {pending ? <LoaderCircle size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
          {pending ? "Analyserar..." : "Starta körning"}
        </Button>
      </div>
      <div className="space-y-4">
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
              <span className="text-[11px] text-muted">{steps.length} steg, {selectedSubStepCount} delar</span>
            </div>
            <div className="mt-2 grid gap-2">
              {queueAnalysisSteps.map((step) => {
                const active = steps.includes(step.id);
                const category = step.id === "overview" ? null : step.id;
                return (
                  <div
                    key={step.id}
                    className={clsx(
                      "rounded-xl border p-3 transition-colors",
                      active ? "border-fg bg-fg/5" : "hover:bg-bg/60",
                    )}
                  >
                    <button type="button" onClick={() => toggleStep(step.id)} className="w-full text-left">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-medium">{step.label}</div>
                          <div className="mt-0.5 text-xs text-muted">{step.hint}</div>
                        </div>
                        <span
                          className={clsx(
                            "rounded border px-1.5 py-0.5 text-[10px] font-medium",
                            active ? "border-fg/20 bg-fg text-bg" : "bg-bg text-muted",
                          )}
                        >
                          {active ? "Vald" : "Av"}
                        </span>
                      </div>
                    </button>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {analysisStepRequirements[step.id].map((requirement) => (
                        <span
                          key={requirement}
                          className={clsx(
                            "rounded border px-1.5 py-0.5 text-[10px] font-medium",
                            active ? "border-fg/15 bg-bg/60 text-fg/80" : "bg-bg text-muted",
                          )}
                        >
                          {requirement}
                        </span>
                      ))}
                    </div>
                    {category && (
                      <div className="mt-3 grid gap-1.5">
                        {analysisSubStepMeta[category].map((subStep) => {
                          const subActive = (selectedSubAnalyses[category] ?? []).includes(subStep.id);
                          return (
                            <button
                              key={subStep.id}
                              type="button"
                              onClick={() => toggleSubStep(category, subStep.id)}
                              className={clsx(
                                "rounded-lg border px-2.5 py-2 text-left transition-colors",
                                subActive ? "border-fg/30 bg-bg" : "border-border/80 bg-surface/60 opacity-60 hover:opacity-100",
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="text-xs font-semibold">{subStep.label}</div>
                                  <div className="mt-0.5 text-[11px] text-muted">{subStep.hint}</div>
                                </div>
                                <span
                                  className={clsx(
                                    "shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium",
                                    subStep.usesApiKey
                                      ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
                                      : "border-emerald-500/25 bg-emerald-500/10 text-emerald-700",
                                  )}
                                >
                                  {subStep.apiLabel}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center justify-between text-[10px] text-muted">
                                <span>{subActive ? "Aktiv" : "Inaktiv"}</span>
                                <span>Max {subStep.maxScore}p</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
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
