"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Download, RotateCcw } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { backupDetails } from "../../extended-data";
import { useToast } from "@/components/toast/ToastProvider";

export default function BackupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const toast = useToast();
  const backup = backupDetails.find((entry) => entry.id === id);

  if (!backup) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp/backups" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"><ArrowLeft size={12} />Backups</Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <PageHeader title={backup.id} subtitle={`${backup.siteId} · ${backup.location}`} />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => toast.info("Backup archive queued", backup.id)}><Download size={14} className="mr-1.5" />Download</Button>
            <Button onClick={() => toast.success("Restore flow started", backup.id)}><RotateCcw size={14} className="mr-1.5" />Restore</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="text-sm font-semibold">Archive detail</div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3"><span className="text-muted">Created</span><span>{backup.createdAt}</span></div>
            <div className="flex justify-between gap-3"><span className="text-muted">Retention</span><span>{backup.retention}</span></div>
            <div className="flex justify-between gap-3"><span className="text-muted">DB</span><span>{backup.database.engine} · {backup.database.size}</span></div>
            <div className="flex justify-between gap-3"><span className="text-muted">Tables</span><span>{backup.database.tables}</span></div>
            <div className="flex justify-between gap-3"><span className="text-muted">Checksum</span><span className="font-mono text-[12px]">{backup.checksum}</span></div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm font-semibold">Restore checklist</div>
          <div className="mt-3 space-y-2">
            <Badge tone="warning">1. Validate archive</Badge>
            <Badge tone="warning">2. Select target environment</Badge>
            <Badge tone="warning">3. Confirm DB replacement</Badge>
            <Badge tone="warning">4. Verify health after restore</Badge>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="text-sm font-semibold">Included paths</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {backup.filesIncluded.map((entry) => <Badge key={entry} tone="neutral">{entry}</Badge>)}
        </div>
      </Card>
    </div>
  );
}
