import { NextResponse } from "next/server";
import { createCustomer, listCustomers } from "@/modules/billing/server/repository";
import type { Customer } from "@/modules/billing/types";

export async function GET() {
  const items = await listCustomers();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Omit<Customer, "id">;
  if (!body?.name || !body.name.trim()) {
    return NextResponse.json({ error: "Kundnamn krävs" }, { status: 400 });
  }
  const customer = await createCustomer(body);
  return NextResponse.json({ customer }, { status: 201 });
}
