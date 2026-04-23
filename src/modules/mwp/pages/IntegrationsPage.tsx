"use client";

import Link from "next/link";
import { ArrowLeft, GitBranchPlus, KeyRound, Webhook } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { apiKeys, outboundWebhooks, pipelineIntegrations } from "@/modules/mwp/data";

const webhookStatusLabels: Record<string, string> = {
  active: "aktiv",
  paused: "pausad",
};

export function IntegrationsPage() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/mwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"><ArrowLeft size={12} />MWP</Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <PageHeader title="Integrationer" subtitle="API-nycklar, utgående webhooks och hookar för CI/CD-pipelines." />
          <Button onClick={() => toast.success("API-nyckel skapad")}>
            <KeyRound size={14} className="mr-1.5" />
            Ny nyckel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden p-0">
          <div className="border-b px-5 py-3 text-sm font-semibold">API-nycklar</div>
          <div className="divide-y divide-border/60">
            {apiKeys.map((key) => (
              <div key={key.id} className="px-5 py-3">
                <div className="text-sm font-medium">{key.name}</div>
                <div className="mt-1 font-mono text-[11px] text-muted">{key.prefix}</div>
                <div className="mt-1 text-[11px] text-muted">{key.scope}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b px-5 py-3 text-sm font-semibold">Utgående webhooks</div>
          <div className="divide-y divide-border/60">
            {outboundWebhooks.map((webhook) => (
              <div key={webhook.id} className="px-5 py-3">
                <div className="flex items-center gap-2 text-sm font-medium"><Webhook size={13} />{webhook.name}</div>
                <div className="mt-1 text-[11px] text-muted">{webhook.event} → {webhook.destination}</div>
                <div className="mt-2"><Badge tone={webhook.status === "active" ? "success" : "warning"}>{webhookStatusLabels[webhook.status] ?? webhook.status}</Badge></div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b px-5 py-3 text-sm font-semibold">CI/CD</div>
          <div className="divide-y divide-border/60">
            {pipelineIntegrations.map((pipeline) => (
              <div key={pipeline.id} className="px-5 py-3">
                <div className="flex items-center gap-2 text-sm font-medium"><GitBranchPlus size={13} />{pipeline.provider}</div>
                <div className="mt-1 text-[11px] text-muted">{pipeline.project} · {pipeline.branch}</div>
                <div className="mt-1 text-[11px] text-muted">Trigger {pipeline.trigger} · senaste körning {pipeline.lastRun}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
