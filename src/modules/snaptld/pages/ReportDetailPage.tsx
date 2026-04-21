"use client";

import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileText, Printer } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { reports } from "@/modules/snaptld/data/feeds";

const formatTone = {
  pdf: "danger",
  csv: "success",
  json: "warning",
} as const;

export function ReportDetailPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params);
  const toast = useToast();
  const report = reports.find((entry) => entry.id === reportId);

  if (!report) notFound();

  const download = () => {
    const payload = JSON.stringify({ report: report.id, generatedAt: report.generatedAt }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Rapport nedladdad", report.title);
  };

  return (
    <div className="space-y-6">
      <Link
        href="/snaptld/reports"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg"
      >
        <ArrowLeft size={13} />
        Tillbaka till rapporter
      </Link>

      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title={report.title}
          subtitle="Enkel rapportsida med grunddata. Byggs ut vidare i nästa steg."
        />
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-1.5" onClick={download}>
            <Download size={14} />
            Ladda ner
          </Button>
          <Button variant="secondary" className="gap-1.5" onClick={() => window.print()}>
            <Printer size={14} />
            Skriv ut
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Genererad</div>
          <div className="mt-2 font-mono text-sm tabular-nums">{report.generatedAt}</div>
        </Card>
        <Card>
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Domäner</div>
          <div className="mt-2 text-2xl font-semibold tabular-nums">{report.domains.toLocaleString("sv-SE")}</div>
        </Card>
        <Card>
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Format</div>
          <div className="mt-2">
            <Badge tone={formatTone[report.format]}>{report.format.toUpperCase()}</Badge>
          </div>
        </Card>
      </div>

      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-muted" />
          <h2 className="text-sm font-semibold tracking-tight">Rapportöversikt</h2>
        </div>
        <div className="rounded-xl border bg-bg/40 p-4">
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Rapport-ID</div>
          <div className="mt-1 font-mono text-sm">{report.id}</div>
        </div>
        <div className="rounded-xl border bg-bg/40 p-4">
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Höjdpunkt</div>
          <div className="mt-1 text-sm">{report.highlight}</div>
        </div>
        <div className="rounded-xl border bg-bg/40 p-4">
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Status</div>
          <div className="mt-1 text-sm text-muted">Arkiverad mockrapport. Ingen liveuppdatering ännu.</div>
        </div>
      </Card>
    </div>
  );
}
