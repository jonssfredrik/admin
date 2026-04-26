import { CustomerDetailPage } from "@/modules/billing/pages/CustomerDetailPage";

export default async function CustomerDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerDetailPage id={id} />;
}
