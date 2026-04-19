"use client";

import { UserCog } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { siteMemberships } from "../extended-data";
import { siteName } from "../data";
import { useToast } from "@/components/toast/ToastProvider";
import { JetWPPageIntro } from "@/modules/jetwp/components/JetWPPageIntro";

const roleLabels: Record<string, string> = {
  admin: "admin",
  deploy: "driftsätt",
  "read-only": "endast läsning",
};

const teamLabels: Record<string, string> = {
  Ops: "Drift",
  Delivery: "Leverans",
  Support: "Support",
  "Customer success": "Kundansvar",
};

export default function AccessPage() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <JetWPPageIntro
        title="Åtkomst"
        subtitle="Behörigheter per sajt för roller som endast läsning, driftsättning och admin."
        actions={
          <Button onClick={() => toast.success("Dialog för rolltilldelning öppnad")}>
            <UserCog size={14} className="mr-1.5" />
            Tilldela åtkomst
          </Button>
        }
      />

      <div className="space-y-4">
        {siteMemberships.map((membership) => (
          <Card key={membership.siteId} className="p-5">
            <div className="text-sm font-semibold">{siteName(membership.siteId)}</div>
            <div className="mt-3 space-y-2">
              {membership.members.map((member) => (
                <div key={member.email} className="flex items-center justify-between gap-3 rounded-lg border bg-bg/40 px-3 py-2">
                  <div>
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-[11px] text-muted">{member.email} · {teamLabels[member.team] ?? member.team}</div>
                  </div>
                  <Badge tone={member.role === "admin" ? "danger" : member.role === "deploy" ? "warning" : "neutral"}>{roleLabels[member.role] ?? member.role}</Badge>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
