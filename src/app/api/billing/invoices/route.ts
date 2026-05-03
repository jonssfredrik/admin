import { NextResponse } from "next/server";
import { createInvoice, listInvoices } from "@/modules/billing/server/repository";
import type { Invoice } from "@/modules/billing/types";

export async function GET() {
  const items = await listInvoices();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Omit<Invoice, "id">;
  if (!body?.companyId) {
    return NextResponse.json({ error: "Avsändarbolag krävs" }, { status: 400 });
  }
  if (!body?.customer?.name || !body.customer.name.trim()) {
    return NextResponse.json({ error: "Kundnamn krävs" }, { status: 400 });
  }
  if (!body.lines || body.lines.length === 0) {
    return NextResponse.json({ error: "Minst en faktura­rad krävs" }, { status: 400 });
  }
  const invoice = await createInvoice(body);
  return NextResponse.json({ invoice }, { status: 201 });
}
