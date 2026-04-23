"use client";

import { Copy, GitCompareArrows, Rocket } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { stagingFlows } from "../extended-data";
import { siteName } from "../data";
import { useToast } from "@/components/toast/ToastProvider";
import { MWPPageIntro } from "@/modules/mwp/components/MWPPageIntro";

export default function StagingPage() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <MWPPageIntro title="Testmiljö och driftsättning" subtitle="Klona produktion till testmiljö, jämför miljöer och rulla ut ändringar." />

      <div className="grid gap-4 md:grid-cols-2">
        {stagingFlows.map((flow) => (
          <Card key={flow.siteId} className="p-5">
            <div className="text-sm font-semibold">{siteName(flow.siteId)}</div>
            <div className="mt-1 text-xs text-muted">Senaste klon {flow.lastClone} · senaste driftsättning {flow.lastPromote}</div>
            <div className="mt-4 space-y-2">
              {flow.diffSummary.map((line) => (
                <div key={line} className="rounded-lg border bg-bg/40 px-3 py-2 text-sm">{line}</div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" onClick={() => toast.success("Klon till testmiljö köad", siteName(flow.siteId))}>
                <Copy size={13} className="mr-1.5" />
                Klona
              </Button>
              <Button variant="secondary" onClick={() => toast.info("Miljöjämförelse öppnad", siteName(flow.siteId))}>
                <GitCompareArrows size={13} className="mr-1.5" />
                Jämför
              </Button>
              <Button onClick={() => toast.success("Produktionsdriftsättning köad", siteName(flow.siteId))}>
                <Rocket size={13} className="mr-1.5" />
                Driftsätt
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
