import { NextResponse } from "next/server";
import { setDefaultCompany } from "@/modules/billing/server/repository";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await setDefaultCompany(id);
  return NextResponse.json({ ok: true });
}
