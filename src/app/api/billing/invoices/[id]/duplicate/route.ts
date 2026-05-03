import { NextResponse } from "next/server";
import { duplicateInvoice } from "@/modules/billing/server/repository";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const invoice = await duplicateInvoice(id);
  if (!invoice) {
    return NextResponse.json({ error: "Källfakturan kunde inte hittas" }, { status: 404 });
  }
  return NextResponse.json({ invoice }, { status: 201 });
}
