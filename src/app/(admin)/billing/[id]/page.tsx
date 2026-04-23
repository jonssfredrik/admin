import { InvoiceDetailPage } from "@/modules/billing/pages/InvoiceDetailPage";

export default async function BillingDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InvoiceDetailPage id={id} />;
}
