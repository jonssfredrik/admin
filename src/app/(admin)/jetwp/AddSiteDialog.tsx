"use client";

import { useState } from "react";
import clsx from "clsx";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";

const plans = [
  { id: "Starter", price: "90 kr/mån", limits: "10 GB · 1 sajt" },
  { id: "Business", price: "290 kr/mån", limits: "20 GB · 5 sajter" },
  { id: "Scale", price: "799 kr/mån", limits: "50 GB · 15 sajter" },
  { id: "Enterprise", price: "från 1990 kr", limits: "100 GB · obegränsat" },
] as const;

type PlanId = (typeof plans)[number]["id"];

export function AddSiteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [plan, setPlan] = useState<PlanId>("Business");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const reset = () => {
    setStep(1);
    setName("");
    setDomain("");
    setPlan("Business");
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Sajt skapas", `${name} (${domain}) · provisionering tar 2–3 min`);
      close();
    }, 900);
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Lägg till sajt"
      description={step === 1 ? "Vi skapar en ny WordPress-installation åt dig" : "Välj plan"}
      size="lg"
      footer={
        step === 1 ? (
          <>
            <Button variant="secondary" onClick={close}>Avbryt</Button>
            <Button onClick={() => setStep(2)} disabled={!name || !domain}>Nästa</Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={() => setStep(1)}>Tillbaka</Button>
            <Button onClick={submit} disabled={loading}>
              {loading ? "Skapar…" : "Skapa sajt"}
            </Button>
          </>
        )
      }
    >
      <div className="mb-4 flex items-center gap-2">
        <StepDot active={step >= 1} done={step > 1} n={1} label="Sajt" />
        <div className="h-px flex-1 bg-border" />
        <StepDot active={step >= 2} done={false} n={2} label="Plan" />
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="site-name">Namn</Label>
            <Input id="site-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="T.ex. Min butik" autoFocus />
          </div>
          <div>
            <Label htmlFor="site-domain">Domän</Label>
            <Input id="site-domain" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="minbutik.se" />
            <p className="mt-1.5 text-xs text-muted">
              Vi konfigurerar DNS och SSL automatiskt efter att sajten provisionerats.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {plans.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlan(p.id)}
              className={clsx(
                "flex flex-col items-start gap-1 rounded-lg border bg-surface p-3.5 text-left transition-colors",
                plan === p.id ? "border-fg/40 ring-2 ring-fg/5" : "hover:border-fg/20",
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-medium">{p.id}</span>
                {plan === p.id && <span className="h-2 w-2 rounded-full bg-fg" />}
              </div>
              <span className="text-sm text-muted">{p.price}</span>
              <span className="text-xs text-muted">{p.limits}</span>
            </button>
          ))}
        </div>
      )}
    </Dialog>
  );
}

function StepDot({ active, done, n, label }: { active: boolean; done: boolean; n: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={clsx(
          "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
          done ? "bg-emerald-500 text-white" : active ? "bg-fg text-bg" : "bg-fg/10 text-muted",
        )}
      >
        {done ? "✓" : n}
      </span>
      <span className={clsx("text-xs font-medium", active ? "text-fg" : "text-muted")}>{label}</span>
    </div>
  );
}
