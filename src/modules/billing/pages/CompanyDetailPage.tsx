"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, Building2, Pencil, Star } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge, Table, Td, Th } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { formatInvoiceAmount, invoiceDisplayStatus } from "@/modules/billing/lib/format";
import { invoiceTotals } from "@/modules/billing/lib/totals";
import { useCompanies } from "@/modules/billing/lib/useCompanies";
import { useInvoices } from "@/modules/billing/lib/useInvoices";

export function CompanyDetailPage({ id }: { id: string }) {
  const toast = useToast();
  const { hydrated: companiesHydrated, items: companies, setDefault } = useCompanies();
  const { hydrated: invoicesHydrated, items: invoices } = useInvoices();
  const hydrated = companiesHydrated && invoicesHydrated;

  const company = useMemo(() => companies.find((c) => c.id === id), [companies, id]);
  const companyInvoices = useMemo(
    () => invoices.filter((inv) => inv.companyId === id).sort((a, b) => b.issuedDate.localeCompare(a.issuedDate)),
    [invoices, id],
  );

  const stats = useMemo(() => {
    const totalAll = companyInvoices.reduce((s, i) => s + invoiceTotals(i).totalOre, 0);
    const totalPaid = companyInvoices
      .filter((i) => i.status === "paid")
      .reduce((s, i) => s + invoiceTotals(i).totalOre, 0);
    const totalOutstanding = companyInvoices
      .filter((i) => i.status === "sent")
      .reduce((s, i) => s + invoiceTotals(i).totalOre, 0);
    return { totalAll, totalPaid, totalOutstanding, count: companyInvoices.length };
  }, [companyInvoices]);

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <div className="h-4 w-40 animate-pulse rounded bg-bg" />
        <div className="h-32 animate-pulse rounded-2xl bg-bg" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-4">
        <Link
          href="/billing/companies"
          className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft size={13} />
          Tillbaka till företag
        </Link>
        <Card className="py-12 text-center text-sm text-muted">Företaget kunde inte hittas.</Card>
      </div>
    );
  }

  const addressLine = [company.postalCode, company.city].filter(Boolean).join(" ");

  return (
    <div className="space-y-6">
      <Link
        href="/billing/companies"
        className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft size={13} />
        Tillbaka till företag
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border bg-bg/40">
            {company.logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logoDataUrl} alt="" className="max-h-full max-w-full object-contain" />
            ) : (
              <Building2 size={20} className="text-muted" strokeWidth={1.5} />
            )}
          </div>
          <PageHeader
            title={company.name}
            subtitle={company.orgNumber ? `Org.nr ${company.orgNumber}` : undefined}
          />
        </div>
        <div className="flex items-center gap-2">
          {company.isDefault ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-fg/5 px-2 py-1 text-xs font-medium text-muted">
              <Star size={12} strokeWidth={2.25} />
              Standardföretag
            </span>
          ) : (
            <Button
              variant="secondary"
              onClick={() => {
                setDefault(company.id);
                toast.success("Standardföretag uppdaterat", company.name);
              }}
            >
              <Star size={13} className="mr-1.5" />
              Ange som standard
            </Button>
          )}
          <Link
            href="/billing/companies"
            className="inline-flex h-9 items-center justify-center rounded-lg border bg-surface px-3.5 text-sm font-medium transition-colors hover:bg-bg"
          >
            <Pencil size={13} className="mr-1.5" />
            Redigera i listan
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="text-sm font-semibold tracking-tight">Företagsuppgifter</div>
          <dl className="mt-3 space-y-2 text-sm">
            {company.vatNumber && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">VAT</dt>
                <dd className="font-mono text-xs">{company.vatNumber}</dd>
              </div>
            )}
            {company.email && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">E-post</dt>
                <dd className="text-xs">{company.email}</dd>
              </div>
            )}
            {company.phone && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Telefon</dt>
                <dd className="font-mono text-xs">{company.phone}</dd>
              </div>
            )}
            {(company.address || addressLine) && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Adress</dt>
                <dd className="text-right text-xs">
                  {company.address && <div>{company.address}</div>}
                  {addressLine && <div>{addressLine}</div>}
                </dd>
              </div>
            )}
            {company.bankgiro && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Bankgiro</dt>
                <dd className="font-mono text-xs">{company.bankgiro}</dd>
              </div>
            )}
            {company.iban && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">IBAN</dt>
                <dd className="font-mono text-xs">{company.iban}</dd>
              </div>
            )}
            <div className="flex justify-between gap-3">
              <dt className="text-muted">F-skattsedel</dt>
              <dd className={company.fSkatt ? "text-xs text-emerald-600 dark:text-emerald-400" : "text-xs text-muted"}>
                {company.fSkatt ? "Innehas" : "Saknas"}
              </dd>
            </div>
          </dl>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Antal fakturor"
            value={String(stats.count)}
            hint="Skickade från bolaget"
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
        {companyInvoices.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <Building2 size={24} className="text-muted" strokeWidth={1.5} />
            <div className="text-sm text-muted">Inga fakturor utfärdade från det här bolaget ännu.</div>
          </div>
        ) : (
          <Table className="shadow-none">
            <thead>
              <tr>
                <Th>Faktura</Th>
                <Th>Kund</Th>
                <Th>Utfärdad</Th>
                <Th>Status</Th>
                <Th className="text-right">Belopp</Th>
              </tr>
            </thead>
            <tbody>
              {companyInvoices.map((invoice) => {
                const display = invoiceDisplayStatus(invoice);
                return (
                  <tr key={invoice.id} className="transition-colors hover:bg-bg/50">
                    <Td className="font-mono text-xs">
                      <Link href={`/billing/${invoice.id}`} className="hover:text-fg">
                        {invoice.id}
                      </Link>
                    </Td>
                    <Td>{invoice.customer.name}</Td>
                    <Td className="font-mono text-xs text-muted">{invoice.issuedDate}</Td>
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
