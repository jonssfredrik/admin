"use client";

import Link from "next/link";
import { ArrowLeft, Copy, GitCompareArrows, Rocket } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { stagingFlows } from "../extended-data";
import { useToast } from "@/components/toast/ToastProvider";

export default function StagingPage() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"><ArrowLeft size={12} />JetWP</Link>
        <div className="mt-3">
          <PageHeader title="Staging and deploy" subtitle="Clone production to staging, compare environments and promote changes." />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {stagingFlows.map((flow) => (
          <Card key={flow.siteId} className="p-5">
            <div className="text-sm font-semibold">{flow.siteId}</div>
            <div className="mt-1 text-xs text-muted">Last clone {flow.lastClone} · last promote {flow.lastPromote}</div>
            <div className="mt-4 space-y-2">
              {flow.diffSummary.map((line) => (
                <div key={line} className="rounded-lg border bg-bg/40 px-3 py-2 text-sm">{line}</div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" onClick={() => toast.success("Clone to staging queued", flow.siteId)}>
                <Copy size={13} className="mr-1.5" />
                Clone
              </Button>
              <Button variant="secondary" onClick={() => toast.info("Environment diff opened", flow.siteId)}>
                <GitCompareArrows size={13} className="mr-1.5" />
                Diff
              </Button>
              <Button onClick={() => toast.success("Promote to production queued", flow.siteId)}>
                <Rocket size={13} className="mr-1.5" />
                Promote
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
