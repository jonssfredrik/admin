"use client";

import Link from "next/link";
import { ArrowLeft, FileDown, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { reportPresets } from "../extended-data";
import { useToast } from "@/components/toast/ToastProvider";

export default function ReportsPage() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"><ArrowLeft size={12} />JetWP</Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <PageHeader title="Reports" subtitle="Generate PDF and CSV exports for customers, sites and fleet operations." />
          <Button onClick={() => toast.success("Report generation started")}>
            <FileDown size={14} className="mr-1.5" />
            Generate report
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
              <Badge tone={preset.format === "pdf" ? "warning" : "success"}>{preset.format}</Badge>
            </div>
            <div className="mt-3 text-[11px] text-muted">Last generated {preset.generatedAt}</div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" onClick={() => toast.info("Preview opened", preset.name)}>Preview</Button>
              <Button variant="secondary" onClick={() => toast.success("Export queued", preset.name)}>Export again</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
