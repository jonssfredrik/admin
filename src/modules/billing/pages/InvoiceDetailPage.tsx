import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge, Table, Td, Th } from "@/components/ui/Table";
import { Card } from "@/components/ui/Card";
import {
  formatInvoiceAmount,
  invoiceCategoryLabel,
  invoiceStatusLabel,
  invoiceStatusTone,
} from "@/modules/billing/lib/format";
import { getInvoiceById } from "@/modules/billing/lib/invoices";

export function InvoiceDetailPage({ id }: { id: string }) {
  const invoice = getInvoiceById(id);

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
          subtitle={`Förfallodatum ${invoice.dueDate} · ${invoice.customerName}`}
        />
        <Badge tone={invoiceStatusTone[invoice.status]}>{invoiceStatusLabel[invoice.status]}</Badge>
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
                <Td>{invoice.companyName}</Td>
              </tr>
              <tr>
                <Td>Kund</Td>
                <Td>{invoice.customerName}</Td>
              </tr>
              <tr>
                <Td>Belopp</Td>
                <Td>{formatInvoiceAmount(invoice.amountOre, invoice.currency)}</Td>
              </tr>
              <tr>
                <Td>Förfallodatum</Td>
                <Td className="font-mono text-xs">{invoice.dueDate}</Td>
              </tr>
              <tr>
                <Td>Utfärdad</Td>
                <Td className="font-mono text-xs">{invoice.issuedDate}</Td>
              </tr>
              <tr>
                <Td>Valuta</Td>
                <Td>{invoice.currency}</Td>
              </tr>
              <tr>
                <Td>Kategori</Td>
                <Td>{invoiceCategoryLabel[invoice.category]}</Td>
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
            Detaljsidan använder samma billing-källa som översikten och fungerar som mållänk för kalenderns
            aggregerade billing-händelser.
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
