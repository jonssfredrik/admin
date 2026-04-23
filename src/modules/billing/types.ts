export type InvoiceStatus = "draft" | "sent" | "paid";
export type InvoiceCategory = "consulting" | "hosting" | "subscription";

export interface Invoice {
  id: string;
  companyId: string;
  companyName: string;
  customerId: string;
  customerName: string;
  status: InvoiceStatus;
  amountOre: number;
  currency: "SEK";
  dueDate: string;
  issuedDate: string;
  paidDate?: string;
  category: InvoiceCategory;
}
