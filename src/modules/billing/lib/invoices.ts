import { invoices } from "@/modules/billing/data";
import type { Invoice } from "@/modules/billing/types";

export function listInvoices(): Invoice[] {
  return invoices;
}

export function getInvoiceById(id: string): Invoice | undefined {
  return invoices.find((invoice) => invoice.id === id);
}
