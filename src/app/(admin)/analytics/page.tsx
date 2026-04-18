import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";

const traffic = Array.from({ length: 24 }, (_, i) => ({
  label: `${i + 1}`,
  value: Math.round(2400 + Math.sin(i / 2) * 900 + Math.cos(i * 1.3) * 400 + i * 30),
}));

const countries = [
  { label: "Sverige", value: 42800 },
  { label: "Norge", value: 31200 },
  { label: "Danmark", value: 24500 },
  { label: "Finland", value: 18900 },
  { label: "Tyskland", value: 14300 },
  { label: "USA", value: 11700 },
  { label: "Övrigt", value: 9400 },
];

const sources = [
  { label: "Direkt", value: 42, color: "rgb(16 185 129)" },
  { label: "Sök", value: 28, color: "rgb(59 130 246)" },
  { label: "Sociala medier", value: 18, color: "rgb(245 158 11)" },
  { label: "Email", value: 8, color: "rgb(236 72 153)" },
  { label: "Övrigt", value: 4, color: "rgb(161 161 170)" },
];

const topPages = [
  { path: "/dashboard", views: 24892, change: 12.3 },
  { path: "/users", views: 18430, change: 8.7 },
  { path: "/settings", views: 9210, change: -2.1 },
  { path: "/login", views: 7640, change: 22.4 },
  { path: "/analytics", views: 6120, change: 4.5 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Analytics" subtitle="Statistik och insikter" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sidvisningar" value="184 293" delta={18.2} hint="senaste 24h" />
        <StatCard label="Unika besökare" value="42 810" delta={6.4} hint="senaste 24h" />
        <StatCard label="Genomsn. session" value="3m 42s" delta={-1.8} hint="vs igår" />
        <StatCard label="Bounce rate" value="38.2%" delta={-4.1} hint="vs igår" />
      </div>

      <Card className="p-6">
        <div className="mb-5">
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Trafik (24h)</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
            {traffic.reduce((s, d) => s + d.value, 0).toLocaleString("sv-SE")} visningar
          </div>
        </div>
        <AreaChart data={traffic} />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3">
          <div className="mb-5">
            <h2 className="text-base font-semibold tracking-tight">Besökare per land</h2>
            <p className="mt-0.5 text-sm text-muted">Topp 7 marknader senaste månaden</p>
          </div>
          <BarChart data={countries} />
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="mb-5">
            <h2 className="text-base font-semibold tracking-tight">Trafikkällor</h2>
            <p className="mt-0.5 text-sm text-muted">Fördelning</p>
          </div>
          <DonutChart data={sources} />
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold tracking-tight">Topp-sidor</h2>
          <p className="mt-0.5 text-sm text-muted">Mest besökta sidor senaste 7 dagarna</p>
        </div>
        <div className="divide-y divide-border/60">
          {topPages.map((p) => {
            const max = topPages[0].views;
            const pct = (p.views / max) * 100;
            const up = p.change >= 0;
            return (
              <div key={p.path} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="truncate font-mono text-sm">{p.path}</div>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-fg/5">
                    <div className="h-full rounded-full bg-fg/60" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="text-sm font-medium tabular-nums">{p.views.toLocaleString("sv-SE")}</div>
                <div
                  className={
                    up
                      ? "text-xs font-medium tabular-nums text-emerald-600 dark:text-emerald-400"
                      : "text-xs font-medium tabular-nums text-red-600 dark:text-red-400"
                  }
                >
                  {up ? "+" : ""}
                  {p.change}%
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
