import { NextResponse } from "next/server";
import { createSubscription, listSubscriptions } from "@/modules/subscriptions/server/repository";
import type { Subscription } from "@/modules/subscriptions/data/core";

export async function GET() {
  const items = await listSubscriptions();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Omit<Subscription, "id">;
  if (!body?.name || !body.name.trim()) {
    return NextResponse.json({ error: "Namn kravs" }, { status: 400 });
  }
  if (!Number.isFinite(body.amountSEK) || body.amountSEK <= 0) {
    return NextResponse.json({ error: "Belopp kravs" }, { status: 400 });
  }
  if (!body.nextRenewal) {
    return NextResponse.json({ error: "Nasta fornyelse kravs" }, { status: 400 });
  }
  const subscription = await createSubscription(body);
  return NextResponse.json({ subscription }, { status: 201 });
}
