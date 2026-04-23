import type { InvoiceCategory, InvoiceStatus } from "@/modules/billing/types";

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  draft: "Utkast",
  sent: "Skickad",
  paid: "Betald",
};

export const invoiceStatusTone: Record<InvoiceStatus, "neutral" | "warning" | "success"> = {
  draft: "neutral",
  sent: "warning",
  paid: "success",
};

export const invoiceCategoryLabel: Record<InvoiceCategory, string> = {
  consulting: "Konsulting",
  hosting: "Hosting",
  subscription: "Abonnemang",
};

export function formatInvoiceAmount(amountOre: number, currency: "SEK"): string {
  return (amountOre / 100).toLocaleString("sv-SE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
