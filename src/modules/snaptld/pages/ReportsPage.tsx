"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Download, Eye, FileText, Printer } from "lucide-react";
import clsx from "clsx";
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

type ReportsSortKey = "title" | "generatedAt" | "domains" | "highlight" | "format";
type ReportsSortDir = "asc" | "desc";

export function ReportsPage({ initialReports }: { initialReports: Report[] }) {
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [reports, setReports] = useState(initialReports);
  const [sortKey, setSortKey] = useState<ReportsSortKey>("generatedAt");
  const [sortDir, setSortDir] = useState<ReportsSortDir>("desc");

  const sortedReports = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...reports].sort((a, b) => {
      switch (sortKey) {
        case "title":
          return a.title.localeCompare(b.title) * dir;
        case "domains":
          return (a.domains - b.domains) * dir;
        case "highlight":
          return a.highlight.localeCompare(b.highlight) * dir;
        case "format":
          return a.format.localeCompare(b.format) * dir;
        case "generatedAt":
        default:
          return a.generatedAt.localeCompare(b.generatedAt) * dir;
      }
    });
  }, [reports, sortDir, sortKey]);

  const toggleSort = (key: ReportsSortKey) => {
    if (sortKey === key) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir(key === "title" || key === "highlight" || key === "format" ? "asc" : "desc");
  };

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
            <SortableTh active={sortKey === "title"} dir={sortDir} onClick={() => toggleSort("title")}>Titel</SortableTh>
            <SortableTh active={sortKey === "generatedAt"} dir={sortDir} onClick={() => toggleSort("generatedAt")}>Genererad</SortableTh>
            <SortableTh className="text-right" active={sortKey === "domains"} dir={sortDir} onClick={() => toggleSort("domains")}>Domäner</SortableTh>
            <SortableTh active={sortKey === "highlight"} dir={sortDir} onClick={() => toggleSort("highlight")}>Höjdpunkt</SortableTh>
            <SortableTh active={sortKey === "format"} dir={sortDir} onClick={() => toggleSort("format")}>Format</SortableTh>
            <Th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {sortedReports.map((report) => (
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

function SortableTh({
  children,
  active,
  dir,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active: boolean;
  dir: ReportsSortDir;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Th className={className}>
      <button
        onClick={onClick}
        className={clsx(
          "-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors",
          active ? "text-fg" : "hover:text-fg",
        )}
      >
        {children}
        {active ? (dir === "asc" ? <ArrowUp size={10} /> : <ArrowDown size={10} />) : <span className="inline-block h-[10px] w-[10px]" />}
      </button>
    </Th>
  );
}
