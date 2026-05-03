import { NextResponse } from "next/server";
import {
  deleteSubscription,
  getSubscription,
  updateSubscription,
} from "@/modules/subscriptions/server/repository";
import type { Subscription } from "@/modules/subscriptions/data/core";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const subscription = await getSubscription(id);
  if (!subscription) {
    return NextResponse.json({ error: "Abonnemanget kunde inte hittas" }, { status: 404 });
  }
  return NextResponse.json({ subscription });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as Partial<Omit<Subscription, "id">>;
  const subscription = await updateSubscription(id, body);
  return NextResponse.json({ subscription });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deleteSubscription(id);
  return NextResponse.json({ ok: true });
}
