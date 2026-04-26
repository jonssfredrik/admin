"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Briefcase,
  Check,
  Copy,
  Download,
  FileText,
  History,
  LayoutDashboard,
  Link as LinkIcon,
  ListChecks,
  SearchCheck,
  ShieldAlert,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Type,
  Upload,
  X,
} from "lucide-react";
import clsx from "clsx";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useToast } from "@/components/toast/ToastProvider";
import { importDomainsAction } from "@/modules/snaptld/actions";
import { internetstiftelsenFeeds } from "@/modules/snaptld/data/feeds";
import { useAsyncAction } from "@/modules/snaptld/lib/useAsyncAction";
import type { ImportDomainsInput } from "@/modules/snaptld/types";

type Mode = ImportDomainsInput["mode"];
type AnalysisStep = ImportDomainsInput["selectedSteps"][number];

const modes: { id: Mode; label: string; icon: typeof LinkIcon; hint: string }[] = [
  { id: "url", label: "URL", icon: LinkIcon, hint: "Internetstiftelsen eller egen feed" },
  { id: "text", label: "Fritext", icon: Type, hint: "En domän per rad" },
  { id: "csv", label: "CSV", icon: FileText, hint: "domain,expires" },
  { id: "json", label: "JSON", icon: FileText, hint: "Array av domäner" },
];

const analysisSteps: {
  id: AnalysisStep;
  label: string;
  hint: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "overview", label: "Översikt", hint: "Sammanfattning och total score", icon: LayoutDashboard },
  { id: "structure", label: "Struktur", hint: "Längd, tecken och stavning", icon: ListChecks },
  { id: "lexical", label: "Lexikal", hint: "Ord, begriplighet och språkkänsla", icon: Type },
  { id: "brand", label: "Varumärke", hint: "Brandbarhet och namnkänsla", icon: Sparkles },
  { id: "market", label: "Marknad", hint: "Målgrupp och kommersiell intent", icon: Briefcase },
  { id: "risk", label: "Risk", hint: "Juridik och varningssignaler", icon: ShieldAlert },
  { id: "salability", label: "Säljbarhet", hint: "Köpare, likviditet och flip-potential", icon: ShoppingCart },
  { id: "seo", label: "SEO", hint: "Moz-data och länksignaler", icon: TrendingUp },
  { id: "history", label: "Historik", hint: "Wayback och tidigare innehåll", icon: History },
];

const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?\.[a-z]{2,}([.][a-z]{2,})?$/i;

const csvTemplate = `domain,expires,notes
exempel.se,2026-05-12,Auktion pa SnapNames
brand.nu,2026-05-18,
flow.io,2026-05-21,Prioriterad`;

const jsonTemplate = JSON.stringify(
  [
    { domain: "exempel.se", expires: "2026-05-12", notes: "Auktion pa SnapNames" },
    { domain: "brand.nu", expires: "2026-05-18" },
    { domain: "flow.io", expires: "2026-05-21", notes: "Prioriterad" },
  ],
  null,
  2,
);

interface ParseResult {
  valid: string[];
  invalid: string[];
  duplicates: string[];
}

function parseInput(mode: Mode, text: string, fileContent: string | null): ParseResult {
  const raw: string[] = [];
  const seen = new Set<string>();

  const src = mode === "text" ? text : fileContent ?? "";
  if (!src.trim()) return { valid: [], invalid: [], duplicates: [] };

  if (mode === "json") {
    try {
      const parsed = JSON.parse(src);
      if (Array.isArray(parsed)) {
        parsed.forEach((entry: unknown) => {
          if (typeof entry === "string") raw.push(entry);
          else if (entry && typeof entry === "object" && "domain" in entry) {
            const value = (entry as { domain?: unknown }).domain;
            if (typeof value === "string") raw.push(value);
          }
        });
      }
    } catch {
      return { valid: [], invalid: ["<ogiltig JSON>"], duplicates: [] };
    }
  } else if (mode === "csv") {
    src.split(/\r?\n/).forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      if (index === 0 && /^domain\b/i.test(trimmed)) return;
      const [first] = trimmed.split(",");
      if (first) raw.push(first.trim());
    });
  } else {
    src
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => raw.push(line));
  }

  const valid: string[] = [];
  const invalid: string[] = [];
  const duplicates: string[] = [];

  raw.forEach((entry) => {
    const clean = entry.toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
    if (!clean) return;
    if (!DOMAIN_RE.test(clean)) {
      invalid.push(entry);
      return;
    }
    if (seen.has(clean)) {
      duplicates.push(clean);
      return;
    }
    seen.add(clean);
    valid.push(clean);
  });

  return { valid, invalid, duplicates };
}

