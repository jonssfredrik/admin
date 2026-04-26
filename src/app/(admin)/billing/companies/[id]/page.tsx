import { CompanyDetailPage } from "@/modules/billing/pages/CompanyDetailPage";

export default async function CompanyDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CompanyDetailPage id={id} />;
}
