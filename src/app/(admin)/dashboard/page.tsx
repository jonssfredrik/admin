import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { RevenueCard } from "@/components/charts/RevenueCard";

const activity = [
  { user: "Astrid Lindgren", action: "Uppdaterade profil", status: "success" as const, time: "2 min sedan" },
  { user: "Olof Palme", action: "Loggade in", status: "neutral" as const, time: "14 min sedan" },
  { user: "Greta Thunberg", action: "Skapade rapport", status: "success" as const, time: "1 tim sedan" },
  { user: "Zlatan Ibrahimović", action: "Misslyckad inloggning", status: "danger" as const, time: "2 tim sedan" },
  { user: "Selma Lagerlöf", action: "Delade dokument", status: "warning" as const, time: "igår" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" subtitle="Översikt över din verksamhet" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Intäkter" value="480 294 kr" delta={12.4} hint="vs föregående månad" />
        <StatCard label="Aktiva användare" value="2 847" delta={4.1} hint="senaste 30 dagarna" />
        <StatCard label="Konverteringar" value="3.8%" delta={-0.6} hint="vs föregående vecka" />
        <StatCard label="Supportärenden" value="12" delta={-22} hint="öppna just nu" />
      </div>

      <RevenueCard />

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-semibold tracking-tight">Senaste aktivitet</h2>
          <a href="#" className="text-xs text-muted hover:text-fg">Visa alla</a>
        </div>
        <Table>
          <thead>
            <tr>
              <Th>Användare</Th>
              <Th>Händelse</Th>
              <Th>Status</Th>
              <Th className="text-right">Tid</Th>
            </tr>
          </thead>
          <tbody>
            {activity.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-bg/50">
                <Td>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-fg/10 text-[11px] font-medium">
                      {row.user.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <span className="font-medium">{row.user}</span>
                  </div>
                </Td>
                <Td className="text-muted">{row.action}</Td>
                <Td>
                  <Badge tone={row.status}>
                    {row.status === "success" ? "Lyckad" : row.status === "danger" ? "Misslyckad" : row.status === "warning" ? "Väntar" : "Info"}
                  </Badge>
                </Td>
                <Td className="text-right text-muted tabular-nums">{row.time}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
    </div>
  );
}
