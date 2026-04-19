import Link from "next/link";
import { ArrowRight, Command, Layers3 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { featuredAreas, moduleHighlights } from "@/config/navigation";

const crossModuleActivity = [
  { area: "Operations", item: "JetWP", event: "2 kritiska alerts öppna", tone: "danger" as const, time: "Nu" },
  { area: "Business", item: "Billing", event: "1 fakturautkast redo att skickas", tone: "warning" as const, time: "08:30" },
  { area: "Operations", item: "Domains", event: "1 domän behöver förnyelsebeslut", tone: "warning" as const, time: "09:10" },
  { area: "Workspace", item: "Users", event: "Ny inbjudan skickad", tone: "success" as const, time: "I går" },
];

export function HubHomePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Admin Hub"
          subtitle="Din samlade admin-panel för arbete, drift, ekonomi och personliga system."
        />
        <div className="hidden items-center gap-2 rounded-xl border bg-surface px-3 py-2 text-sm text-muted md:flex">
          <Command size={15} />
          Cmd/Ctrl + K för snabbnavigering
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Aktiva moduler" value={String(moduleHighlights.length)} hint="JetWP, Domains och Billing live" />
        <StatCard label="Plattformsläge" value="Frontend-first" hint="Shell och moduler delar samma struktur" />
        <StatCard label="Nav-modell" value="Område först" hint="Hub, Operations, Business, Workspace" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Moduler</h2>
              <p className="mt-1 text-sm text-muted">Varje delsystem lever som en egen modul ovanpå samma shell.</p>
            </div>
            <Layers3 size={16} className="text-muted" />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {moduleHighlights.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.id}
                  href={module.href}
                  className="rounded-2xl border bg-bg/40 p-4 transition-colors hover:bg-bg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fg/5">
                      <Icon size={18} />
                    </div>
                    <ArrowRight size={14} className="text-muted" />
                  </div>
                  <div className="mt-4 text-base font-semibold tracking-tight">{module.title}</div>
                  <p className="mt-1 text-sm text-muted">{module.description}</p>
                  <div className="mt-4 space-y-1.5">
                    {module.metrics.map((metric) => (
                      <div key={`${module.id}-${metric.label}`} className="text-xs text-muted">
                        <span className="font-medium text-fg">{metric.label}:</span> {metric.value}
                        {metric.hint ? ` · ${metric.hint}` : ""}
                      </div>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold tracking-tight">Områden</h2>
          <div className="mt-4 space-y-3">
            {featuredAreas.map((area) => {
              const Icon = area.icon;
              return (
                <div key={area.title} className="rounded-2xl border bg-bg/40 p-4">
                  <div className="flex items-center gap-2">
                    <Icon size={15} className="text-muted" />
                    <div className="font-medium">{area.title}</div>
                  </div>
                  <div className="mt-1 text-sm text-muted">{area.description}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-semibold tracking-tight">Tvärmodulär aktivitet</h2>
          <span className="text-xs text-muted">Global startsida för hela plattformen</span>
        </div>
        <Table>
          <thead>
            <tr>
              <Th>Område</Th>
              <Th>Modul</Th>
              <Th>Händelse</Th>
              <Th>Status</Th>
              <Th className="text-right">Tid</Th>
            </tr>
          </thead>
          <tbody>
            {crossModuleActivity.map((row) => (
              <tr key={`${row.area}-${row.item}-${row.time}`} className="transition-colors hover:bg-bg/50">
                <Td>{row.area}</Td>
                <Td className="font-medium">{row.item}</Td>
                <Td className="text-muted">{row.event}</Td>
                <Td>
                  <Badge tone={row.tone}>
                    {row.tone === "danger" ? "Viktig" : row.tone === "warning" ? "Behöver beslut" : "Klar"}
                  </Badge>
                </Td>
                <Td className="text-right text-muted">{row.time}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
    </div>
  );
}
