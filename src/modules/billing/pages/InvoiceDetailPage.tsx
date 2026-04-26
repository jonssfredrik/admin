"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  FileText,
  Pencil,
  Printer,
  Send,
  Undo2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge, Table, Td, Th } from "@/components/ui/Table";
import { Card } from "@/components/ui/Card";
import { RowMenu, type RowMenuEntry } from "@/components/ui/RowMenu";
import { useToast } from "@/components/toast/ToastProvider";
import { todayIso } from "@/modules/billing/lib/dates";
import {
  formatInvoiceAmount,
  invoiceDisplayNumber,
  invoiceDisplayStatus,
} from "@/modules/billing/lib/format";
import { formatVatRate, invoiceTotals, lineNetOre } from "@/modules/billing/lib/totals";
import { useCompanies } from "@/modules/billing/lib/useCompanies";
import { useInvoices } from "@/modules/billing/lib/useInvoices";

export function InvoiceDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const toast = useToast();
  const { hydrated, items, update, duplicate } = useInvoices();
  const { items: companies } = useCompanies();

  const invoice = useMemo(() => items.find((inv) => inv.id === id), [items, id]);
  const company = useMemo(
    () => (invoice ? companies.find((c) => c.id === invoice.companyId) : undefined),
    [companies, invoice],
  );
  const totals = useMemo(() => (invoice ? invoiceTotals(invoice) : undefined), [invoice]);

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <div className="h-4 w-40 animate-pulse rounded bg-bg" />
        <div className="h-32 animate-pulse rounded-2xl bg-bg" />
      </div>
    );
  }

  if (!invoice || !totals) {
    return (
      <div className="space-y-4">
        <Link
          href="/billing"
          className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft size={13} />
          Tillbaka till fakturering
        </Link>
        <Card className="py-12 text-center text-sm text-muted">Fakturan kunde inte hittas.</Card>
      </div>
    );
  }

  const customerLines = [
    invoice.customer.contactPerson ? `Att: ${invoice.customer.contactPerson}` : null,
    invoice.customer.name,
    invoice.customer.orgNumber,
    invoice.customer.address,
    [invoice.customer.postalCode, invoice.customer.city].filter(Boolean).join(" "),
    invoice.customer.email,
    invoice.customer.phone,
  ].filter((line): line is string => !!line && String(line).trim() !== "");

  const display = invoiceDisplayStatus(invoice);

  const markSent = () => {
    update(invoice.id, { status: "sent", paidDate: undefined });
    toast.success("Markerad som skickad", invoiceDisplayNumber(invoice));
  };
  const markPaid = () => {
    update(invoice.id, { status: "paid", paidDate: invoice.paidDate ?? todayIso() });
    toast.success("Markerad som betald", invoiceDisplayNumber(invoice));
  };
  const markDraft = () => {
    update(invoice.id, { status: "draft", paidDate: undefined });
    toast.info("Återställd till utkast", invoiceDisplayNumber(invoice));
  };
  const handleDuplicate = () => {
    const newId = duplicate(invoice.id);
    if (newId) {
      toast.success("Faktura duplicerad", invoiceDisplayNumber({ id: newId }));
      router.push(`/billing/${newId}/edit`);
    }
  };

  const actionItems: RowMenuEntry[] = [
    { label: "Duplicera", icon: Copy, onClick: handleDuplicate },
    { divider: true },
  ];
  if (invoice.status === "draft") {
    actionItems.push({ label: "Markera som skickad", icon: Send, onClick: markSent });
  }
  if (invoice.status !== "paid") {
    actionItems.push({ label: "Markera som betald", icon: CheckCircle2, onClick: markPaid });
  }
  if (invoice.status !== "draft") {
    actionItems.push({ label: "Återställ till utkast", icon: Undo2, onClick: markDraft });
  }

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
          title={invoiceDisplayNumber(invoice)}
          subtitle={`Förfallodatum ${invoice.dueDate} · ${invoice.customer.name}`}
        />
        <div className="flex items-center gap-3">
          <Badge tone={display.tone}>{display.label}</Badge>
          <a
            href={`/print/billing/${invoice.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-lg border bg-surface px-3.5 text-sm font-medium transition-colors hover:bg-bg"
          >
            <Printer size={13} className="mr-1.5" />
            Skriv ut / PDF
          </a>
          <Link
            href={`/billing/${invoice.id}/edit`}
            className="inline-flex h-9 items-center justify-center rounded-lg border bg-surface px-3.5 text-sm font-medium transition-colors hover:bg-bg"
          >
            <Pencil size={13} className="mr-1.5" />
            Redigera
          </Link>
          <RowMenu items={actionItems} />
        </div>
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
                <Td>
                  <div>{company?.name ?? <span className="text-muted">— okänt företag</span>}</div>
                  {company?.fSkatt && (
                    <div className="mt-0.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                      Innehar F-skattsedel
                    </div>
                  )}
                </Td>
              </tr>
              <tr>
                <Td>Kund</Td>
                <Td>
                  <div className="space-y-0.5">
                    {customerLines.map((line, i) => (
                      <div key={i} className={i === 0 ? "font-medium" : "text-xs text-muted"}>
                        {line}
                      </div>
                    ))}
                    {!invoice.customerId && (
                      <div className="mt-1 text-[11px] text-muted">Manuellt angiven</div>
                    )}
                  </div>
                </Td>
              </tr>
              <tr>
                <Td>Utfärdad</Td>
                <Td className="font-mono text-xs">{invoice.issuedDate}</Td>
              </tr>
              <tr>
                <Td>Förfallodatum</Td>
                <Td className="font-mono text-xs">{invoice.dueDate}</Td>
              </tr>
              {invoice.paymentTermsDays !== undefined && (
                <tr>
                  <Td>Betalningsvillkor</Td>
                  <Td>{invoice.paymentTermsDays} dagar netto</Td>
                </tr>
              )}
              {invoice.paidDate && (
                <tr>
                  <Td>Betald</Td>
                  <Td className="font-mono text-xs">{invoice.paidDate}</Td>
                </tr>
              )}
              {invoice.theirReference && (
                <tr>
                  <Td>Er referens</Td>
                  <Td>{invoice.theirReference}</Td>
                </tr>
              )}
              {invoice.notes && (
                <tr>
                  <Td>Anteckningar</Td>
                  <Td className="whitespace-pre-wrap text-sm text-muted">{invoice.notes}</Td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <FileText size={15} />
            Summering
          </div>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Nettosumma</dt>
              <dd className="font-medium tabular-nums">{formatInvoiceAmount(totals.netOre, invoice.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Moms {formatVatRate(totals.vatRate)}</dt>
              <dd className="font-medium tabular-nums">{formatInvoiceAmount(totals.vatOre, invoice.currency)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t pt-2">
              <dt className="font-semibold">Totalt</dt>
              <dd className="font-semibold tabular-nums">{formatInvoiceAmount(totals.totalOre, invoice.currency)}</dd>
            </div>
          </dl>
          {company && (company.iban || company.bankgiro) && (
            <div className="mt-4 space-y-1 rounded-xl border bg-bg/40 p-3 text-xs">
              <div className="font-medium">Betalning</div>
              {company.bankgiro && <div className="text-muted">Bankgiro <span className="font-mono">{company.bankgiro}</span></div>}
              {company.iban && <div className="text-muted">IBAN <span className="font-mono">{company.iban}</span></div>}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-0">
        <div className="border-b px-5 py-3 text-sm font-semibold tracking-tight">Fakturarader</div>
        <Table className="shadow-none">
          <thead>
            <tr>
              <Th>Beskrivning</Th>
              <Th className="text-right">Antal</Th>
              <Th className="text-right">À-pris</Th>
              <Th className="text-right">Summa</Th>
            </tr>
          </thead>
          <tbody>
            {invoice.lines.map((line) => (
              <tr key={line.id}>
                <Td>
                  <div className="font-medium">{line.description}</div>
                  {line.articleNumber && (
                    <div className="mt-0.5 font-mono text-[11px] text-muted">{line.articleNumber}</div>
                  )}
                </Td>
                <Td className="text-right tabular-nums">
                  {line.quantity}
                  {line.unit && <span className="ml-1 text-muted">{line.unit}</span>}
                </Td>
                <Td className="text-right tabular-nums">
                  {formatInvoiceAmount(line.unitPriceOre, invoice.currency)}
                </Td>
                <Td className="text-right font-medium tabular-nums">
                  {formatInvoiceAmount(lineNetOre(line), invoice.currency)}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
