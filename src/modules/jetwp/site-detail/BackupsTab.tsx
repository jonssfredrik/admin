"use client";

import { useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/toast/ToastProvider";
import { backups as baseBackups } from "@/modules/jetwp/[id]/data";
import { backupDetails, type BackupDetail } from "@/modules/jetwp/extended-data";
import { MetaRow } from "@/modules/jetwp/site-detail/SiteDetailPrimitives";

interface BackupsTabProps {
  siteId: string;
}

export function BackupsTab({ siteId }: BackupsTabProps) {
  const toast = useToast();
  const siteBackups = backupDetails.filter((item) => item.siteId === siteId);
  const fallback = baseBackups.map((item) => ({
    ...item,
    siteId,
    location: "s3://jetwp-backups/fallback.tar.zst",
    filesIncluded: ["uploads", "plugins", "themes"],
    database: { engine: "MariaDB", size: "120 MB", tables: 84 },
    checksum: "sha256:fallback",
  }));
  const [selectedBackup, setSelectedBackup] = useState<BackupDetail>((siteBackups[0] ?? fallback[0]) as BackupDetail);
  const [schedule, setSchedule] = useState("daily 04:00");
  const [restoreMode, setRestoreMode] = useState<"staging" | "production">("staging");
  const [confirmRestore, setConfirmRestore] = useState(false);

  const list = siteBackups.length > 0 ? siteBackups : (fallback as BackupDetail[]);

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Backupschema</h2>
            <p className="mt-1 text-xs text-muted">Välj schema och retention per sajt.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["hourly", "daily 04:00", "daily 02:00", "weekly Sunday"].map((item) => (
                <button
                  key={item}
                  onClick={() => setSchedule(item)}
                  className={clsx("rounded-md border px-3 py-1.5 text-xs font-medium", schedule === item ? "bg-bg text-fg" : "text-muted")}
                >
                  {item === "hourly" ? "varje timme" : item === "daily 04:00" ? "dagligen 04:00" : item === "daily 02:00" ? "dagligen 02:00" : "veckovis söndag"}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-bg/40 p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted">Återställningsflöde</div>
            <div className="mt-2 flex gap-2">
              {(["staging", "production"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setRestoreMode(item)}
                  className={clsx("rounded-md border px-3 py-1.5 text-xs font-medium", restoreMode === item ? "bg-surface text-fg" : "text-muted")}
                >
                  {item === "staging" ? "testmiljö" : "produktion"}
                </button>
              ))}
            </div>
            <Button className="mt-3 w-full" onClick={() => setConfirmRestore(true)}>
              <RotateCcw size={14} className="mr-1.5" />
              Starta återställning
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Table>
          <thead>
            <tr>
              <Th>Skapad</Th>
              <Th>Typ</Th>
              <Th>Storlek</Th>
              <Th>Retention</Th>
              <Th className="text-right">Åtgärder</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((backup) => (
              <tr key={backup.id} className={clsx("transition-colors hover:bg-bg/50", selectedBackup.id === backup.id && "bg-bg/60")}>
                <Td>
                  <button onClick={() => setSelectedBackup(backup)} className="text-left font-medium hover:text-fg">
                    {backup.createdAt}
                  </button>
                </Td>
                <Td><Badge tone={backup.type === "manual" ? "success" : "neutral"}>{backup.type === "manual" ? "manuell" : "automatisk"}</Badge></Td>
                <Td className="font-mono text-[12px] text-muted">{backup.size}</Td>
                <Td className="text-xs text-muted">{backup.retention}</Td>
                <Td className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <button onClick={() => toast.info("Backup-arkiv köat", backup.id)} className="inline-flex h-7 items-center rounded-md border bg-surface px-2 text-xs font-medium hover:bg-bg">
                      <Download size={11} className="mr-1" />
                      Ladda ner
                    </button>
                    <button onClick={() => setConfirmRestore(true)} className="inline-flex h-7 items-center rounded-md border bg-surface px-2 text-xs font-medium hover:bg-bg">
                      <RotateCcw size={11} className="mr-1" />
                      Återställ
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold tracking-tight">Backupdetalj</div>
            <Badge tone="neutral">{selectedBackup.type === "manual" ? "manuell" : "automatisk"}</Badge>
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            <MetaRow label="Arkiv" value={selectedBackup.location} mono />
            <MetaRow label="Checksumma" value={selectedBackup.checksum} mono />
            <MetaRow label="Databas" value={`${selectedBackup.database.engine} · ${selectedBackup.database.size}`} />
            <MetaRow label="Tabeller" value={String(selectedBackup.database.tables)} />
          </dl>
          <div className="mt-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted">Innehåller</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selectedBackup.filesIncluded.map((entry) => <Badge key={entry} tone="neutral">{entry}</Badge>)}
            </div>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmRestore}
        onClose={() => setConfirmRestore(false)}
        onConfirm={() => toast.success("Återställning köad", `${selectedBackup.id} → ${restoreMode === "staging" ? "testmiljö" : "produktion"}`)}
        title={`Återställ ${selectedBackup.id} till ${restoreMode === "staging" ? "testmiljö" : "produktion"}?`}
        description="Steg 1 validerar arkivet. Steg 2 verifierar målet. Steg 3 återställer databas och filer."
        confirmLabel="Köa återställning"
        tone="danger"
      />
    </div>
  );
}
