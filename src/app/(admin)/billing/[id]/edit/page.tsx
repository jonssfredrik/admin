import { EditInvoicePage } from "@/modules/billing/pages/EditInvoicePage";

export default async function BillingEditRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditInvoicePage id={id} />;
}
