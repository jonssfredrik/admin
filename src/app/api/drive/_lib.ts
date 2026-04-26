import { NextResponse } from "next/server";
import { createDriveRepository } from "@/modules/drive/server/repository";

export function getDriveRepository() {
  return createDriveRepository();
}

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = "Drive-objekt hittades inte") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(error: unknown) {
  const message = error instanceof Error ? error.message : "Okänt Drive-fel";
  return NextResponse.json({ error: message }, { status: 500 });
}
