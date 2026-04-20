"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge, Table, Td, Th } from "@/components/ui/Table";
import { Card } from "@/components/ui/Card";
import { invoiceDrafts } from "@/modules/billing/data";

const statusTone = {
  draft: "neutral",
  sent: "warning",
  paid: "success",
} as const;

export function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const invoice = invoiceDrafts.find((item) => item.id === id);

  if (!invoice) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/billing"
        className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft size={13} />
        Tillbaka till fakturering
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title={invoice.id}
          subtitle={`Förfallodatum ${invoice.dueDate} · ${invoice.customer}`}
        />
        <Badge tone={statusTone[invoice.status]}>
          {invoice.status === "draft" ? "Utkast" : invoice.status === "sent" ? "Skickad" : "Betald"}
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-0">
          <Table className="shadow-none">
            <thead>
              <tr>
                <Th>Fält</Th>
                <Th>Värde</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Bolag</Td>
                <Td>{invoice.company}</Td>
              </tr>
              <tr>
                <Td>Kund</Td>
                <Td>{invoice.customer}</Td>
              </tr>
              <tr>
                <Td>Belopp</Td>
                <Td>{invoice.amount}</Td>
              </tr>
              <tr>
                <Td>Förfallodatum</Td>
                <Td className="font-mono text-xs">{invoice.dueDate}</Td>
              </tr>
              <tr>
                <Td>Kategori</Td>
                <Td className="capitalize">{invoice.category}</Td>
              </tr>
            </tbody>
          </Table>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <FileText size={15} />
            Kontext
          </div>
          <p className="mt-2 text-sm text-muted">
            Detaljsidan använder samma mock-data som översikten och fungerar som mållänk för kalenderns
            aggregerade Billing-händelser.
          </p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl border bg-bg/40 p-3">
              <div className="font-medium">Nästa steg</div>
              <div className="mt-1 text-muted">Koppla fakturarader, momsfält och export när Billing byggs ut.</div>
            </div>
            <div className="rounded-xl border bg-bg/40 p-3">
              <div className="font-medium">Kalenderkoppling</div>
              <div className="mt-1 text-muted">Förfallodatumet exponeras i kalendern som deadline.</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
