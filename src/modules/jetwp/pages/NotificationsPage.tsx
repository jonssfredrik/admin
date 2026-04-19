"use client";

import Link from "next/link";
import { ArrowLeft, Bell, Mail, Webhook } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { notificationChannels, notificationRules } from "@/modules/jetwp/data";

const channelStatusLabels: Record<string, string> = {
  active: "aktiv",
  degraded: "störd",
};

export function NotificationsPage() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"><ArrowLeft size={12} />JetWP</Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <PageHeader title="Notifikationer" subtitle="Kanaler, routningsregler och eskaleringsvägar för larm." />
          <Button onClick={() => toast.success("Ny notifikationsregel påbörjad")}>
            <Bell size={14} className="mr-1.5" />
            Ny regel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="border-b px-5 py-3 text-sm font-semibold">Kanaler</div>
          <div className="divide-y divide-border/60">
            {notificationChannels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {channel.type === "email" ? <Mail size={13} /> : channel.type === "webhook" ? <Webhook size={13} /> : <Bell size={13} />}
                    {channel.name}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted">{channel.target}</div>
                </div>
                <Badge tone={channel.status === "active" ? "success" : "warning"}>{channelStatusLabels[channel.status] ?? channel.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b px-5 py-3 text-sm font-semibold">Regler</div>
          <div className="divide-y divide-border/60">
            {notificationRules.map((rule) => (
              <div key={rule.id} className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{rule.name}</div>
                  <Badge tone="neutral">{rule.siteIds.length} sajter</Badge>
                </div>
                <div className="mt-1 text-[11px] text-muted">{rule.escalation}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {rule.eventTypes.map((eventType) => <Badge key={eventType} tone="warning">{eventType}</Badge>)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
