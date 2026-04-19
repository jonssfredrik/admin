"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { AdminHubMark } from "@/components/brand/AdminHubMark";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md text-center">
        <AdminHubMark className="mx-auto mb-6 h-12 w-12" />

        <div className="relative inline-block">
          <div className="select-none text-[140px] font-semibold leading-none tracking-tighter text-fg/5">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full border bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted shadow-soft">
              Sidan hittades inte
            </span>
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Här finns ingenting</h1>
        <p className="mt-2 text-sm text-muted">
          Sidan du letade efter har flyttats, tagits bort eller fanns aldrig.
        </p>

        <div className="mt-8 flex items-center justify-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center rounded-lg bg-fg px-3.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            <Home size={14} strokeWidth={2} className="mr-1.5" />
            Till dashboard
          </Link>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (typeof window !== "undefined") window.history.back();
            }}
            className="inline-flex h-9 items-center rounded-lg border bg-surface px-3.5 text-sm font-medium transition-colors hover:bg-bg"
          >
            <ArrowLeft size={14} strokeWidth={2} className="mr-1.5" />
            Tillbaka
          </Link>
        </div>

        <div className="mt-10 border-t pt-6 text-xs text-muted">
          Behöver du hjälp?{" "}
          <Link href="#" className="text-fg hover:underline">
            Kontakta support
          </Link>
        </div>
      </div>
    </div>
  );
}