function downloadTemplate(mode: "csv" | "json") {
  const content = mode === "csv" ? csvTemplate : jsonTemplate;
  const blob = new Blob([content], { type: mode === "csv" ? "text/csv" : "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `snaptld-mall.${mode}`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ImportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const importAction = useAsyncAction();
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [selectedSteps, setSelectedSteps] = useState<AnalysisStep[]>([]);

  const result = useMemo(
    () => (mode === "url" ? { valid: [], invalid: [], duplicates: [] } : parseInput(mode, text, fileContent)),
    [mode, text, fileContent],
  );

  const canImport = mode === "url" ? url.trim().length > 0 : result.valid.length > 0;
  const shouldAnalyze = selectedSteps.length > 0;

  const handleFile = (file: File | null) => {
    if (!file) {
      setFileName(null);
      setFileContent(null);
      return;
    }
    setFileName(file.name);
    file.text().then(setFileContent);
  };

  const resetForm = () => {
    setMode("url");
    setUrl("");
    setText("");
    setFileName(null);
    setFileContent(null);
    setSelectedSteps([]);
    importAction.reset();
  };

  const closeDialog = () => {
    resetForm();
    onClose();
  };

  const toggleStep = (step: AnalysisStep) => {
    setSelectedSteps((current) =>
      current.includes(step) ? current.filter((item) => item !== step) : [...current, step],
    );
  };

  const handleImport = async () => {
    try {
      const response = await importAction.run(() =>
        importDomainsAction({
          mode,
          url: mode === "url" ? url.trim() : undefined,
          validDomains: result.valid,
          duplicates: result.duplicates,
          selectedSteps,
        }),
      );

      if (shouldAnalyze) {
        toast.success(
          "Analys startad",
          `${response.imported} importerade · ${selectedSteps.length} steg valda`,
        );
      } else {
        toast.success("Import klar", `${response.imported} importerade · ${response.duplicates} dubletter`);
      }

      closeDialog();
    } catch (error) {
      toast.error("Import misslyckades", error instanceof Error ? error.message : "Kunde inte importera");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      title="Importera domäner"
      description="Välj källa och vilka analyssteg som ska köras. Lämnar du allt tomt importeras domänerna utan analys."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={closeDialog} disabled={importAction.isPending}>
            Avbryt
          </Button>
          <Button onClick={handleImport} disabled={!canImport || importAction.isPending} className="gap-1.5">
            {shouldAnalyze ? <SearchCheck size={14} /> : <Upload size={14} />}
            {importAction.isPending ? "Importerar..." : shouldAnalyze ? "Starta analys" : "Importera"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {modes.map((item) => {
            const Icon = item.icon;
            const active = item.id === mode;
            return (
              <button
                key={item.id}
                onClick={() => setMode(item.id)}
                disabled={importAction.isPending}
                className={clsx(
                  "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors",
                  active ? "border-fg bg-fg/5" : "hover:bg-bg/60",
                  importAction.isPending && "opacity-60",
                )}
              >
                <Icon size={14} className={active ? "text-fg" : "text-muted"} />
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-[11px] text-muted">{item.hint}</div>
              </button>
            );
          })}
        </div>

        {mode === "url" && (
          <div>
            <Label htmlFor="url-input">Feed-URL</Label>
            <Input
              id="url-input"
              placeholder="https://data.internetstiftelsen.se/bardate_domains.json"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              disabled={importAction.isPending}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {internetstiftelsenFeeds.map((feed) => (
                <button
                  key={feed.url}
                  type="button"
                  onClick={() => setUrl(feed.url)}
                  disabled={importAction.isPending}
                  className="rounded-full border px-2.5 py-1 text-xs text-muted transition-colors hover:border-fg/30 hover:text-fg disabled:opacity-60"
                >
                  {feed.label}
                </button>
              ))}
            </div>
            <div className="mt-1.5 text-xs text-muted">
              Feeden kontrolleras vid nästa körning. Stöd finns för JSON och CSV.
            </div>
          </div>
        )}

        {mode === "text" && (
          <div>
            <Label>Domäner (en per rad)</Label>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={7}
              disabled={importAction.isPending}
              placeholder={`exempel.se\nannan-doman.nu\nbrand.io`}
              className="w-full rounded-lg border bg-surface px-3 py-2 font-mono text-sm outline-none transition-colors placeholder:text-muted focus:border-fg/30 focus:ring-2 focus:ring-fg/5 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        )}

        {(mode === "csv" || mode === "json") && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{mode === "csv" ? "CSV-fil" : "JSON-fil"}</Label>
              <button
                onClick={() => downloadTemplate(mode)}
                disabled={importAction.isPending}
                className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg disabled:opacity-60"
              >
                <Download size={11} />
                Ladda ner mall
              </button>
            </div>
            <label
              className={clsx(
                "flex cursor-pointer items-center gap-3 rounded-lg border border-dashed bg-bg/40 px-4 py-5 transition-colors hover:bg-bg/60",
                importAction.isPending && "cursor-not-allowed opacity-60",
              )}
            >
              <Upload size={18} className="text-muted" />
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {fileName ?? `Dra in eller klicka för att välja ${mode.toUpperCase()}-fil`}
                </div>
                <div className="text-xs text-muted">
                  {mode === "csv" ? "Första kolumnen ska heta 'domain'" : "Array av strängar eller objekt med domain-fält"}
                </div>
              </div>
              <input
                type="file"
                accept={mode === "csv" ? ".csv,text/csv" : ".json,application/json"}
                className="hidden"
                disabled={importAction.isPending}
                onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <Label>Analyssteg</Label>
            <span className="text-[11px] text-muted">
              {shouldAnalyze ? `${selectedSteps.length} valda` : "Inga förvalda"}
            </span>
          </div>
          <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {analysisSteps.map((step) => {
              const Icon = step.icon;
              const active = selectedSteps.includes(step.id);
              return (
                <button
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  disabled={importAction.isPending}
                  className={clsx(
                    "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                    active ? "border-fg bg-fg/5" : "hover:bg-bg/60",
                    importAction.isPending && "opacity-60",
                  )}
                >
                  <div
                    className={clsx(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      active ? "bg-fg text-bg" : "bg-bg text-muted",
                    )}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{step.label}</div>
                    <div className="text-[11px] text-muted">{step.hint}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-muted">
            Lämna allt omarkerat för att bara importera domänerna till databasen.
          </div>
        </div>

        {mode !== "url" && (result.valid.length > 0 || result.invalid.length > 0 || result.duplicates.length > 0) && (
          <ImportPreview result={result} />
        )}

        {mode !== "url" && mode !== "text" && fileContent && result.valid.length === 0 && result.invalid.length === 0 && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
            Filen verkar tom eller i fel format. Ladda ner mallen för att se förväntat schema.
          </div>
        )}
      </div>
    </Dialog>
  );
}

function ImportPreview({ result }: { result: ParseResult }) {
  const preview = result.valid.slice(0, 10);
  return (
    <div className="space-y-2 rounded-lg border bg-bg/30 p-3">
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <Check size={12} />
          <span className="font-semibold tabular-nums">{result.valid.length}</span>
          <span className="text-muted">giltiga</span>
        </div>
        {result.duplicates.length > 0 && (
          <div className="inline-flex items-center gap-1.5 text-muted">
            <Copy size={12} />
            <span className="font-semibold tabular-nums text-fg">{result.duplicates.length}</span>
            <span>dubletter hoppas över</span>
          </div>
        )}
        {result.invalid.length > 0 && (
          <div className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <AlertTriangle size={12} />
            <span className="font-semibold tabular-nums">{result.invalid.length}</span>
            <span className="text-muted">ogiltiga</span>
          </div>
        )}
      </div>

      {preview.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {preview.map((domain) => (
            <span key={domain} className="rounded-md border bg-surface px-1.5 py-0.5 font-mono text-[11px]">
              {domain}
            </span>
          ))}
          {result.valid.length > preview.length && (
            <span className="rounded-md border border-dashed bg-surface px-1.5 py-0.5 text-[11px] text-muted">
              +{result.valid.length - preview.length} till
            </span>
          )}
        </div>
      )}

      {result.invalid.length > 0 && (
        <details className="text-xs">
          <summary className="cursor-pointer text-muted hover:text-fg">
            Visa ogiltiga ({result.invalid.length})
          </summary>
          <ul className="mt-2 space-y-0.5">
            {result.invalid.slice(0, 8).map((value, index) => (
              <li key={index} className="flex items-center gap-1.5 font-mono text-[11px] text-red-600 dark:text-red-400">
                <X size={11} />
                {value}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

