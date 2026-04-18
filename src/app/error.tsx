"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
          <AlertTriangle size={22} strokeWidth={2} />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">Något gick fel</h1>
        <p className="mt-2 text-sm text-muted">
          Ett oväntat fel uppstod. Försök igen, eller gå tillbaka till dashboarden.
        </p>

        {error.digest && (
          <div className="mx-auto mt-5 inline-block rounded-lg border bg-surface px-3 py-1.5 font-mono text-[11px] text-muted">
            Error ID: {error.digest}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={reset}
            className="inline-flex h-9 items-center rounded-lg bg-fg px-3.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            <RotateCw size={14} strokeWidth={2} className="mr-1.5" />
            Försök igen
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center rounded-lg border bg-surface px-3.5 text-sm font-medium transition-colors hover:bg-bg"
          >
            <Home size={14} strokeWidth={2} className="mr-1.5" />
            Till dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
