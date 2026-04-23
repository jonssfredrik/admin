"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, ChevronDown, ChevronUp, Mail, Send, Webhook } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { notificationChannels, notificationRules } from "@/modules/mwp/data";
import { siteName } from "@/modules/mwp/data";

const channelStatusLabels: Record<string, string> = {
  active: "aktiv",
  degraded: "störd",
};

const channelTypeIcon = {
  email: Mail,
  webhook: Webhook,
  slack: Bell,
} as const;

export function NotificationsPage() {
  const toast = useToast();
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/mwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"><ArrowLeft size={12} />MWP</Link>
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
            {notificationChannels.map((channel) => {
              const Icon = channelTypeIcon[channel.type];
              return (
                <div key={channel.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Icon size={13} />
                      {channel.name}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted">{channel.target}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={channel.status === "active" ? "success" : "warning"}>{channelStatusLabels[channel.status] ?? channel.status}</Badge>
                    <button
                      onClick={() => toast.success("Testmeddelande skickat", channel.name)}
                      className="inline-flex h-7 items-center rounded-md border bg-surface px-2 text-xs font-medium hover:bg-bg"
                    >
                      <Send size={11} className="mr-1" />
                      Testa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b px-5 py-3 text-sm font-semibold">Regler</div>
          <div className="divide-y divide-border/60">
            {notificationRules.map((rule) => {
              const isExpanded = expandedRule === rule.id;
              return (
                <div key={rule.id} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{rule.name}</div>
                        <button
                          onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                          className="inline-flex items-center gap-1 rounded-md border bg-surface px-1.5 py-0.5 text-[11px] font-medium hover:bg-bg"
                        >
                          {rule.siteIds.length} sajter
                          {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                        </button>
                      </div>
                      <div className="mt-1 text-[11px] text-muted">{rule.escalation}</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {rule.eventTypes.map((eventType) => <Badge key={eventType} tone="warning">{eventType}</Badge>)}
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className={clsx("mt-3 space-y-1 rounded-lg border bg-bg/40 p-3")}>
                      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">Täcker dessa sajter</div>
                      {rule.siteIds.map((id) => (
                        <Link key={id} href={`/mwp/${id}`} className="flex items-center gap-2 rounded-md px-2 py-1 text-xs hover:bg-bg">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {siteName(id)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
