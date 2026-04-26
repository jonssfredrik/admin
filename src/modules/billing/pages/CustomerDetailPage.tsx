"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, Pencil, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge, Table, Td, Th } from "@/components/ui/Table";
import { formatInvoiceAmount, invoiceDisplayStatus } from "@/modules/billing/lib/format";
import { invoiceTotals } from "@/modules/billing/lib/totals";
import { useCustomers } from "@/modules/billing/lib/useCustomers";
import { useInvoices } from "@/modules/billing/lib/useInvoices";

export function CustomerDetailPage({ id }: { id: string }) {
  const { hydrated: customersHydrated, items: customers } = useCustomers();
  const { hydrated: invoicesHydrated, items: invoices } = useInvoices();
  const hydrated = customersHydrated && invoicesHydrated;

  const customer = useMemo(() => customers.find((c) => c.id === id), [customers, id]);
  const customerInvoices = useMemo(
    () => invoices.filter((inv) => inv.customerId === id).sort((a, b) => b.issuedDate.localeCompare(a.issuedDate)),
    [invoices, id],
  );

  const stats = useMemo(() => {
    const totalAll = customerInvoices.reduce((s, i) => s + invoiceTotals(i).totalOre, 0);
    const totalPaid = customerInvoices
      .filter((i) => i.status === "paid")
      .reduce((s, i) => s + invoiceTotals(i).totalOre, 0);
    const totalOutstanding = customerInvoices
      .filter((i) => i.status === "sent")
      .reduce((s, i) => s + invoiceTotals(i).totalOre, 0);
    return { totalAll, totalPaid, totalOutstanding, count: customerInvoices.length };
  }, [customerInvoices]);

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <div className="h-4 w-40 animate-pulse rounded bg-bg" />
        <div className="h-32 animate-pulse rounded-2xl bg-bg" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-4">
        <Link
          href="/billing/customers"
          className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft size={13} />
          Tillbaka till kunder
        </Link>
        <Card className="py-12 text-center text-sm text-muted">Kunden kunde inte hittas.</Card>
      </div>
    );
  }

  const addressLine = [customer.postalCode, customer.city].filter(Boolean).join(" ");

  return (
    <div className="space-y-6">
      <Link
        href="/billing/customers"
        className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft size={13} />
        Tillbaka till kunder
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title={customer.name}
          subtitle={customer.contactPerson ? `Kontaktperson: ${customer.contactPerson}` : undefined}
        />
        <div className="flex items-center gap-2">
          <Link
            href="/billing/customers"
            className="inline-flex h-9 items-center justify-center rounded-lg border bg-surface px-3.5 text-sm font-medium transition-colors hover:bg-bg"
          >
            <Pencil size={13} className="mr-1.5" />
            Redigera i listan
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="text-sm font-semibold tracking-tight">Kunduppgifter</div>
          <dl className="mt-3 space-y-2 text-sm">
            {customer.orgNumber && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Org.nr / pers.nr</dt>
                <dd className="font-mono text-xs">{customer.orgNumber}</dd>
              </div>
            )}
            {customer.email && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">E-post</dt>
                <dd className="text-xs">{customer.email}</dd>
              </div>
            )}
            {customer.phone && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Telefon</dt>
                <dd className="font-mono text-xs">{customer.phone}</dd>
              </div>
            )}
            {(customer.address || addressLine) && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Adress</dt>
                <dd className="text-right text-xs">
                  {customer.address && <div>{customer.address}</div>}
                  {addressLine && <div>{addressLine}</div>}
                </dd>
              </div>
            )}
          </dl>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Antal fakturor"
            value={String(stats.count)}
            hint="Knutna till kunden"
          />
          <StatCard
            label="Total fakturerat"
            value={formatInvoiceAmount(stats.totalAll, "SEK")}
            hint="Inkl. moms"
          />
          <StatCard
            label="Utestående"
            value={formatInvoiceAmount(stats.totalOutstanding, "SEK")}
            hint={`${formatInvoiceAmount(stats.totalPaid, "SEK")} betalt`}
          />
        </div>
      </div>

      <Card className="p-0">
        <div className="border-b px-5 py-3 text-sm font-semibold tracking-tight">Fakturor</div>
        {customerInvoices.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <Users size={24} className="text-muted" strokeWidth={1.5} />
            <div className="text-sm text-muted">Inga fakturor knutna till den här kunden ännu.</div>
          </div>
        ) : (
          <Table className="shadow-none">
            <thead>
              <tr>
                <Th>Faktura</Th>
                <Th>Utfärdad</Th>
                <Th>Förfaller</Th>
                <Th>Status</Th>
                <Th className="text-right">Belopp</Th>
              </tr>
            </thead>
            <tbody>
              {customerInvoices.map((invoice) => {
                const display = invoiceDisplayStatus(invoice);
                return (
                  <tr key={invoice.id} className="transition-colors hover:bg-bg/50">
                    <Td className="font-mono text-xs">
                      <Link href={`/billing/${invoice.id}`} className="hover:text-fg">
                        {invoice.id}
                      </Link>
                    </Td>
                    <Td className="font-mono text-xs text-muted">{invoice.issuedDate}</Td>
                    <Td className="font-mono text-xs text-muted">{invoice.dueDate}</Td>
                    <Td>
                      <Badge tone={display.tone}>{display.label}</Badge>
                    </Td>
                    <Td className="text-right font-medium tabular-nums">
                      {formatInvoiceAmount(invoiceTotals(invoice).totalOre, invoice.currency)}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
