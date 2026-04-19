"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, Copy, Download, FileText, Link as LinkIcon, Type, Upload, X } from "lucide-react";
import clsx from "clsx";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useToast } from "@/components/toast/ToastProvider";
import { domainAnalyses } from "@/modules/snaptld/data/core";

type Mode = "url" | "text" | "csv" | "json";

const modes: { id: Mode; label: string; icon: typeof LinkIcon; hint: string }[] = [
  { id: "url", label: "URL", icon: LinkIcon, hint: "JSON/CSV-feed" },
  { id: "text", label: "Fritext", icon: Type, hint: "En domän per rad" },
  { id: "csv", label: "CSV", icon: FileText, hint: "domain,expires" },
  { id: "json", label: "JSON", icon: FileText, hint: "Array av domäner" },
];

const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?\.[a-z]{2,}([.][a-z]{2,})?$/i;

const csvTemplate = `domain,expires,notes
exempel.se,2026-05-12,Auktion på SnapNames
brand.nu,2026-05-18,
flow.io,2026-05-21,Prioriterad`;

const jsonTemplate = JSON.stringify(
  [
    { domain: "exempel.se", expires: "2026-05-12", notes: "Auktion på SnapNames" },
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
  const existing = new Set(domainAnalyses.map((d) => d.domain.toLowerCase()));
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
            const v = (entry as { domain?: unknown }).domain;
            if (typeof v === "string") raw.push(v);
          }
        });
      }
    } catch {
      return { valid: [], invalid: ["<ogiltig JSON>"], duplicates: [] };
    }
  } else if (mode === "csv") {
    src.split(/\r?\n/).forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      if (i === 0 && /^domain\b/i.test(trimmed)) return;
      const [first] = trimmed.split(",");
      if (first) raw.push(first.trim());
    });
  } else {
    src
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach((l) => raw.push(l));
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
    if (existing.has(clean) || seen.has(clean)) {
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
  const a = document.createElement("a");
  a.href = url;
  a.download = `snaptld-mall.${mode}`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ImportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [priority, setPriority] = useState(false);

  const result = useMemo(
    () => (mode === "url" ? { valid: [], invalid: [], duplicates: [] } : parseInput(mode, text, fileContent)),
    [mode, text, fileContent],
  );

  const canImport = mode === "url" ? url.trim().length > 0 : result.valid.length > 0;

  const handleFile = (file: File | null) => {
    if (!file) {
      setFileName(null);
      setFileContent(null);
      return;
    }
    setFileName(file.name);
    file.text().then(setFileContent);
  };

  const handleImport = () => {
    const label = mode === "url"
      ? "URL-feed kölagd för nästa körning"
      : `${result.valid.length} domäner kölagda${result.duplicates.length ? ` · ${result.duplicates.length} dubletter hoppades över` : ""}`;
    toast.success(priority ? "Prioriterad analys startad" : "Import klar", label);
    setUrl("");
    setText("");
    setFileName(null);
    setFileContent(null);
    setPriority(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Importera domäner"
      description="Analysen startar automatiskt när domäner har kölagts."
      size="lg"
      footer={
        <>
          <label className="mr-auto flex cursor-pointer items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={priority}
              onChange={(e) => setPriority(e.target.checked)}
              className="h-3.5 w-3.5 accent-fg"
            />
            Kör före andra kö-jobb
          </label>
          <Button variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
          <Button onClick={handleImport} disabled={!canImport} className="gap-1.5">
            <Upload size={14} />
            Starta analys
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {modes.map((m) => {
            const Icon = m.icon;
            const active = m.id === mode;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={clsx(
                  "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors",
                  active ? "border-fg bg-fg/5" : "hover:bg-bg/60",
                )}
              >
                <Icon size={14} className={active ? "text-fg" : "text-muted"} />
                <div className="text-sm font-medium">{m.label}</div>
                <div className="text-[11px] text-muted">{m.hint}</div>
              </button>
            );
          })}
        </div>

        {mode === "url" && (
          <div>
            <Label htmlFor="url-input">Feed-URL</Label>
            <Input
              id="url-input"
              placeholder="https://data.internetstiftelsen.se/expired/daily.json"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <div className="mt-1.5 text-xs text-muted">
              Feeden kontrolleras vid nästa körning. Stöds för JSON och CSV.
            </div>
          </div>
        )}

        {mode === "text" && (
          <div>
            <Label>Domäner (en per rad)</Label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={7}
              placeholder={`exempel.se\nannan-domän.nu\nbrand.io`}
              className="w-full rounded-lg border bg-surface px-3 py-2 font-mono text-sm outline-none transition-colors placeholder:text-muted focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
            />
          </div>
        )}

        {(mode === "csv" || mode === "json") && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{mode === "csv" ? "CSV-fil" : "JSON-fil"}</Label>
              <button
                onClick={() => downloadTemplate(mode)}
                className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"
              >
                <Download size={11} />
                Ladda ner mall
              </button>
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed bg-bg/40 px-4 py-5 transition-colors hover:bg-bg/60">
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
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        )}

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
          {preview.map((d) => (
            <span key={d} className="rounded-md border bg-surface px-1.5 py-0.5 font-mono text-[11px]">
              {d}
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
            {result.invalid.slice(0, 8).map((v, i) => (
              <li key={i} className="flex items-center gap-1.5 font-mono text-[11px] text-red-600 dark:text-red-400">
                <X size={11} />
                {v}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
