"use client";

import { useState } from "react";
import { Bell, CreditCard, Shield, User } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/toast/ToastProvider";

const tabs = [
  { id: "profile", label: "Profil", icon: User },
  { id: "account", label: "Konto", icon: Shield },
  { id: "billing", label: "Fakturering", icon: CreditCard },
  { id: "notifications", label: "Notifikationer", icon: Bell },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function SettingsTabs() {
  const [tab, setTab] = useState<TabId>("profile");

  return (
    <div className="grid grid-cols-[200px_1fr] gap-8">
      <nav className="flex flex-col gap-0.5">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={clsx(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
              tab === id ? "bg-surface font-medium text-fg shadow-soft" : "text-muted hover:bg-surface/60 hover:text-fg",
            )}
          >
            <Icon size={15} strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </nav>

      <div>
        {tab === "profile" && <ProfilePanel />}
        {tab === "account" && <AccountPanel />}
        {tab === "billing" && <BillingPanel />}
        {tab === "notifications" && <NotificationsPanel />}
      </div>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {desc && <p className="mt-0.5 text-sm text-muted">{desc}</p>}
      </div>
      {children}
    </Card>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

function ProfilePanel() {
  const toast = useToast();
  return (
    <div className="space-y-5">
      <Section title="Profil" desc="Hur andra ser dig i systemet">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-fg/10 text-base font-semibold">F</div>
          <div className="flex gap-2">
            <Button variant="secondary">Ladda upp</Button>
            <Button variant="ghost">Ta bort</Button>
          </div>
        </div>
        <div className="space-y-4">
          <Row>
            <div>
              <Label htmlFor="fname">Förnamn</Label>
              <Input id="fname" defaultValue="Fredrik" />
            </div>
            <div>
              <Label htmlFor="lname">Efternamn</Label>
              <Input id="lname" defaultValue="Jonsson" />
            </div>
          </Row>
          <div>
            <Label htmlFor="email">E-post</Label>
            <Input id="email" type="email" defaultValue="fredrik@company.se" />
          </div>
          <div>
            <Label htmlFor="role">Titel</Label>
            <Input id="role" defaultValue="Product Lead" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary">Avbryt</Button>
          <Button onClick={() => toast.success("Profil sparad", "Dina ändringar är uppdaterade")}>Spara ändringar</Button>
        </div>
      </Section>
    </div>
  );
}

function AccountPanel() {
  const toast = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <div className="space-y-5">
      <Section title="Lösenord" desc="Uppdatera ditt lösenord regelbundet">
        <div className="space-y-4">
          <div>
            <Label htmlFor="current">Nuvarande lösenord</Label>
            <Input id="current" type="password" />
          </div>
          <Row>
            <div>
              <Label htmlFor="new">Nytt lösenord</Label>
              <Input id="new" type="password" />
            </div>
            <div>
              <Label htmlFor="confirm">Bekräfta</Label>
              <Input id="confirm" type="password" />
            </div>
          </Row>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => toast.success("Lösenord uppdaterat")}>Uppdatera lösenord</Button>
        </div>
      </Section>

      <Section title="Tvåfaktorsautentisering" desc="Extra skydd för ditt konto">
        <Toggle label="Aktivera 2FA via authenticator-app" defaultChecked />
        <Toggle label="SMS-backup" />
      </Section>

      <Card className="border-red-500/20 bg-red-500/[0.02] p-6">
        <h2 className="text-base font-semibold tracking-tight text-red-600 dark:text-red-400">Farlig zon</h2>
        <p className="mt-0.5 text-sm text-muted">Permanent radering av ditt konto och all associerad data.</p>
        <div className="mt-4">
          <button
            onClick={() => setDeleteOpen(true)}
            className="inline-flex h-9 items-center rounded-lg border border-red-500/30 bg-red-500/5 px-3.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
          >
            Radera konto
          </button>
        </div>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => toast.success("Konto raderat", "Du loggas nu ut")}
        title="Radera ditt konto?"
        description="Allt innehåll, inställningar och historik försvinner permanent."
        confirmLabel="Ja, radera mitt konto"
        tone="danger"
      />
    </div>
  );
}

function BillingPanel() {
  return (
    <div className="space-y-5">
      <Section title="Plan" desc="Din nuvarande prenumeration">
        <div className="flex items-center justify-between rounded-lg border bg-bg p-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Pro</span>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                AKTIV
              </span>
            </div>
            <div className="mt-0.5 text-sm text-muted">499 kr/mån · förnyas 15 maj 2026</div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Byt plan</Button>
            <Button variant="ghost">Avsluta</Button>
          </div>
        </div>
      </Section>

      <Section title="Betalmetod" desc="Kort som används för fakturering">
        <div className="flex items-center gap-3 rounded-lg border bg-bg p-4">
          <div className="flex h-8 w-12 items-center justify-center rounded-md bg-fg text-[10px] font-bold text-bg">VISA</div>
          <div className="flex-1">
            <div className="text-sm font-medium">•••• 4242</div>
            <div className="text-xs text-muted">Går ut 08/2028</div>
          </div>
          <Button variant="secondary">Ändra</Button>
        </div>
      </Section>
    </div>
  );
}

function NotificationsPanel() {
  return (
    <Section title="Notifikationer" desc="Välj hur du vill bli notifierad">
      <div className="divide-y divide-border/60">
        <Toggle label="Ny användare registreras" defaultChecked />
        <Toggle label="Misslyckade inloggningsförsök" defaultChecked />
        <Toggle label="Supportärenden" defaultChecked />
        <Toggle label="Betalningar och fakturor" defaultChecked />
        <Toggle label="Veckosammanfattning via e-post" />
        <Toggle label="Produktuppdateringar" />
      </div>
    </Section>
  );
}

function Toggle({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="flex cursor-pointer items-center justify-between py-3 first:pt-0 last:pb-0">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        className={clsx("relative h-[22px] w-[38px] rounded-full transition-colors", on ? "bg-fg" : "bg-fg/15")}
      >
        <span
          className={clsx(
            "absolute top-0.5 h-[18px] w-[18px] rounded-full bg-surface shadow-soft transition-transform",
            on ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </button>
    </label>
  );
}
