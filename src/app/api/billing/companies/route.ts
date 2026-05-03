import { NextResponse } from "next/server";
import { createCompany, listCompanies } from "@/modules/billing/server/repository";
import type { Company } from "@/modules/billing/types";

export async function GET() {
  const items = await listCompanies();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Omit<Company, "id">;
  if (!body?.name || !body.name.trim()) {
    return NextResponse.json({ error: "Företagsnamn krävs" }, { status: 400 });
  }
  const company = await createCompany(body);
  return NextResponse.json({ company }, { status: 201 });
}
