"use client";

import { useMemo, useState } from "react";
import { Search, ShieldAlert, RefreshCw, Wrench } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { useToast } from "@/components/toast/ToastProvider";
import { securityFindings } from "../extended-data";
import { sites, siteName } from "../data";
import { MWPPageIntro } from "@/modules/mwp/components/MWPPageIntro";

type SeverityFilter = "all" | "critical" | "high" | "medium" | "low";
type StatusFilter = "all" | "open" | "mitigated" | "ignored";

const severityLabels: Record<string, string> = {
  critical: "kritisk",
  high: "hög",
  medium: "medel",
  low: "låg",
};

const statusLabels: Record<string, string> = {
  open: "öppen",
  mitigated: "åtgärdad",
  ignored: "ignorerad",
};

export default function SecurityPage() {
  const toast = useToast();
  const [severity, setSeverity] = useState<SeverityFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [siteFilter, setSiteFilter] = useState("all");
  const [query, setQuery] = useState("");

  const open = securityFindings.filter((f) => f.status === "open");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return securityFindings.filter((f) => {
      if (severity !== "all" && f.severity !== severity) return false;
      if (status !== "all" && f.status !== status) return false;
      if (siteFilter !== "all" && f.siteId !== siteFilter) return false;
      if (q && !f.title.toLowerCase().includes(q) && !f.cve.toLowerCase().includes(q) && !f.target.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [severity, status, siteFilter, query]);

  return (
    <div className="space-y-6">
      <MWPPageIntro
        title="Säkerhet"
        subtitle="Sårbarhetsskanner, CVE:er och åtgärdsflöde per sajt."
        actions={
          <Button onClick={() => toast.success("Integritetsskanning köad")}>
            <RefreshCw size={14} className="mr-1.5" />
            Kör skanning
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Öppna fynd" value={String(open.length)} />
        <StatCard label="Kritiska" value={String(open.filter((f) => f.severity === "critical").length)} />
        <StatCard label="Åtgärdade" value={String(securityFindings.filter((f) => f.status === "mitigated").length)} />
        <StatCard label="Spårade sajter" value={String(new Set(securityFindings.map((f) => f.siteId)).size)} />
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[180px] flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input className="pl-9" placeholder="Sök CVE, titel, komponent..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["all", "critical", "high", "medium", "low"] as SeverityFilter[]).map((key) => (
              <button
                key={key}
                onClick={() => setSeverity(key)}
                className={clsx("rounded-md px-2.5 py-1 text-xs font-medium transition-colors", severity === key ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg")}
              >
                {key === "all" ? "Alla" : severityLabels[key]}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["all", "open", "mitigated", "ignored"] as StatusFilter[]).map((key) => (
              <button
                key={key}
                onClick={() => setStatus(key)}
                className={clsx("rounded-md px-2.5 py-1 text-xs font-medium transition-colors", status === key ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg")}
              >
                {key === "all" ? "Alla status" : statusLabels[key]}
              </button>
            ))}
          </div>
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="h-9 rounded-lg border bg-surface px-3 text-sm outline-none focus:border-fg/30"
          >
            <option value="all">Alla sajter</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </Card>

      <div className="text-xs text-muted">Visar {filtered.length} av {securityFindings.length} fynd</div>

      <div className="space-y-3">
        {filtered.map((finding) => (
          <Card key={finding.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">{finding.title}</div>
                  <Badge tone={finding.severity === "critical" ? "danger" : finding.severity === "high" ? "warning" : "neutral"}>
                    {severityLabels[finding.severity] ?? finding.severity}
                  </Badge>
                  <Badge tone={finding.status === "open" ? "danger" : finding.status === "mitigated" ? "success" : "neutral"}>
                    {statusLabels[finding.status] ?? finding.status}
                  </Badge>
                  <span className="font-mono text-[11px] text-muted">{finding.cve}</span>
                </div>
                <div className="mt-1 text-sm text-muted">{finding.summary}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                  <span>{siteName(finding.siteId)}</span>
                  <span>·</span>
                  <span>{finding.target}</span>
                  <span>·</span>
                  <span>{finding.installedVersion} → {finding.fixedVersion}</span>
                  <span>·</span>
                  <span>{finding.detectedAt}</span>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" onClick={() => toast.info("Åtgärdsplan öppnad", finding.id)}>
                  <ShieldAlert size={13} className="mr-1.5" />
                  Granska
                </Button>
                <Button variant="secondary" onClick={() => toast.success("Patchjobb köat", finding.id)}>
                  <Wrench size={13} className="mr-1.5" />
                  Åtgärda
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="p-10 text-center text-sm text-muted">Inga fynd matchade filtret.</Card>
        )}
      </div>
    </div>
  );
}
