"use client";

import { Card } from "@/components/ui/Card";
import { AreaChart } from "@/components/charts/AreaChart";
import type { Site } from "@/modules/jetwp/data/core";
import { backupDetails } from "@/modules/jetwp/extended-data";
import { visitsByDay } from "@/modules/jetwp/[id]/data";
import { HealthRow, MiniStat, ResourceRow } from "@/modules/jetwp/site-detail/SiteDetailPrimitives";

interface OverviewTabProps {
  site: Site;
  siteId: string;
}

export function OverviewTab({ site, siteId }: OverviewTabProps) {
  const storagePct = (site.storageGB / site.storageLimitGB) * 100;
  const backupCount = backupDetails.filter((item) => item.siteId === siteId).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MiniStat label="Besök 30 dgr" value={site.visits30d.toLocaleString("sv-SE")} />
        <MiniStat label="Uppdateringar" value={String(site.updatesAvailable)} tone={site.updatesAvailable > 0 ? "warning" : "default"} />
        <MiniStat label="Lagring" value={`${site.storageGB} / ${site.storageLimitGB} GB`} pct={storagePct} />
        <MiniStat label="Backupspårade" value={String(backupCount)} />
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
            <HealthRow ok={site.status !== "offline"} label="HTTP" detail={site.status === "offline" ? "Timeout — ingen respons" : "200 OK · 142 ms"} />
            <HealthRow ok={site.sslDays >= 30} label="SSL" detail={`${site.sslDays} dagar kvar`} warn={site.sslDays < 30} />
            <HealthRow ok={!site.heartbeatStale} label="Incheckning" detail={site.lastHeartbeat} warn={site.heartbeatStale} />
            <HealthRow ok label="Säkerhetskopia" detail={`Senaste ${site.lastBackup}`} />
            <HealthRow ok={site.securityUpdates === 0} label="Säkerhetsfynd" detail={`${site.securityUpdates} öppna`} warn={site.securityUpdates > 0} />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-tight">Resurser</h2>
          <div className="space-y-4">
            <ResourceRow label="CPU" value={site.cpuPct} max="4 vCPU" />
            <ResourceRow label="Minne" value={site.ramPct} max="8 GB" />
            <ResourceRow label="Disk-I/O" value={site.diskIoPct} max="480 IOPS" />
            <ResourceRow label="Bandbredd" value={site.bandwidthPct} max="100 Mbit/s" />
          </div>
        </Card>
      </div>
    </div>
  );
}
