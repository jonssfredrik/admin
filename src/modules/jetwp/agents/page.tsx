"use client";

import { Cpu, RefreshCw, Link2 } from "lucide-react";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { agentRecords } from "../extended-data";
import { siteName } from "../data";
import { useToast } from "@/components/toast/ToastProvider";
import { JetWPPageIntro } from "@/modules/jetwp/components/JetWPPageIntro";

const statusLabels: Record<string, string> = {
  healthy: "frisk",
  stale: "fördröjd",
  outdated: "föråldrad",
  pairing_required: "kräver parkoppling",
};

const profileLabels: Record<string, string> = {
  standard: "standard",
  "debug-enabled": "felsökning aktiv",
  enterprise: "enterprise",
};

export default function AgentsPage() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <JetWPPageIntro
        title="Agenter"
        subtitle="Hantera agentversioner, parkopplingsstatus och serverprofiler."
        actions={
          <Button onClick={() => toast.success("Uppgradering av agentflotta köad")}>
            <RefreshCw size={14} className="mr-1.5" />
            Uppgradera föråldrade
          </Button>
        }
      />

      <Table>
        <thead>
          <tr>
            <Th>Sajt</Th>
            <Th>Server</Th>
            <Th>Version</Th>
            <Th>Status</Th>
            <Th>Profil</Th>
            <Th className="text-right">Åtgärder</Th>
          </tr>
        </thead>
        <tbody>
          {agentRecords.map((agent) => (
            <tr key={agent.id}>
              <Td>{siteName(agent.siteId)}</Td>
              <Td className="font-mono text-[12px]">{agent.server}</Td>
              <Td className="font-mono text-[12px]">{agent.version} → {agent.desiredVersion}</Td>
              <Td><Badge tone={agent.status === "healthy" ? "success" : agent.status === "outdated" ? "warning" : "danger"}>{statusLabels[agent.status] ?? agent.status}</Badge></Td>
              <Td>{profileLabels[agent.configProfile] ?? agent.configProfile}</Td>
              <Td className="text-right">
                <div className="inline-flex gap-2">
                  <Button variant="secondary" onClick={() => toast.success("Agentuppdatering köad", agent.id)}>
                    <Cpu size={13} className="mr-1.5" />
                    Uppdatera
                  </Button>
                  <Button variant="secondary" onClick={() => toast.info("Tvingad omparkoppling startad", agent.id)}>
                    <Link2 size={13} className="mr-1.5" />
                    Parkoppla igen
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
