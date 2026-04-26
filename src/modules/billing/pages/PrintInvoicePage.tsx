"use client";

import { useEffect, useMemo, useState } from "react";
import { Printer, X } from "lucide-react";
import { formatInvoiceAmount, invoiceDisplayNumber } from "@/modules/billing/lib/format";
import {
  formatVatRate,
  invoiceTotals,
  lineNetOre,
} from "@/modules/billing/lib/totals";
import { useCompanies } from "@/modules/billing/lib/useCompanies";
import { useInvoices } from "@/modules/billing/lib/useInvoices";

const labelCls = "text-[11px] font-semibold uppercase tracking-wider text-neutral-500";

export function PrintInvoicePage({ id }: { id: string }) {
  const { hydrated, items } = useInvoices();
  const { items: companies } = useCompanies();
  const [autoTriggered, setAutoTriggered] = useState(false);

  const invoice = useMemo(() => items.find((inv) => inv.id === id), [items, id]);
  const company = useMemo(
    () => (invoice ? companies.find((c) => c.id === invoice.companyId) : undefined),
    [companies, invoice],
  );
  const totals = useMemo(() => (invoice ? invoiceTotals(invoice) : undefined), [invoice]);

  useEffect(() => {
    if (autoTriggered) return;
    if (!hydrated || !invoice || !totals) return;
    setAutoTriggered(true);
    const timer = window.setTimeout(() => window.print(), 250);
    return () => window.clearTimeout(timer);
  }, [autoTriggered, hydrated, invoice, totals]);

  if (!hydrated) {
    return <div className="p-16 text-center text-sm text-neutral-500">Läser in faktura…</div>;
  }

  if (!invoice || !totals) {
    return (
      <div className="p-16 text-center">
        <div className="text-sm text-neutral-500">Fakturan kunde inte hittas.</div>
        <button
          onClick={() => window.close()}
          className="mt-4 inline-flex h-9 items-center rounded-lg border bg-white px-3 text-sm hover:bg-neutral-50"
        >
          Stäng
        </button>
      </div>
    );
  }

  const senderAddress = [
    company?.address,
    [company?.postalCode, company?.city].filter(Boolean).join(" "),
  ].filter((line) => line && String(line).trim() !== "");

  const customerAddress = [
    invoice.customer.address,
    [invoice.customer.postalCode, invoice.customer.city].filter(Boolean).join(" "),
  ].filter((line) => line && String(line).trim() !== "");

  const paymentSlot = company?.bankgiro
    ? { label: "Bankgiro", value: company.bankgiro }
    : company?.iban
      ? { label: "IBAN", value: company.iban }
      : null;

  return (
    <>
      <div className="print-hide sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-neutral-200 bg-white px-6 py-3 shadow-sm">
        <div className="text-sm">
          <span className="font-semibold text-neutral-900">Faktura {invoiceDisplayNumber(invoice)}</span>
          <span className="ml-2 text-neutral-500">— Spara som PDF via webbläsarens utskriftsdialog.</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-neutral-900 px-3 text-sm font-medium text-white hover:bg-neutral-800"
          >
            <Printer size={14} />
            Skriv ut / PDF
          </button>
          <button
            onClick={() => window.close()}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-white px-3 text-sm hover:bg-neutral-50"
          >
            <X size={14} />
            Stäng
          </button>
        </div>
      </div>

      <main className="mx-auto my-8 max-w-[210mm] bg-white px-12 py-12 text-[13px] leading-relaxed text-neutral-900 shadow-sm print:my-0 print:max-w-none print:px-0 print:py-0 print:shadow-none">
        <header className="flex items-start justify-between gap-8">
          <div>
            <div className="text-3xl font-semibold tracking-tight">FAKTURA</div>
            <div className={labelCls}>{invoiceDisplayNumber(invoice)}</div>
          </div>
          {company?.logoDataUrl ? (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={company.logoDataUrl}
                alt=""
                className="max-h-14 max-w-[180px] object-contain"
              />
            </div>
          ) : null}
        </header>

        <hr className="mt-10 border-neutral-200" />

        <section className="mt-8 grid grid-cols-2 gap-16">
          <div>
            <div className={labelCls}>Avsändare</div>
            <div className="mt-3 space-y-0.5">
              <div className="text-sm font-semibold">{company?.name ?? "—"}</div>
              {company?.orgNumber && (
                <div className="text-xs text-neutral-600">{company.orgNumber}</div>
              )}
              {senderAddress.map((line, i) => (
                <div key={i} className="text-xs text-neutral-600">{line}</div>
              ))}
              {company?.email && <div className="text-xs text-neutral-600">{company.email}</div>}
            </div>
          </div>

          <div>
            <div className={labelCls}>Faktureras till</div>
            <div className="mt-3 space-y-0.5">
              <div className="text-sm font-semibold">{invoice.customer.name}</div>
              {invoice.customer.orgNumber && (
                <div className="text-xs text-neutral-600">{invoice.customer.orgNumber}</div>
              )}
              {customerAddress.map((line, i) => (
                <div key={i} className="text-xs text-neutral-600">{line}</div>
              ))}
              {invoice.customer.contactPerson && (
                <div className="text-xs text-neutral-600">Ref: {invoice.customer.contactPerson}</div>
              )}
            </div>
          </div>
        </section>

        <hr className="mt-8 border-neutral-200" />

        <section
          className="mt-4 grid gap-x-8 gap-y-5"
          style={{ gridTemplateColumns: paymentSlot ? "repeat(4, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))" }}
        >
          <div className="text-center">
            <div className={labelCls}>Utfärdad</div>
            <div className="mt-1 text-sm font-semibold">{invoice.issuedDate}</div>
          </div>
          <div className="text-center">
            <div className={labelCls}>Förfaller</div>
            <div className="mt-1 text-sm font-semibold">{invoice.dueDate}</div>
          </div>
          <div className="text-center">
            <div className={labelCls}>Totalt</div>
            <div className="mt-1 text-sm font-semibold tabular-nums">
              {formatInvoiceAmount(totals.totalOre, invoice.currency)}
            </div>
          </div>
          {paymentSlot && (
            <div className="text-center">
              <div className={labelCls}>{paymentSlot.label}</div>
              <div className="mt-1 text-sm font-semibold">{paymentSlot.value}</div>
            </div>
          )}
        </section>

        <hr className="mt-4 border-neutral-200" />

        <section className="mt-6">
          <div className={labelCls}>Fakturarader</div>
          <table className="mt-4 w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-neutral-500">
                <th className="pb-3 pr-3 font-medium">Beskrivning</th>
                <th className="w-[55px] pb-3 px-2 text-right font-medium">Antal</th>
                <th className="w-[60px] pb-3 px-2 text-left font-medium">Enhet</th>
                <th className="w-[110px] pb-3 px-2 text-right font-medium">À-pris</th>
                <th className="w-[120px] pb-3 pl-2 text-right font-medium">Summa</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines.map((line) => (
                <tr key={line.id} className="border-t border-neutral-200 align-top">
                  <td className="py-3 pr-3">
                    <div className="font-medium text-neutral-900">{line.description}</div>
                    {line.articleNumber && (
                      <div className="mt-0.5 font-mono text-[10px] text-neutral-500">{line.articleNumber}</div>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums">{line.quantity}</td>
                  <td className="py-3 px-2 text-neutral-600">{line.unit ?? ""}</td>
                  <td className="py-3 px-2 text-right tabular-nums">
                    {formatInvoiceAmount(line.unitPriceOre, invoice.currency)}
                  </td>
                  <td className="py-3 pl-2 text-right font-medium tabular-nums">
                    {formatInvoiceAmount(lineNetOre(line), invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-6 flex justify-end">
          <dl className="w-72 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Nettosumma</dt>
              <dd className="tabular-nums">{formatInvoiceAmount(totals.netOre, invoice.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Moms {formatVatRate(totals.vatRate)}</dt>
              <dd className="tabular-nums">{formatInvoiceAmount(totals.vatOre, invoice.currency)}</dd>
            </div>
            <div className="flex justify-between border-t border-neutral-300 pt-2 text-base font-semibold">
              <dt>Totalt</dt>
              <dd className="tabular-nums">{formatInvoiceAmount(totals.totalOre, invoice.currency)}</dd>
            </div>
          </dl>
        </section>

        <hr className="mt-10 border-neutral-200" />

        <section className="mt-6 grid grid-cols-2 gap-12">
          <div>
            <div className={labelCls}>Företag & Betalningsinformation</div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="font-semibold text-sm">{company?.name ?? "—"}</div>
              {company?.orgNumber && (
                <div>
                  <span className="text-neutral-500">Org.nr: </span>
                  <span className="text-neutral-900">{company.orgNumber}</span>
                </div>
              )}
              {company?.vatNumber && (
                <div>
                  <span className="text-neutral-500">Moms.nr: </span>
                  <span className="text-neutral-900">{company.vatNumber}</span>
                </div>
              )}
              {invoice.theirReference && (
                <div>
                  <span className="text-neutral-500">Er referens: </span>
                  <span className="text-neutral-900">{invoice.theirReference}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className={`${labelCls} invisible select-none`} aria-hidden="true">·</div>
            <div className="mt-3 space-y-1 text-xs">
              {company?.bank && (
                <div>
                  <span className="text-neutral-500">Bank: </span>
                  <span className="text-neutral-900">{company.bank}</span>
                </div>
              )}
              {company?.bankgiro && (
                <div>
                  <span className="text-neutral-500">Bankgiro: </span>
                  <span className="text-neutral-900">{company.bankgiro}</span>
                </div>
              )}
              {company?.iban && (
                <div>
                  <span className="text-neutral-500">IBAN: </span>
                  <span className="font-mono text-xs text-neutral-900">{company.iban}</span>
                </div>
              )}
              <div>
                <span className="text-neutral-500">OCR / referens: </span>
                <span className="text-neutral-900">{invoiceDisplayNumber(invoice)}</span>
              </div>
              {invoice.paidDate && (
                <div>
                  <span className="text-neutral-500">Betald: </span>
                  <span className="text-neutral-900">{invoice.paidDate}</span>
                </div>
              )}
              {company?.fSkatt && (
                <div className="text-xs text-emerald-700">Innehar F-skattsedel</div>
              )}
            </div>
          </div>
        </section>

        {/* <footer className="mt-12 text-center text-[11px] text-neutral-400">
          Faktura {invoice.id} · {company?.name ?? ""}
        </footer> */}

        <footer className="mt-12 text-center text-[11px] text-neutral-400">
          Fakturan skall betalas senast {invoice.dueDate}.<br></br>Vid utebliven betalning debiteras en påminnelseavift om 50 SEK. Årlig ränta på 28% tillkommer.
        </footer>
      </main>
    </>
  );
}
