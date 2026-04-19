"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import clsx from "clsx";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AdminHubMark } from "@/components/brand/AdminHubMark";
import { useToast } from "@/components/toast/ToastProvider";

function scorePassword(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const strength = useMemo(() => scorePassword(form.password), [form.password]);
  const strengthLabel = ["Svagt", "Svagt", "Okej", "Starkt", "Mycket starkt"][strength];
  const strengthTone = ["bg-red-500", "bg-red-500", "bg-amber-500", "bg-emerald-500", "bg-emerald-500"][strength];

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) {
      toast.error("Acceptera villkoren", "Du måste godkänna villkoren för att skapa konto");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Konto skapat", "Välkommen! Vi har skickat en bekräftelse till din e-post");
    }, 900);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <AdminHubMark className="mx-auto mb-4 h-11 w-11" />
          <h1 className="text-[22px] font-semibold tracking-tight">Skapa konto</h1>
          <p className="mt-1 text-sm text-muted">Kom igång på under en minut</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border bg-surface p-6 shadow-soft">
          <div>
            <Label htmlFor="name">Namn</Label>
            <Input id="name" autoComplete="name" required value={form.name} onChange={set("name")} placeholder="För- och efternamn" />
          </div>
          <div>
            <Label htmlFor="email">E-post</Label>
            <Input id="email" type="email" autoComplete="email" required value={form.email} onChange={set("email")} placeholder="du@foretag.se" />
          </div>
          <div>
            <Label htmlFor="password">Lösenord</Label>
            <Input id="password" type="password" autoComplete="new-password" required value={form.password} onChange={set("password")} />
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={clsx(
                        "h-1 flex-1 rounded-full transition-colors",
                        i < strength ? strengthTone : "bg-fg/10",
                      )}
                    />
                  ))}
                </div>
                <div className="mt-1 text-[11px] text-muted">
                  Styrka: <span className="font-medium text-fg">{strengthLabel}</span>
                </div>
              </div>
            )}
          </div>

          <label className="mt-2 flex cursor-pointer items-start gap-2 pt-1">
            <span
              className={clsx(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                accepted ? "border-fg bg-fg text-bg" : "bg-surface",
              )}
              onClick={(e) => {
                e.preventDefault();
                setAccepted(!accepted);
              }}
            >
              {accepted && <Check size={11} strokeWidth={3} />}
            </span>
            <input type="checkbox" className="sr-only" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
            <span className="text-xs text-muted">
              Jag godkänner <a href="#" className="text-fg hover:underline">villkoren</a> och{" "}
              <a href="#" className="text-fg hover:underline">integritetspolicyn</a>
            </span>
          </label>

          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? "Skapar konto…" : "Skapa konto"}
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
          Har du redan ett konto?{" "}
          <Link href="/login" className="font-medium text-fg hover:underline">
            Logga in
          </Link>
        </p>
      </div>
    </div>
  );
}
