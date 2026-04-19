"use client";

import { useState } from "react";
import clsx from "clsx";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";

const installModes = [
  {
    id: "provision",
    title: "Ny WordPress-installation",
    description: "JetWP provisionerar databas, SSL, baseline-backup och agent automatiskt.",
  },
  {
    id: "pair",
    title: "Parkoppla befintlig installation",
    description: "Använd en pairing-token och anslut en redan existerande WordPress-sajt.",
  },
] as const;

const environments = [
  { id: "production", title: "Produktion", description: "Normal driftmiljö för publik trafik." },
  { id: "staging", title: "Testmiljö", description: "För test, verifiering och deploy-preview innan release." },
] as const;

const baselineProfiles = [
  {
    id: "standard",
    title: "Standard managed",
    description: "Säkerhetskopia, säkerhetsskanning, cache och incheckningar aktiveras.",
  },
  {
    id: "commerce",
    title: "WooCommerce",
    description: "Extra backupfrekvens, checkout-övervakning och seriella uppdateringar.",
  },
  {
    id: "content",
    title: "Innehållstung",
    description: "Media-optimering, CDN-cache och fokus på redaktörsflöden.",
  },
] as const;

type InstallMode = (typeof installModes)[number]["id"];
type Environment = (typeof environments)[number]["id"];
type BaselineProfile = (typeof baselineProfiles)[number]["id"];

export function AddSiteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [installMode, setInstallMode] = useState<InstallMode>("provision");
  const [environment, setEnvironment] = useState<Environment>("production");
  const [profile, setProfile] = useState<BaselineProfile>("standard");
  const [region, setRegion] = useState("Stockholm");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const reset = () => {
    setStep(1);
    setName("");
    setDomain("");
    setInstallMode("provision");
    setEnvironment("production");
    setProfile("standard");
    setRegion("Stockholm");
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const modeLabel = installModes.find((item) => item.id === installMode)?.title ?? installMode;
      const profileLabel = baselineProfiles.find((item) => item.id === profile)?.title ?? profile;
      toast.success("Sajt skapas", `${name} (${domain}) · ${modeLabel} · ${profileLabel} · ${region}`);
      close();
    }, 900);
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Lägg till sajt"
      description={
        step === 1 ? "Registrera grunddata för den sajt som ska in i JetWP." : "Välj hur sajten ska provisioneras och driftas."
      }
      size="xl"
      footer={
        step === 1 ? (
          <>
            <Button variant="secondary" onClick={close}>Avbryt</Button>
            <Button onClick={() => setStep(2)} disabled={!name || !domain}>Nästa</Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={() => setStep(1)}>Tillbaka</Button>
            <Button onClick={submit} disabled={loading}>{loading ? "Skapar..." : "Skapa sajt"}</Button>
          </>
        )
      }
    >
      <div className="mb-4 flex items-center gap-2">
        <StepDot active={step >= 1} done={step > 1} n={1} label="Sajt" />
        <div className="h-px flex-1 bg-border" />
        <StepDot active={step >= 2} done={false} n={2} label="Provisionering" />
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="site-name">Namn</Label>
            <Input id="site-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="T.ex. Min butik" autoFocus />
          </div>
          <div>
            <Label htmlFor="site-domain">Domän</Label>
            <Input id="site-domain" value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="minbutik.se" />
            <p className="mt-1.5 text-xs text-muted">
              Primärdomänen registreras direkt och kan kompletteras med alias eller redirects efter skapande.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Installationssätt</div>
            <div className="grid gap-2 md:grid-cols-2">
              {installModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setInstallMode(mode.id)}
                  className={clsx(
                    "h-full rounded-xl border bg-surface p-3.5 text-left transition-colors",
                    installMode === mode.id ? "border-fg/40 ring-2 ring-fg/5" : "hover:border-fg/20",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{mode.title}</span>
                    {installMode === mode.id && <span className="h-2 w-2 rounded-full bg-fg" />}
                  </div>
                  <div className="mt-1 text-sm text-muted">{mode.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Miljö</div>
              <div className="space-y-2">
                {environments.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEnvironment(item.id)}
                    className={clsx(
                      "w-full rounded-xl border bg-surface p-3 text-left transition-colors",
                      environment === item.id ? "border-fg/40 ring-2 ring-fg/5" : "hover:border-fg/20",
                    )}
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="mt-1 text-xs text-muted">{item.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Region</div>
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="w-full rounded-lg border bg-surface px-3 py-2 text-sm"
              >
                <option>Stockholm</option>
                <option>Göteborg</option>
                <option>Frankfurt</option>
              </select>

              <div className="mb-2 mt-4 text-xs font-medium uppercase tracking-wider text-muted">Baseline-profil</div>
              <div className="space-y-2">
                {baselineProfiles.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setProfile(item.id)}
                    className={clsx(
                      "w-full rounded-xl border bg-surface p-3 text-left transition-colors",
                      profile === item.id ? "border-fg/40 ring-2 ring-fg/5" : "hover:border-fg/20",
                    )}
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="mt-1 text-xs text-muted">{item.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-bg/40 p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted">Detta sker vid skapande</div>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              <li>DNS och SSL förbereds för {domain || "vald domän"}.</li>
              <li>Agent, incheckning och baseline-säkerhetskopia aktiveras.</li>
              <li>
                {environment === "staging"
                  ? "Sajten markeras som testmiljö och deploys blockeras mot publik trafik."
                  : "Sajten markeras som produktion och tas in i ordinarie övervakning."}
              </li>
              <li>
                {installMode === "pair"
                  ? "En pairing-token förväntas innan sajten blir aktiv i flottan."
                  : "JetWP provisionerar en ny WordPress-installation i vald region."}
              </li>
            </ul>
          </div>
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
