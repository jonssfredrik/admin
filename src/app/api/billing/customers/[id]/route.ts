import { NextResponse } from "next/server";
import { deleteCustomer, updateCustomer } from "@/modules/billing/server/repository";
import type { Customer } from "@/modules/billing/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as Partial<Omit<Customer, "id">>;
  const customer = await updateCustomer(id, body);
  return NextResponse.json({ customer });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deleteCustomer(id);
  return NextResponse.json({ ok: true });
}
