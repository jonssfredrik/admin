"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, Eye, FileText, Printer } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { RowMenu } from "@/components/ui/RowMenu";
import { useToast } from "@/components/toast/ToastProvider";
import { CreateReportDialog } from "@/modules/snaptld/components/CreateReportDialog";
import { formatDateTime } from "@/modules/snaptld/lib/format";
import type { Report } from "@/modules/snaptld/types";

const formatTone = {
  pdf: "danger",
  csv: "success",
  json: "warning",
} as const;

export function ReportsPage({ initialReports }: { initialReports: Report[] }) {
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [reports, setReports] = useState(initialReports);

  const download = (report: Report) => {
    const payload = JSON.stringify({ report: report.id, generatedAt: report.generatedAt }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${report.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Rapport nedladdad", report.title);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Rapporter"
          subtitle="Genererade rapporter som kan laddas ner, skrivas ut eller delas."
        />
        <Button className="gap-1.5" onClick={() => setCreateOpen(true)}>
          <FileText size={14} />
          Skapa rapport
        </Button>
      </div>

      <CreateReportDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(report) => setReports((current) => [report, ...current])}
      />

      <Table>
        <thead>
          <tr>
            <Th>Titel</Th>
            <Th>Genererad</Th>
            <Th className="text-right">Domäner</Th>
            <Th>Höjdpunkt</Th>
            <Th>Format</Th>
            <Th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="transition-colors hover:bg-bg/50">
              <Td>
                <Link href={`/snaptld/reports/${report.id}`} className="block">
                  <div className="font-medium hover:underline">{report.title}</div>
                  <div className="text-xs text-muted">{report.id}</div>
                </Link>
              </Td>
              <Td className="font-mono text-xs tabular-nums text-muted">{formatDateTime(report.generatedAt)}</Td>
              <Td className="text-right font-medium tabular-nums">{report.domains.toLocaleString("sv-SE")}</Td>
              <Td className="text-sm">{report.highlight}</Td>
              <Td>
                <Badge tone={formatTone[report.format]}>{report.format.toUpperCase()}</Badge>
              </Td>
              <Td>
                <RowMenu
                  items={[
                    { label: "Öppna", icon: Eye, onClick: () => window.location.assign(`/snaptld/reports/${report.id}`) },
                    { label: "Ladda ner", icon: Download, onClick: () => download(report) },
                    { label: "Skriv ut", icon: Printer, onClick: () => window.print() },
                  ]}
                />
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
