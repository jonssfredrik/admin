"use client";

import Link from "next/link";
import { Download, RotateCcw } from "lucide-react";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { backupDetails } from "../extended-data";
import { useToast } from "@/components/toast/ToastProvider";
import { JetWPPageIntro } from "@/modules/jetwp/components/JetWPPageIntro";

export default function BackupsPage() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <JetWPPageIntro title="Säkerhetskopior" subtitle="Centralt backup-arkiv med återställning och nedladdning." />

      <Table>
        <thead>
          <tr>
            <Th>Säkerhetskopia</Th>
            <Th>Sajt</Th>
            <Th>Typ</Th>
            <Th>Storlek</Th>
            <Th>Arkiv</Th>
            <Th className="text-right">Åtgärder</Th>
          </tr>
        </thead>
        <tbody>
          {backupDetails.map((backup) => (
            <tr key={backup.id}>
              <Td><Link href={`/jetwp/backups/${backup.id}`} className="font-medium hover:text-fg">{backup.id}</Link></Td>
              <Td>{backup.siteId}</Td>
              <Td><Badge tone={backup.type === "manual" ? "success" : "neutral"}>{backup.type === "manual" ? "manuell" : "automatisk"}</Badge></Td>
              <Td>{backup.size}</Td>
              <Td className="font-mono text-[11px] text-muted">{backup.location}</Td>
              <Td className="text-right">
                <div className="inline-flex gap-2">
                  <Button variant="secondary" onClick={() => toast.info("Nedladdning startad", backup.id)}><Download size={13} className="mr-1.5" />Ladda ner</Button>
                  <Button variant="secondary" onClick={() => toast.success("Återställning köad", backup.id)}><RotateCcw size={13} className="mr-1.5" />Återställ</Button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
