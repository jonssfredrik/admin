export interface InvoiceDraft {
  id: string;
  company: string;
  customer: string;
  status: "draft" | "sent" | "paid";
  amount: string;
  dueDate: string;
  category: "consulting" | "hosting" | "subscription";
}

export const invoiceDrafts: InvoiceDraft[] = [
  {
    id: "inv-2026-041",
    company: "Nordic Ops AB",
    customer: "Arctic Outdoor Co.",
    status: "draft",
    amount: "18 500 kr",
    dueDate: "2026-04-30",
    category: "hosting",
  },
  {
    id: "inv-2026-038",
    company: "Studio Fredrik",
    customer: "Lagom Interiör",
    status: "sent",
    amount: "7 200 kr",
    dueDate: "2026-04-24",
    category: "consulting",
  },
  {
    id: "inv-2026-031",
    company: "Nordic Ops AB",
    customer: "SaaS Atlas",
    status: "paid",
    amount: "3 400 kr",
    dueDate: "2026-04-12",
    category: "subscription",
  },
];
