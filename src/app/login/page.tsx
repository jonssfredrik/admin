"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AdminHubMark } from "@/components/brand/AdminHubMark";
import { useToast } from "@/components/toast/ToastProvider";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.error("Inloggning misslyckades", "Kontrollera dina uppgifter och försök igen");
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <AdminHubMark className="mx-auto mb-4 h-11 w-11" />
          <h1 className="text-[22px] font-semibold tracking-tight">Välkommen tillbaka</h1>
          <p className="mt-1 text-sm text-muted">Logga in på ditt konto</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border bg-surface p-6 shadow-soft">
          <div>
            <Label htmlFor="email">E-post</Label>
            <Input id="email" type="email" placeholder="du@foretag.se" autoComplete="email" required />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label htmlFor="password">Lösenord</Label>
              <Link href="/forgot-password" className="text-xs text-muted hover:text-fg">
                Glömt?
              </Link>
            </div>
            <Input id="password" type="password" autoComplete="current-password" required />
          </div>
          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? "Loggar in…" : "Logga in"}
            {!loading && <ArrowRight size={14} className="ml-1.5" strokeWidth={2} />}
          </Button>

          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface px-2 text-xs text-muted">eller</span>
            </div>
          </div>

          <Button type="button" variant="secondary" className="w-full">
            Fortsätt med Google
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Inget konto?{" "}
          <Link href="/register" className="font-medium text-fg hover:underline">
            Skapa konto
          </Link>
        </p>
      </div>
    </div>
  );
}
