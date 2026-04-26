import type { Invoice, InvoiceLine, VatRate } from "@/modules/billing/types";

export const VAT_RATES: VatRate[] = [0.25, 0.12, 0.06, 0];

export function lineNetOre(line: InvoiceLine): number {
  return Math.round(line.quantity * line.unitPriceOre);
}

export interface InvoiceTotals {
  netOre: number;
  vatOre: number;
  totalOre: number;
  vatRate: VatRate;
}

export function invoiceTotals(invoice: Pick<Invoice, "lines" | "vatRate">): InvoiceTotals {
  const netOre = invoice.lines.reduce((sum, line) => sum + lineNetOre(line), 0);
  const vatOre = Math.round(netOre * invoice.vatRate);
  return {
    netOre,
    vatOre,
    totalOre: netOre + vatOre,
    vatRate: invoice.vatRate,
  };
}

export function formatVatRate(rate: VatRate): string {
  return `${Math.round(rate * 100)}%`;
}
