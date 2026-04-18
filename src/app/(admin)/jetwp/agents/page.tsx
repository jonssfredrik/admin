"use client";

import Link from "next/link";
import { ArrowLeft, Cpu, RefreshCw, Link2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { agentRecords } from "../extended-data";
import { useToast } from "@/components/toast/ToastProvider";

export default function AgentsPage() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"><ArrowLeft size={12} />JetWP</Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <PageHeader title="Agents" subtitle="Manage agent versions, pairing health and per-server configuration." />
          <Button onClick={() => toast.success("Fleet agent upgrade queued")}>
            <RefreshCw size={14} className="mr-1.5" />
            Upgrade outdated
          </Button>
        </div>
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Site</Th>
            <Th>Server</Th>
            <Th>Version</Th>
            <Th>Status</Th>
            <Th>Profile</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {agentRecords.map((agent) => (
            <tr key={agent.id}>
              <Td>{agent.siteId}</Td>
              <Td className="font-mono text-[12px]">{agent.server}</Td>
              <Td className="font-mono text-[12px]">{agent.version} → {agent.desiredVersion}</Td>
              <Td><Badge tone={agent.status === "healthy" ? "success" : agent.status === "outdated" ? "warning" : "danger"}>{agent.status}</Badge></Td>
              <Td>{agent.configProfile}</Td>
              <Td className="text-right">
                <div className="inline-flex gap-2">
                  <Button variant="secondary" onClick={() => toast.success("Agent update queued", agent.id)}>
                    <Cpu size={13} className="mr-1.5" />
                    Update
                  </Button>
                  <Button variant="secondary" onClick={() => toast.info("Force re-pair started", agent.id)}>
                    <Link2 size={13} className="mr-1.5" />
                    Re-pair
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
