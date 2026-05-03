import { NextResponse } from "next/server";
import { deleteInvoice, getInvoice, updateInvoice } from "@/modules/billing/server/repository";
import type { Invoice } from "@/modules/billing/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const invoice = await getInvoice(id);
  if (!invoice) {
    return NextResponse.json({ error: "Fakturan kunde inte hittas" }, { status: 404 });
  }
  return NextResponse.json({ invoice });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as Partial<Omit<Invoice, "id" | "companyId">>;
  const invoice = await updateInvoice(id, body);
  return NextResponse.json({ invoice });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deleteInvoice(id);
  return NextResponse.json({ ok: true });
}
