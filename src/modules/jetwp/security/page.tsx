"use client";

import { ShieldAlert, RefreshCw, Wrench } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { StatCard } from "@/components/ui/StatCard";
import { useToast } from "@/components/toast/ToastProvider";
import { securityFindings } from "../extended-data";
import { JetWPPageIntro } from "@/modules/jetwp/components/JetWPPageIntro";

export default function SecurityPage() {
  const toast = useToast();
  const open = securityFindings.filter((finding) => finding.status === "open");

  return (
    <div className="space-y-6">
      <JetWPPageIntro
        title="Security"
        subtitle="Vulnerability scanner, CVEs and remediation flow per site."
        actions={
          <Button onClick={() => toast.success("Integrity scan queued")}>
            <RefreshCw size={14} className="mr-1.5" />
            Run scan
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Open findings" value={String(open.length)} />
        <StatCard label="Critical" value={String(open.filter((finding) => finding.severity === "critical").length)} />
        <StatCard label="Mitigated" value={String(securityFindings.filter((finding) => finding.status === "mitigated").length)} />
        <StatCard label="Tracked sites" value={String(new Set(securityFindings.map((finding) => finding.siteId)).size)} />
      </div>

      <div className="space-y-3">
        {securityFindings.map((finding) => (
          <Card key={finding.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">{finding.title}</div>
                  <Badge tone={finding.severity === "critical" ? "danger" : finding.severity === "high" ? "warning" : "neutral"}>
                    {finding.severity}
                  </Badge>
                  <span className="font-mono text-[11px] text-muted">{finding.cve}</span>
                </div>
                <div className="mt-1 text-sm text-muted">{finding.summary}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                  <span>{finding.target}</span>
                  <span>·</span>
                  <span>{finding.installedVersion} → {finding.fixedVersion}</span>
                  <span>·</span>
                  <span>{finding.detectedAt}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => toast.info("Remediation plan opened", finding.id)}>
                  <ShieldAlert size={13} className="mr-1.5" />
                  Review
                </Button>
                <Button variant="secondary" onClick={() => toast.success("Patch job queued", finding.id)}>
                  <Wrench size={13} className="mr-1.5" />
                  Remediate
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
