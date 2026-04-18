"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FlaskConical, Play } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { bulkUpdatePlans } from "../extended-data";
import { useToast } from "@/components/toast/ToastProvider";

export default function BulkUpdatePage() {
  const toast = useToast();
  const [strategy, setStrategy] = useState<"canary" | "serial" | "parallel">("canary");

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"><ArrowLeft size={12} />JetWP</Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <PageHeader title="Bulk update" subtitle="Review pending plugin/theme updates, changelogs and rollout strategy." />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => toast.info("Dry-run queued for all selected sites")}>
              <FlaskConical size={14} className="mr-1.5" />
              Dry-run
            </Button>
            <Button onClick={() => toast.success("Bulk update workflow started", strategy)}>
              <Play size={14} className="mr-1.5" />
              Start rollout
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-5">
        <div className="text-xs font-medium uppercase tracking-wider text-muted">Rollout strategy</div>
        <div className="mt-2 flex gap-2">
          {(["canary", "serial", "parallel"] as const).map((item) => (
            <button key={item} onClick={() => setStrategy(item)} className={`rounded-md border px-3 py-1.5 text-xs font-medium ${strategy === item ? "bg-bg text-fg" : "text-muted"}`}>
              {item}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        {bulkUpdatePlans.map((plan) => (
          <Card key={plan.siteId} className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{plan.siteName}</div>
                <div className="text-xs text-muted">{plan.plugins.length + plan.themes.length} updates ready</div>
              </div>
              <Badge tone="warning">{strategy}</Badge>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                {plan.plugins.map((plugin) => (
                  <div key={plugin.name} className="rounded-lg border bg-bg/40 p-3">
                    <div className="text-sm font-medium">{plugin.name}</div>
                    <div className="mt-1 text-[11px] text-muted">{plugin.current} → {plugin.next}</div>
                    <div className="mt-1 text-xs text-muted">{plugin.changelog}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {plan.themes.map((theme) => (
                  <div key={theme.name} className="rounded-lg border bg-bg/40 p-3">
                    <div className="text-sm font-medium">{theme.name}</div>
                    <div className="mt-1 text-[11px] text-muted">{theme.current} → {theme.next}</div>
                    <div className="mt-1 text-xs text-muted">{theme.changelog}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
