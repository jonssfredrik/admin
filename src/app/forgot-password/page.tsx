"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AdminHubMark } from "@/components/brand/AdminHubMark";
import { useToast } from "@/components/toast/ToastProvider";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const toast = useToast();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success("Länk skickad", `Kontrollera ${email}`);
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <AdminHubMark className="mx-auto mb-4 h-11 w-11" />
          {sent ? (
            <>
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={20} strokeWidth={2} />
              </div>
              <h1 className="text-[22px] font-semibold tracking-tight">Kontrollera din inkorg</h1>
              <p className="mt-1 text-sm text-muted">
                Vi har skickat en återställningslänk till <span className="font-medium text-fg">{email}</span>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-[22px] font-semibold tracking-tight">Glömt lösenord?</h1>
              <p className="mt-1 text-sm text-muted">Vi skickar en återställningslänk till din e-post</p>
            </>
          )}
        </div>

        {!sent ? (
          <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border bg-surface p-6 shadow-soft">
            <div>
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                placeholder="du@foretag.se"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? "Skickar…" : "Skicka återställningslänk"}
              {!loading && <ArrowRight size={14} className="ml-1.5" strokeWidth={2} />}
            </Button>
          </form>
        ) : (
          <div className="space-y-3 rounded-2xl border bg-surface p-6 shadow-soft">
            <p className="text-sm text-muted">
              Kontrollera din skräppost om du inte ser mejlet inom några minuter.
            </p>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
            >
              Skicka igen
            </Button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
            <ArrowLeft size={14} />
            Tillbaka till inloggning
          </Link>
        </div>
      </div>
    </div>
  );
}
