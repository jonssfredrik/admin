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
import { domainAnalyses, verdictMeta, type Verdict } from "@/modules/snaptld/data/core";
import { ScoreBar } from "@/modules/snaptld/components/ScoreBar";
import { VerdictBadge } from "@/modules/snaptld/components/VerdictBadge";
import { ExpiryBadge } from "@/modules/snaptld/components/ExpiryBadge";
import { WatchButton } from "@/modules/snaptld/components/WatchButton";
import { Checkbox } from "@/modules/snaptld/components/Checkbox";
import { useWatchlist } from "@/modules/snaptld/lib/watchlist";
import { useHidden, useReviewed } from "@/modules/snaptld/lib/reviewed";
import { useDomainNotes } from "@/modules/snaptld/lib/notes";
import { expiryInfo } from "@/modules/snaptld/lib/urgency";

const verdictFilters: { id: "all" | Verdict; label: string }[] = [
  { id: "all", label: "Alla" },
  { id: "excellent", label: verdictMeta.excellent.label },
  { id: "good", label: verdictMeta.good.label },
  { id: "mediocre", label: verdictMeta.mediocre.label },
  { id: "skip", label: verdictMeta.skip.label },
];

type SortKey = "score" | "domain" | "expires" | "value";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 20;

function parseValue(range: string): number {
  const m = range.match(/(\d[\d\s]*)/);
  return m ? parseInt(m[1].replace(/\s/g, ""), 10) : 0;
}

