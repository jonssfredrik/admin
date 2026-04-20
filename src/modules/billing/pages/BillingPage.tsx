"use client";

import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { invoiceDrafts } from "@/modules/billing/data";
import { IncomingSubscriptionInvoices } from "@/modules/subscriptions/components/IncomingSubscriptionInvoices";

const statusTone = {
  draft: "neutral",
  sent: "warning",
  paid: "success",
} as const;

export function BillingPage() {
  const draftCount = invoiceDrafts.filter((invoice) => invoice.status === "draft").length;
  const sentCount = invoiceDrafts.filter((invoice) => invoice.status === "sent").length;
  const paidValue = invoiceDrafts
    .filter((invoice) => invoice.status === "paid")
    .map((invoice) => invoice.amount)
    .join(" · ");

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Billing"
          subtitle="Manuella fakturor, företagsöversikt och status för skickade betalflöden."
        />
        <Button>
          <Plus size={14} strokeWidth={2} className="mr-1.5" />
          Ny faktura
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Utkast" value={String(draftCount)} hint="Redo att kompletteras" />
        <StatCard label="Skickade" value={String(sentCount)} hint="Väntar på betalning" />
        <StatCard label="Betalt senast" value={paidValue || "0 kr"} hint="Senaste registrerade inflöden" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Table>
          <thead>
            <tr>
              <Th>Faktura</Th>
              <Th>Bolag</Th>
              <Th>Kund</Th>
              <Th>Status</Th>
              <Th>Förfallodatum</Th>
              <Th className="text-right">Belopp</Th>
            </tr>
          </thead>
          <tbody>
            {invoiceDrafts.map((invoice) => (
              <tr key={invoice.id} className="transition-colors hover:bg-bg/50">
                <Td className="font-mono text-xs">
                  <Link href={`/billing/${invoice.id}`} className="hover:text-fg">
                    {invoice.id}
                  </Link>
                </Td>
                <Td>{invoice.company}</Td>
                <Td>{invoice.customer}</Td>
                <Td>
                  <Badge tone={statusTone[invoice.status]}>
                    {invoice.status === "draft" ? "Utkast" : invoice.status === "sent" ? "Skickad" : "Betald"}
                  </Badge>
                </Td>
                <Td className="font-mono text-xs tabular-nums text-muted">{invoice.dueDate}</Td>
                <Td className="text-right font-medium">{invoice.amount}</Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <FileText size={15} />
            Arbetsyta för manuell fakturering
          </div>
          <p className="mt-2 text-sm text-muted">
            Den här modulen är första plattformsvalideringen för formulär, listor och ekonomiflöden i adminpanelen.
          </p>
          <div className="mt-5 space-y-3 text-sm">
            <div className="rounded-xl border bg-bg/40 p-3">
              <div className="font-medium">Nästa steg</div>
              <div className="mt-1 text-muted">Företagsprofil, fakturarader, moms och PDF-export.</div>
            </div>
            <div className="rounded-xl border bg-bg/40 p-3">
              <div className="font-medium">Roll i plattformen</div>
              <div className="mt-1 text-muted">Affärsmodul bredvid driftmoduler som JetWP och Domains.</div>
            </div>
          </div>
        </Card>
      </div>

      <IncomingSubscriptionInvoices />
    </div>
  );
}
