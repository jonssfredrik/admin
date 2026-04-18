"use client";

import Link from "next/link";
import { ArrowLeft, UserCog } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { siteMemberships } from "../extended-data";
import { useToast } from "@/components/toast/ToastProvider";

export default function AccessPage() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"><ArrowLeft size={12} />JetWP</Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <PageHeader title="Site access" subtitle="Per-site permissions for read-only, deploy and admin roles." />
          <Button onClick={() => toast.success("Role assignment dialog opened")}>
            <UserCog size={14} className="mr-1.5" />
            Assign access
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {siteMemberships.map((membership) => (
          <Card key={membership.siteId} className="p-5">
            <div className="text-sm font-semibold">{membership.siteId}</div>
            <div className="mt-3 space-y-2">
              {membership.members.map((member) => (
                <div key={member.email} className="flex items-center justify-between gap-3 rounded-lg border bg-bg/40 px-3 py-2">
                  <div>
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-[11px] text-muted">{member.email} · {member.team}</div>
                  </div>
                  <Badge tone={member.role === "admin" ? "danger" : member.role === "deploy" ? "warning" : "neutral"}>{member.role}</Badge>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
