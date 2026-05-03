import { NextResponse } from "next/server";
import { deleteCompany, updateCompany } from "@/modules/billing/server/repository";
import type { Company } from "@/modules/billing/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as Partial<Omit<Company, "id">>;
  const company = await updateCompany(id, body);
  return NextResponse.json({ company });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deleteCompany(id);
  return NextResponse.json({ ok: true });
}
