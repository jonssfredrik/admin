import { NextResponse } from "next/server";
import { duplicateSubscription } from "@/modules/subscriptions/server/repository";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const subscription = await duplicateSubscription(id);
  if (!subscription) {
    return NextResponse.json({ error: "Abonnemanget kunde inte hittas" }, { status: 404 });
  }
  return NextResponse.json({ subscription }, { status: 201 });
}
