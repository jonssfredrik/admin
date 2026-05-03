import { redirect } from "next/navigation";
import DetailPage from "@/modules/subscriptions/pages/DetailPage";

export default async function SubscriptionDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  if (resolved.id === "calendar") redirect("/calendar");
  return <DetailPage params={Promise.resolve(resolved)} />;
}