export function QueuePage() {
  const toast = useToast();
  const watchlist = useWatchlist();
  const hidden = useHidden();
  const reviewed = useReviewed();
  const notes = useDomainNotes();

  const [query, setQuery] = useState("");
  const [verdict, setVerdict] = useState<(typeof verdictFilters)[number]["id"]>("all");
  const [tld, setTld] = useState<"all" | string>("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [onlyWatched, setOnlyWatched] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);

  const uniqueTlds = useMemo(
    () => Array.from(new Set(domainAnalyses.map((d) => d.tld))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const watched = new Set(watchlist.slugs);
    const hiddenSet = new Set(hidden.values);

    const base = domainAnalyses.filter((d) => {
      if (verdict !== "all" && d.verdict !== verdict) return false;
      if (tld !== "all" && d.tld !== tld) return false;
      if (tagFilter && !(notes.get(d.slug)?.tags.includes(tagFilter) ?? false)) return false;
      if (onlyWatched && !watched.has(d.slug)) return false;
      const isHidden = hiddenSet.has(d.slug);
      if (isHidden && !showHidden) return false;
      if (!isHidden && showHidden) return false;
      if (q && !d.domain.toLowerCase().includes(q) && !d.source.toLowerCase().includes(q)) return false;
      return true;
    });

    const dir = sortDir === "asc" ? 1 : -1;
    return base.sort((a, b) => {
      switch (sortKey) {
        case "domain":
          return a.domain.localeCompare(b.domain) * dir;
        case "expires":
          return (expiryInfo(a.expiresAt).days - expiryInfo(b.expiresAt).days) * dir;
        case "value":
          return (parseValue(a.estimatedValue) - parseValue(b.estimatedValue)) * dir;
        case "score":
        default:
          return (a.totalScore - b.totalScore) * dir;
      }
    });
  }, [query, verdict, tld, tagFilter, onlyWatched, showHidden, sortKey, sortDir, watchlist.slugs, hidden.values, notes.map]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(clampedPage * PAGE_SIZE, (clampedPage + 1) * PAGE_SIZE);

  const visibleSelectedCount = pageRows.filter((r) => selected.has(r.slug)).length;
  const allOnPageSelected = pageRows.length > 0 && visibleSelectedCount === pageRows.length;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "domain" ? "asc" : "desc");
    }
  };

  const toggleSelection = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const toggleSelectPage = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) pageRows.forEach((r) => next.delete(r.slug));
      else pageRows.forEach((r) => next.add(r.slug));
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const bulkWatch = () => {
    const slugs = Array.from(selected);
    slugs.forEach((s) => {
      if (!watchlist.has(s)) watchlist.add(s);
    });
    toast.success(`Bevakar ${slugs.length} domäner`);
    clearSelection();
  };

  const bulkHide = () => {
    const slugs = Array.from(selected);
    hidden.addMany(slugs);
    toast.success(`${slugs.length} domäner dolda`);
    clearSelection();
  };

  const bulkReviewed = () => {
    const slugs = Array.from(selected);
    reviewed.addMany(slugs);
    toast.success(`${slugs.length} markerade som granskade`);
    clearSelection();
  };

  const bulkExport = () => {
    const slugs = Array.from(selected);
    const rows = domainAnalyses.filter((d) => slugs.includes(d.slug));
    const csv = [
      "domain,score,verdict,expires,source,value",
      ...rows.map((r) =>
        [r.domain, r.totalScore, r.verdict, r.expiresAt, r.source, r.estimatedValue].join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `snaptld-urval-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
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

  const allTags = notes.allTags();
  const activeFilters =
    (query ? 1 : 0) + (verdict !== "all" ? 1 : 0) + (tld !== "all" ? 1 : 0) + (tagFilter ? 1 : 0) + (onlyWatched ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Analyskö"
          subtitle="Alla analyserade domäner. Filtrera, sortera, markera — och agera i grupp."
        />
        <div className="flex items-center gap-3 text-xs text-muted">
          {reviewed.hydrated && reviewed.count > 0 && (
            <span>{reviewed.count} granskade</span>
          )}
          {hidden.hydrated && hidden.count > 0 && (
            <button
              onClick={() => setShowHidden((v) => !v)}
              className="inline-flex items-center gap-1 hover:text-fg"
            >
              {showHidden ? <Eye size={12} /> : <EyeOff size={12} />}
              {hidden.count} dolda
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sök domän eller källa…"
            />
          </div>

          <div className="flex gap-1 rounded-lg border bg-surface p-1">
            {verdictFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => setVerdict(f.id)}
                className={clsx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  verdict === f.id ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                )}
              >
                {f.label}
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
            {uniqueTlds.map((t) => (
              <button
                key={t}
                onClick={() => setTld(t)}
                className={clsx(
                  "rounded-md px-2 py-1 font-mono text-xs font-medium transition-colors",
                  tld === t ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOnlyWatched((v) => !v)}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
              onlyWatched ? "border-fg bg-fg text-bg" : "bg-surface text-muted hover:bg-bg hover:text-fg",
            )}
          >
            <Bookmark size={12} />
            Bevakade
            {watchlist.hydrated && watchlist.count > 0 && (
              <span className={clsx("rounded px-1 tabular-nums", onlyWatched ? "bg-bg/20" : "bg-fg/10")}>
                {watchlist.count}
              </span>
            )}
          </button>

          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 border-l pl-2">
              <span className="text-[11px] text-muted">Taggar:</span>
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTagFilter(tagFilter === t ? null : t)}
                  className={clsx(
                    "rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
                    tagFilter === t ? "bg-fg text-bg" : "border bg-surface text-muted hover:text-fg",
                  )}
                >
                  #{t}
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
          {pageRows.map((d) => {
            const isSelected = selected.has(d.slug);
            const isReviewed = reviewed.has(d.slug);
            return (
              <tr
                key={d.slug}
                className={clsx(
                  "transition-colors hover:bg-bg/50",
                  isSelected && "bg-fg/[0.03]",
                  isReviewed && "opacity-60",
                )}
              >
                <Td className="pr-0">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleSelection(d.slug)}
                    ariaLabel={`Välj ${d.domain}`}
                  />
                </Td>
                <Td className="pr-0">
                  <WatchButton slug={d.slug} domain={d.domain} variant="icon" />
                </Td>
                <Td>
                  <Link href={`/snaptld/${d.slug}`} className="block">
                    <div className="flex items-center gap-2 font-medium hover:underline">
                      {d.domain}
                      {isReviewed && (
                        <span className="rounded bg-fg/5 px-1 text-[10px] font-medium uppercase tracking-wider text-muted">
                          Granskad
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted">Hämtad {d.fetchedAt}</div>
                  </Link>
                </Td>
                <Td>
                  <VerdictBadge verdict={d.verdict} />
                </Td>
                <Td>
                  <ScoreBar score={d.totalScore} showValue />
                </Td>
                <Td>
                  <ExpiryBadge expiresAt={d.expiresAt} variant="long" />
                </Td>
                <Td className="text-xs capitalize text-muted">{d.source.replace("-", " ")}</Td>
                <Td className="text-right text-xs font-medium">{d.estimatedValue}</Td>
                <Td>
                  <RowMenu
                    items={[
                      { label: "Öppna detalj", onClick: () => window.location.assign(`/snaptld/${d.slug}`) },
                      { label: "Kör om analys", icon: RefreshCcw, onClick: () => toast.info("Analys kölagd", d.domain) },
                      { label: "Exportera rapport", icon: Download, onClick: () => toast.success("Rapport nedladdad", d.domain) },
                      { divider: true },
                      {
                        label: isReviewed ? "Ångra granskad" : "Markera granskad",
                        icon: Eye,
                        onClick: () => reviewed.toggle(d.slug),
                      },
                      {
                        label: hidden.has(d.slug) ? "Visa igen" : "Dölj domän",
                        icon: hidden.has(d.slug) ? Eye : EyeOff,
                        onClick: () => hidden.toggle(d.slug),
                      },
                      { divider: true },
                      { label: "Ta bort", icon: Trash2, danger: true, onClick: () => toast.error("Borttagen", d.domain) },
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
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
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
  dir: SortDir;
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
        {active ? (
          dir === "asc" ? <ArrowUp size={10} /> : <ArrowDown size={10} />
        ) : (
          <span className="inline-block h-[10px] w-[10px]" />
        )}
      </button>
    </Th>
  );
}
