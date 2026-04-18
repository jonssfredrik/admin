"use client";

import Link from "next/link";
import { ArrowLeft, Download, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { backupDetails } from "../extended-data";
import { useToast } from "@/components/toast/ToastProvider";

export default function BackupsPage() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"><ArrowLeft size={12} />JetWP</Link>
        <div className="mt-3">
          <PageHeader title="Backups" subtitle="Central backup archive with restore and download actions." />
        </div>
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Backup</Th>
            <Th>Site</Th>
            <Th>Type</Th>
            <Th>Size</Th>
            <Th>Archive</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {backupDetails.map((backup) => (
            <tr key={backup.id}>
              <Td><Link href={`/jetwp/backups/${backup.id}`} className="font-medium hover:text-fg">{backup.id}</Link></Td>
              <Td>{backup.siteId}</Td>
              <Td><Badge tone={backup.type === "manual" ? "success" : "neutral"}>{backup.type}</Badge></Td>
              <Td>{backup.size}</Td>
              <Td className="font-mono text-[11px] text-muted">{backup.location}</Td>
              <Td className="text-right">
                <div className="inline-flex gap-2">
                  <Button variant="secondary" onClick={() => toast.info("Download started", backup.id)}><Download size={13} className="mr-1.5" />Download</Button>
                  <Button variant="secondary" onClick={() => toast.success("Restore queued", backup.id)}><RotateCcw size={13} className="mr-1.5" />Restore</Button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
