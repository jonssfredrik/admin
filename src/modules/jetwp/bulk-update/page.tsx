"use client";

import { useState } from "react";
import { FlaskConical, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { bulkUpdatePlans } from "../extended-data";
import { useToast } from "@/components/toast/ToastProvider";
import { JetWPPageIntro } from "@/modules/jetwp/components/JetWPPageIntro";

const strategyLabels = {
  canary: "kanarie",
  serial: "seriell",
  parallel: "parallell",
} as const;

export default function BulkUpdatePage() {
  const toast = useToast();
  const [strategy, setStrategy] = useState<"canary" | "serial" | "parallel">("canary");

  return (
    <div className="space-y-6">
      <JetWPPageIntro
        title="Massuppdatering"
        subtitle="Granska väntande plugin- och temauppdateringar, ändringsloggar och utrullningsstrategi."
        actions={
          <>
            <Button variant="secondary" onClick={() => toast.info("Torrkörning köad för alla valda sajter")}>
              <FlaskConical size={14} className="mr-1.5" />
              Torrkörning
            </Button>
            <Button onClick={() => toast.success("Massuppdateringsflöde startat", strategyLabels[strategy])}>
              <Play size={14} className="mr-1.5" />
              Starta utrullning
            </Button>
          </>
        }
      />

      <Card className="p-5">
        <div className="text-xs font-medium uppercase tracking-wider text-muted">Utrullningsstrategi</div>
        <div className="mt-2 flex gap-2">
          {(["canary", "serial", "parallel"] as const).map((item) => (
            <button key={item} onClick={() => setStrategy(item)} className={`rounded-md border px-3 py-1.5 text-xs font-medium ${strategy === item ? "bg-bg text-fg" : "text-muted"}`}>
              {strategyLabels[item]}
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
                <div className="text-xs text-muted">{plan.plugins.length + plan.themes.length} uppdateringar redo</div>
              </div>
              <Badge tone="warning">{strategyLabels[strategy]}</Badge>
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
