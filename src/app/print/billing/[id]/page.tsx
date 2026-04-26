import { PrintInvoicePage } from "@/modules/billing/pages/PrintInvoicePage";

export default async function PrintInvoiceRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PrintInvoicePage id={id} />;
}
