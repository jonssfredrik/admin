import type { Invoice, InvoiceStatus } from "@/modules/billing/types";
import { todayIso } from "@/modules/billing/lib/dates";

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

export function isOverdue(invoice: Pick<Invoice, "status" | "dueDate">): boolean {
  return invoice.status === "sent" && invoice.dueDate < todayIso();
}

export function invoiceDisplayStatus(
  invoice: Pick<Invoice, "status" | "dueDate">,
): { label: string; tone: "neutral" | "warning" | "success" | "danger" } {
  if (isOverdue(invoice)) return { label: "Förfallen", tone: "danger" };
  return { label: invoiceStatusLabel[invoice.status], tone: invoiceStatusTone[invoice.status] };
}

export function invoiceDisplayNumber(invoice: Pick<Invoice, "id">): string {
  const match = invoice.id.match(/inv-\d+$/);
  return match ? match[0] : invoice.id;
}

export function formatInvoiceAmount(amountOre: number, currency: "SEK"): string {
  return (amountOre / 100).toLocaleString("sv-SE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
