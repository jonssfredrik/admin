"use client";

import { use } from "react";
import { Download, RotateCcw } from "lucide-react";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { backupDetails } from "../../extended-data";
import { useToast } from "@/components/toast/ToastProvider";
import { JetWPPageIntro } from "@/modules/jetwp/components/JetWPPageIntro";

export default function BackupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const toast = useToast();
  const backup = backupDetails.find((entry) => entry.id === id);

  if (!backup) notFound();

  return (
    <div className="space-y-6">
      <JetWPPageIntro
        title={backup.id}
        subtitle={`${backup.siteId} · ${backup.location}`}
        backHref="/jetwp/backups"
        backLabel="Säkerhetskopior"
        actions={
          <>
            <Button variant="secondary" onClick={() => toast.info("Backup-arkiv köat", backup.id)}><Download size={14} className="mr-1.5" />Ladda ner</Button>
            <Button onClick={() => toast.success("Återställningsflöde startat", backup.id)}><RotateCcw size={14} className="mr-1.5" />Återställ</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="text-sm font-semibold">Arkivdetaljer</div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3"><span className="text-muted">Skapad</span><span>{backup.createdAt}</span></div>
            <div className="flex justify-between gap-3"><span className="text-muted">Retention</span><span>{backup.retention}</span></div>
            <div className="flex justify-between gap-3"><span className="text-muted">Databas</span><span>{backup.database.engine} · {backup.database.size}</span></div>
            <div className="flex justify-between gap-3"><span className="text-muted">Tabeller</span><span>{backup.database.tables}</span></div>
            <div className="flex justify-between gap-3"><span className="text-muted">Checksumma</span><span className="font-mono text-[12px]">{backup.checksum}</span></div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm font-semibold">Checklista för återställning</div>
          <div className="mt-3 space-y-2">
            <Badge tone="warning">1. Validera arkiv</Badge>
            <Badge tone="warning">2. Välj målmiljö</Badge>
            <Badge tone="warning">3. Bekräfta databasbyte</Badge>
            <Badge tone="warning">4. Verifiera hälsa efter återställning</Badge>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="text-sm font-semibold">Inkluderade sökvägar</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {backup.filesIncluded.map((entry) => <Badge key={entry} tone="neutral">{entry}</Badge>)}
        </div>
      </Card>
    </div>
  );
}
