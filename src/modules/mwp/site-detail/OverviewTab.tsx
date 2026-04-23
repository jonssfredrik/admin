"use client";

import { Card } from "@/components/ui/Card";
import { AreaChart } from "@/components/charts/AreaChart";
import { visitsByDay } from "@/modules/mwp/[id]/data";
import { HealthRow, MiniStat, ResourceRow } from "@/modules/mwp/site-detail/SiteDetailPrimitives";
import type { SiteOverviewModel } from "@/modules/mwp/selectors/site-detail";

interface OverviewTabProps {
  overview: SiteOverviewModel;
}

export function OverviewTab({ overview }: OverviewTabProps) {
  return (
    <div className="space-y-6">
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
          <h2 className="mb-4 text-sm font-semibold tracking-tight">Hälsokontroll</h2>
          <div className="space-y-2.5">
            <HealthRow
              ok={overview.status !== "offline"}
              label="HTTP"
              detail={overview.status === "offline" ? "Timeout - ingen respons" : "200 OK - 142 ms"}
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
          <h2 className="mb-4 text-sm font-semibold tracking-tight">Resurser</h2>
          <div className="space-y-4">
            <ResourceRow label="CPU" value={overview.cpuPct} max="4 vCPU" />
            <ResourceRow label="Minne" value={overview.ramPct} max="8 GB" />
            <ResourceRow label="Disk-I/O" value={overview.diskIoPct} max="480 IOPS" />
            <ResourceRow label="Bandbredd" value={overview.bandwidthPct} max="100 Mbit/s" />
          </div>
        </Card>
      </div>
    </div>
  );
}
