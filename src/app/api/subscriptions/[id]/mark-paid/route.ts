import { NextResponse } from "next/server";
import { markSubscriptionPaid } from "@/modules/subscriptions/server/repository";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const subscription = await markSubscriptionPaid(id);
  return NextResponse.json({ subscription });
}
