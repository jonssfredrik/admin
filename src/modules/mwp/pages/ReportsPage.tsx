"use client";

import Link from "next/link";
import { ArrowLeft, FileDown, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { reportPresets } from "@/modules/mwp/data";

export function ReportsPage() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/mwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"><ArrowLeft size={12} />MWP</Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <PageHeader title="Rapporter" subtitle="Generera PDF- och CSV-exporter för kunder, sajter och driftarbete." />
          <Button onClick={() => toast.success("Rapportgenerering startad")}>
            <FileDown size={14} className="mr-1.5" />
            Generera rapport
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reportPresets.map((preset) => (
          <Card key={preset.id} className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold"><FileText size={14} />{preset.name}</div>
                <div className="mt-1 text-xs text-muted">{preset.scope}</div>
              </div>
              <Badge tone={preset.format === "pdf" ? "warning" : "success"}>{preset.format.toUpperCase()}</Badge>
            </div>
            <div className="mt-3 text-[11px] text-muted">Senast genererad {preset.generatedAt}</div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" onClick={() => toast.info("Förhandsvisning öppnad", preset.name)}>Förhandsvisa</Button>
              <Button variant="secondary" onClick={() => toast.success("Export köad", preset.name)}>Exportera igen</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
