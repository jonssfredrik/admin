"use client";

import Link from "next/link";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { AreaChart } from "@/components/charts/AreaChart";
import { Badge } from "@/components/ui/Table";
import { visitsByDay } from "@/modules/jetwp/[id]/data";
import { HealthRow, MiniStat } from "@/modules/jetwp/site-detail/SiteDetailPrimitives";
import type { SiteOverviewModel } from "@/modules/jetwp/selectors/site-detail";

interface OverviewTabProps {
  overview: SiteOverviewModel;
}

export function OverviewTab({ overview }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {overview.unresolvedAlerts.length > 0 && (
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Olösta larm</h2>
              <p className="mt-0.5 text-xs text-muted">Kritiska och varnande larm kopplade till den här sajten.</p>
            </div>
            <Link href="/jetwp/alerts" className="text-xs text-muted hover:text-fg">
              Visa alla larm
            </Link>
          </div>
          <div className="divide-y divide-border/60">
            {overview.unresolvedAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 px-5 py-3">
                <span
                  className={clsx(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                    alert.severity === "critical" ? "bg-red-500" : "bg-amber-500",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="truncate text-sm font-semibold">{alert.title}</div>
                    <Badge tone={alert.severity === "critical" ? "danger" : "warning"}>
                      {alert.severity === "critical" ? "Kritisk" : "Varning"}
                    </Badge>
                    <span className="font-mono text-[11px] text-muted">{alert.source}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted">{alert.description}</div>
                </div>
                <span className="shrink-0 text-[11px] tabular-nums text-muted">{alert.createdAt}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MiniStat label="Besök 30 dgr" value={overview.visits30d.toLocaleString("sv-SE")} />
        <MiniStat
          label="Uppdateringar"
          value={String(overview.updatesAvailable)}
          tone={overview.updatesAvailable > 0 ? "warning" : "default"}
        />
        <MiniStat
          label="Lagring"
          value={`${overview.storageGB} / ${overview.storageLimitGB} GB`}
          pct={overview.storagePct}
        />
        <MiniStat label="SSL" value={`${overview.sslDays} dagar`} tone={overview.sslDays < 30 ? "warning" : "default"} />
      </div>

      <Card className="p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold tracking-tight">Trafiktrend</h2>
          <p className="mt-0.5 text-sm text-muted">Dagliga unika besök de senaste 30 dagarna.</p>
        </div>
        <AreaChart data={visitsByDay} />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-tight">Sajtstatus</h2>
          <div className="space-y-2.5">
            <HealthRow
              ok={overview.status !== "offline"}
              label="HTTP"
              detail={overview.status === "offline" ? "Ingen respons från sajten" : "Sajten svarar"}
            />
            <HealthRow
              ok={overview.sslDays >= 30}
              label="SSL"
              detail={`${overview.sslDays} dagar kvar`}
              warn={overview.sslDays < 30}
            />
            <HealthRow
              ok={!overview.heartbeatStale}
              label="Incheckning"
              detail={overview.lastHeartbeat}
              warn={overview.heartbeatStale}
            />
            <HealthRow
              ok={overview.securityUpdates === 0}
              label="Säkerhetsfynd"
              detail={`${overview.securityUpdates} öppna`}
              warn={overview.securityUpdates > 0}
            />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-tight">JetWP-agent</h2>
          <div className="space-y-2.5">
            <HealthRow
              ok={!overview.heartbeatStale}
              label="Agentkontakt"
              detail={overview.heartbeatStale ? "Fördröjd incheckning" : "Rapporterar normalt"}
              warn={overview.heartbeatStale}
            />
            <HealthRow
              ok={overview.updatesAvailable === 0}
              label="Uppdateringskö"
              detail={overview.updatesAvailable > 0 ? `${overview.updatesAvailable} åtgärder väntar` : "Inga väntande åtgärder"}
              warn={overview.updatesAvailable > 0}
            />
            <HealthRow
              ok={overview.storagePct < 85}
              label="Webbutrymme"
              detail={`${overview.storageGB} / ${overview.storageLimitGB} GB används`}
              warn={overview.storagePct >= 85}
            />
            <div className="rounded-xl border bg-bg/40 px-3 py-2.5 text-xs leading-5 text-muted">
              Serverstatus och resursdata hanteras i hostingbolagets ordinarie kontrollpanel.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
