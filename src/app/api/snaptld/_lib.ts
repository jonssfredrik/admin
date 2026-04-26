import { NextResponse } from "next/server";
import { createLocalSnapTldRepository } from "@/modules/snaptld/server/repository";

export function getApiRepository() {
  return createLocalSnapTldRepository();
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = "Hittades inte") {
  return NextResponse.json({ error: message }, { status: 404 });
}
