"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Play, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/toast/ToastProvider";
import { sites } from "../../data";
import { jobTypes, type JobType, type JobPriority } from "../../fleet";

export default function NewJobPage() {
  const router = useRouter();
  const toast = useToast();
  const sp = useSearchParams();
  const preset = sp.get("site") ?? "";

  const [selectedSites, setSelectedSites] = useState<string[]>(preset ? [preset] : []);
  const [type, setType] = useState<JobType>("plugin.update");
  const [priority, setPriority] = useState<JobPriority>("normal");
  const [strategy, setStrategy] = useState<"immediate" | "serial" | "canary" | "scheduled">("immediate");
  const [scheduledAt, setScheduledAt] = useState("");
  const [params, setParams] = useState<Record<string, string>>({});

  const jobDef = useMemo(() => jobTypes.find((t) => t.value === type)!, [type]);

  const toggleSite = (id: string) => {
    setSelectedSites((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  };

  const submit = () => {
    if (selectedSites.length === 0) { toast.error("Välj sajt", "Minst en sajt krävs"); return; }
    toast.success("Jobb köat", `${selectedSites.length} jobb skapades (${type})`);
    router.push("/jetwp/jobs");
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp/jobs" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          Jobs
        </Link>
        <div className="mt-3">
          <PageHeader title="Skapa jobb" subtitle="Köa ett jobb mot en eller flera sajter" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-5">
            <div className="text-sm font-semibold tracking-tight">1. Välj sajter</div>
            <p className="mt-0.5 text-xs text-muted">Jobbet körs mot varje vald sajt enligt strategin nedan.</p>
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
              {sites.map((s) => {
                const active = selectedSites.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleSite(s.id)}
                    className={clsx(
                      "flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors",
                      active ? "border-fg/30 bg-bg" : "hover:bg-bg/60",
                    )}
                  >
                    <div className={clsx(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                      active && "border-fg bg-fg text-bg",
                    )}>
                      {active && <CheckCircle2 size={11} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{s.name}</div>
                      <div className="truncate text-[11px] text-muted">{s.domain} · WP {s.wp}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-semibold tracking-tight">2. Välj jobbtyp</div>
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
              {jobTypes.map((t) => {
                const active = type === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => { setType(t.value); setParams({}); }}
                    className={clsx(
                      "rounded-lg border px-3 py-2 text-left transition-colors",
                      active ? "border-fg/30 bg-bg" : "hover:bg-bg/60",
                    )}
                  >
                    <div className="text-sm font-medium">{t.label}</div>
                    <div className="mt-0.5 text-[11px] text-muted">{t.description}</div>
                    <div className="mt-1 font-mono text-[10px] text-muted">{t.value}</div>
                  </button>
                );
              })}
            </div>
          </Card>

          {jobDef.paramFields && jobDef.paramFields.length > 0 && (
            <Card className="p-5">
              <div className="text-sm font-semibold tracking-tight">3. Parametrar</div>
              <div className="mt-3 space-y-3">
                {jobDef.paramFields.map((f) => (
                  <div key={f.name}>
                    <label className="text-xs text-muted">{f.label}</label>
                    {f.kind === "select" ? (
                      <select
                        value={params[f.name] ?? ""}
                        onChange={(e) => setParams((p) => ({ ...p, [f.name]: e.target.value }))}
                        className="mt-1 w-full rounded-lg border bg-surface px-3 py-2 text-sm"
                      >
                        <option value="">Välj…</option>
                        {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <Input
                        className="mt-1"
                        placeholder={f.placeholder}
                        value={params[f.name] ?? ""}
                        onChange={(e) => setParams((p) => ({ ...p, [f.name]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-sm font-semibold tracking-tight">Strategi & schema</div>
            <div className="mt-3 space-y-3">
              <div>
                <label className="text-xs text-muted">Strategi</label>
                <div className="mt-1 flex rounded-lg border bg-bg p-0.5">
                  {(["immediate", "serial", "canary", "scheduled"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStrategy(s)}
                      className={clsx(
                        "flex-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
                        strategy === s ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] text-muted">
                  {strategy === "immediate" && "Kör parallellt på alla sajter."}
                  {strategy === "serial" && "Kör en sajt i taget."}
                  {strategy === "canary" && "Testa på första sajten, fortsätt vid OK."}
                  {strategy === "scheduled" && "Kör vid schemalagd tid."}
                </p>
              </div>
              {strategy === "scheduled" && (
                <div>
                  <label className="text-xs text-muted">Schemalagd tid</label>
                  <Input type="datetime-local" className="mt-1" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
                </div>
              )}
              <div>
                <label className="text-xs text-muted">Prioritet</label>
                <div className="mt-1 flex rounded-lg border bg-bg p-0.5">
                  {(["low", "normal", "high", "urgent"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={clsx(
                        "flex-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
                        priority === p ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-semibold tracking-tight">Sammanfattning</div>
            <dl className="mt-3 space-y-1.5 text-sm">
              <Row k="Sajter" v={`${selectedSites.length} st`} />
              <Row k="Typ" v={<span className="font-mono text-[12px]">{type}</span>} />
              <Row k="Strategi" v={strategy} />
              <Row k="Prioritet" v={priority} />
            </dl>
            <Button className="mt-4 w-full" onClick={submit}>
              <Play size={13} className="mr-1.5" />
              Köa {selectedSites.length || "—"} jobb
            </Button>
            <Button variant="secondary" className="mt-2 w-full" onClick={() => router.push("/jetwp/jobs")}>Avbryt</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-xs text-muted">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
