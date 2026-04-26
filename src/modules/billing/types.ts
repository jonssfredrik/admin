export type InvoiceStatus = "draft" | "sent" | "paid";

export type VatRate = 0 | 0.06 | 0.12 | 0.25;

export interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unit?: string;
  unitPriceOre: number;
  articleNumber?: string;
}

export interface InvoiceParty {
  name: string;
  orgNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  contactPerson?: string;
}

export interface Invoice {
  id: string;
  companyId: string;
  customerId?: string;
  customer: InvoiceParty;
  status: InvoiceStatus;
  lines: InvoiceLine[];
  vatRate: VatRate;
  currency: "SEK";
  dueDate: string;
  issuedDate: string;
  paidDate?: string;
  paymentTermsDays?: number;
  notes?: string;
  theirReference?: string;
}

export interface Company {
  id: string;
  name: string;
  orgNumber?: string;
  vatNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  bank?: string;
  iban?: string;
  bankgiro?: string;
  logoDataUrl?: string;
  fSkatt?: boolean;
  isDefault?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  orgNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  contactPerson?: string;
}
