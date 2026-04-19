"use client";

import { useState } from "react";
import { Calendar, FileText, Sparkles } from "lucide-react";
import clsx from "clsx";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useToast } from "@/components/toast/ToastProvider";

interface Template {
  id: string;
  title: string;
  description: string;
  defaultFormat: "pdf" | "csv" | "json";
}

const templates: Template[] = [
  {
    id: "top-weekly",
    title: "Topp 20 veckovis",
    description: "Höst-scorade domäner senaste 7 dagar, med signaler per kategori",
    defaultFormat: "pdf",
  },
  {
    id: "new-se",
    title: "Nya .se denna vecka",
    description: "Alla nyanalyserade .se-domäner med verdict Excellent eller Good",
    defaultFormat: "csv",
  },
  {
    id: "watchlist-expiring",
    title: "Bevakade — utgång <7d",
    description: "Dina bevakade domäner som löper ut kommande vecka",
    defaultFormat: "pdf",
  },
  {
    id: "custom",
    title: "Anpassad",
    description: "Bygg egen rapport med valfria filter och format",
    defaultFormat: "json",
  },
];

const cadences = [
  { id: "once", label: "Engång" },
  { id: "daily", label: "Dagligen 07:00" },
  { id: "weekly", label: "Måndagar 08:00" },
  { id: "monthly", label: "Första i månaden" },
];

const formats: { id: "pdf" | "csv" | "json"; label: string }[] = [
  { id: "pdf", label: "PDF" },
  { id: "csv", label: "CSV" },
  { id: "json", label: "JSON" },
];

export function CreateReportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const [tpl, setTpl] = useState<Template>(templates[0]);
  const [title, setTitle] = useState("");
  const [cadence, setCadence] = useState("once");
  const [format, setFormat] = useState<"pdf" | "csv" | "json">(templates[0].defaultFormat);
  const [recipients, setRecipients] = useState("");

  const pickTemplate = (t: Template) => {
    setTpl(t);
    setFormat(t.defaultFormat);
  };

  const create = () => {
    const name = title.trim() || tpl.title;
    const cLabel = cadences.find((c) => c.id === cadence)?.label ?? cadence;
    if (cadence === "once") {
      toast.success("Rapport genererad", `${name} (${format.toUpperCase()})`);
    } else {
      toast.success(
        "Rapport schemalagd",
        `${name} · ${cLabel}${recipients.trim() ? ` → ${recipients.trim()}` : ""}`,
      );
    }
    setTitle("");
    setRecipients("");
    setCadence("once");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Skapa rapport"
      description="Välj mall, schema och leverans. Alla rapporter kan laddas ner manuellt också."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
          <Button onClick={create} className="gap-1.5">
            <FileText size={14} />
            {cadence === "once" ? "Generera nu" : "Schemalägg"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label>Mall</Label>
          <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {templates.map((t) => {
              const active = tpl.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => pickTemplate(t)}
                  className={clsx(
                    "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors",
                    active ? "border-fg bg-fg/5" : "hover:bg-bg/60",
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={12} className={active ? "text-fg" : "text-muted"} />
                    <div className="text-sm font-medium">{t.title}</div>
                  </div>
                  <div className="text-xs text-muted">{t.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="report-title">Titel (valfri)</Label>
            <Input
              id="report-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={tpl.title}
            />
          </div>
          <div>
            <Label>Format</Label>
            <div className="mt-1.5 flex gap-1">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={clsx(
                    "flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                    format === f.id ? "border-fg bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={11} />
              Schema
            </span>
          </Label>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {cadences.map((c) => (
              <button
                key={c.id}
                onClick={() => setCadence(c.id)}
                className={clsx(
                  "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                  cadence === c.id ? "border-fg bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {cadence !== "once" && (
          <div>
            <Label htmlFor="recipients">E-postmottagare (valfritt)</Label>
            <Input
              id="recipients"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="du@exempel.se, team@exempel.se"
            />
            <div className="mt-1 text-[11px] text-muted">
              Kommaseparerad lista. Lämna tomt för att bara arkivera rapporten i panelen.
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
