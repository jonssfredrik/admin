"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
  RefreshCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/Input";
import { Table, Th, Td } from "@/components/ui/Table";
import { RowMenu } from "@/components/ui/RowMenu";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { ScoreBar } from "@/modules/snaptld/components/ScoreBar";
import { VerdictBadge } from "@/modules/snaptld/components/VerdictBadge";
import { ExpiryBadge } from "@/modules/snaptld/components/ExpiryBadge";
import { WatchButton } from "@/modules/snaptld/components/WatchButton";
import { Checkbox } from "@/modules/snaptld/components/Checkbox";
import { SnapTldUserStateProvider, useSnapTldUserState } from "@/modules/snaptld/client/SnapTldUserStateProvider";
import { formatMoneyRange } from "@/modules/snaptld/lib/format";
import { getQueueRows, getUniqueTlds, type QueueSortDir, type QueueSortKey } from "@/modules/snaptld/selectors/queue";
import { verdictMeta } from "@/modules/snaptld/data/core";
import type { DomainAnalysis, SnapTldUserState, Verdict } from "@/modules/snaptld/types";

const verdictFilters: { id: "all" | Verdict; label: string }[] = [
  { id: "all", label: "Alla" },
  { id: "excellent", label: verdictMeta.excellent.label },
  { id: "good", label: verdictMeta.good.label },
  { id: "mediocre", label: verdictMeta.mediocre.label },
  { id: "skip", label: verdictMeta.skip.label },
];

const PAGE_SIZE = 20;

export function QueuePage({
  domains,
  initialUserState,
}: {
  domains: DomainAnalysis[];
  initialUserState: SnapTldUserState;
}) {
  return (
    <SnapTldUserStateProvider initialState={initialUserState}>
      <QueuePageContent domains={domains} />
    </SnapTldUserStateProvider>
  );
}

function QueuePageContent({ domains }: { domains: DomainAnalysis[] }) {
  const toast = useToast();
  const userState = useSnapTldUserState();

  const [query, setQuery] = useState("");
  const [verdict, setVerdict] = useState<(typeof verdictFilters)[number]["id"]>("all");
  const [tld, setTld] = useState<"all" | string>("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [onlyWatched, setOnlyWatched] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [sortKey, setSortKey] = useState<QueueSortKey>("score");
  const [sortDir, setSortDir] = useState<QueueSortDir>("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);

  const uniqueTlds = useMemo(() => getUniqueTlds(domains), [domains]);

  const filtered = useMemo(() => {
    const tagMap = new Map(
      Object.entries(userState.state.notes).map(([slug, note]) => [slug, note.tags]),
    );

    return getQueueRows(
      domains,
      { query, verdict, tld, tagFilter, onlyWatched, showHidden },
      sortKey,
      sortDir,
      userState.state.watchlist,
      userState.state.hidden,
      tagMap,
    );
  }, [domains, query, verdict, tld, tagFilter, onlyWatched, showHidden, sortKey, sortDir, userState.state.watchlist, userState.state.hidden, userState.state.notes]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(clampedPage * PAGE_SIZE, (clampedPage + 1) * PAGE_SIZE);

  const visibleSelectedCount = pageRows.filter((row) => selected.has(row.slug)).length;
  const allOnPageSelected = pageRows.length > 0 && visibleSelectedCount === pageRows.length;

  const toggleSort = (key: QueueSortKey) => {
    if (sortKey === key) setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "domain" ? "asc" : "desc");
    }
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
    const rows = domains.filter((domain) => slugs.includes(domain.slug));
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
    setVerdict("all");
    setTld("all");
    setTagFilter(null);
    setOnlyWatched(false);
    setShowHidden(false);
  };

  const allTags = Array.from(new Set(Object.values(userState.state.notes).flatMap((note) => note.tags))).sort();
  const activeFilters =
    (query ? 1 : 0) + (verdict !== "all" ? 1 : 0) + (tld !== "all" ? 1 : 0) + (tagFilter ? 1 : 0) + (onlyWatched ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Analyskö"
          subtitle="Alla analyserade domäner. Filtrera, sortera, markera och agera i grupp."
        />
        <div className="flex items-center gap-3 text-xs text-muted">
          {userState.state.reviewed.length > 0 && <span>{userState.state.reviewed.length} granskade</span>}
          {userState.state.hidden.length > 0 && (
            <button
              onClick={() => setShowHidden((value) => !value)}
              className="inline-flex items-center gap-1 hover:text-fg"
            >
              {showHidden ? <Eye size={12} /> : <EyeOff size={12} />}
              {userState.state.hidden.length} dolda
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              className="pl-9"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sök domän eller källa..."
            />
          </div>

          <div className="flex gap-1 rounded-lg border bg-surface p-1">
            {verdictFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setVerdict(filter.id)}
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

          <button
            onClick={() => setOnlyWatched((value) => !value)}
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
                  onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
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
          {filtered.length} resultat
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
            <Th>Utlåtande</Th>
            <SortableTh className="w-52" active={sortKey === "score"} dir={sortDir} onClick={() => toggleSort("score")}>
              Score
            </SortableTh>
            <SortableTh active={sortKey === "expires"} dir={sortDir} onClick={() => toggleSort("expires")}>
              Utgår
            </SortableTh>
            <Th>Källa</Th>
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
                      { label: "Kör om analys", icon: RefreshCcw, onClick: () => toast.info("Analys kölagd", domain.domain) },
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
                      { divider: true },
                      { label: "Ta bort", icon: Trash2, danger: true, onClick: () => toast.error("Borttagen", domain.domain) },
                    ]}
                  />
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between text-xs text-muted">
          <div>
            Visar {clampedPage * PAGE_SIZE + 1}–{Math.min((clampedPage + 1) * PAGE_SIZE, filtered.length)} av {filtered.length}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              className="h-8 px-2"
              disabled={clampedPage === 0}
              onClick={() => setPage(clampedPage - 1)}
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
              onClick={() => setPage(clampedPage + 1)}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
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
