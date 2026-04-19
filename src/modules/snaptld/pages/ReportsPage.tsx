"use client";

import { useState } from "react";
import { Download, FileText, Printer } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { RowMenu } from "@/components/ui/RowMenu";
import { useToast } from "@/components/toast/ToastProvider";
import { reports } from "@/modules/snaptld/data/feeds";
import { CreateReportDialog } from "@/modules/snaptld/components/CreateReportDialog";

const formatTone = {
  pdf: "danger",
  csv: "success",
  json: "warning",
} as const;

export function ReportsPage() {
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);

  const download = (name: string) => {
    const payload = JSON.stringify({ report: name, generatedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Rapport nedladdad", name);
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

      <CreateReportDialog open={createOpen} onClose={() => setCreateOpen(false)} />

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
          {reports.map((r) => (
            <tr key={r.id} className="transition-colors hover:bg-bg/50">
              <Td>
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-muted">{r.id}</div>
              </Td>
              <Td className="font-mono text-xs tabular-nums text-muted">{r.generatedAt}</Td>
              <Td className="text-right font-medium tabular-nums">{r.domains.toLocaleString("sv-SE")}</Td>
              <Td className="text-sm">{r.highlight}</Td>
              <Td>
                <Badge tone={formatTone[r.format]}>{r.format.toUpperCase()}</Badge>
              </Td>
              <Td>
                <RowMenu
                  items={[
                    { label: "Ladda ner", icon: Download, onClick: () => download(r.id) },
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
