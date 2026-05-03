"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  CreditCard,
  KeyRound,
  LockKeyhole,
  Mail,
  ReceiptText,
  RotateCcw,
  Save,
  Shield,
  User,
  Users,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input, Label } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";

const STORAGE_KEY = "adminhub.workspace.settings.v1";

export type SettingsSection = "profile" | "account" | "billing" | "notifications";

const sectionMeta: Record<SettingsSection, { label: string; eyebrow: string }> = {
  profile: { label: "Profil", eyebrow: "Identitet och arbetsyta" },
  account: { label: "Konto", eyebrow: "Säkerhet och åtkomst" },
  billing: { label: "Fakturering", eyebrow: "Plan, kort och fakturamail" },
  notifications: { label: "Notifieringar", eyebrow: "Kanaler och händelser" },
};

interface WorkspaceSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    title: string;
    workspaceName: string;
  };
  account: {
    twoFactorEnabled: boolean;
    sessionAlerts: boolean;
    trustedDeviceDays: number;
  };
  billing: {
    plan: "Starter" | "Pro" | "Business";
    autoRenew: boolean;
    invoiceEmail: string;
    vatNumber: string;
    paymentCard: string;
  };
  notifications: {
    newUsers: boolean;
    securityEvents: boolean;
    billingEvents: boolean;
    weeklyDigest: boolean;
    productUpdates: boolean;
    browserAlerts: boolean;
  };
}

function createDefaultSettings(): WorkspaceSettings {
  return {
    profile: {
      firstName: "Fredrik",
      lastName: "Jonsson",
      email: "fredrik@company.se",
      title: "Product Lead",
      workspaceName: "Admin Hub",
    },
    account: {
      twoFactorEnabled: true,
      sessionAlerts: true,
      trustedDeviceDays: 30,
    },
    billing: {
      plan: "Pro",
      autoRenew: true,
      invoiceEmail: "billing@company.se",
      vatNumber: "SE559001234501",
      paymentCard: "4242",
    },
    notifications: {
      newUsers: true,
      securityEvents: true,
      billingEvents: true,
      weeklyDigest: false,
      productUpdates: false,
      browserAlerts: true,
    },
  };
}

function readSettings(): WorkspaceSettings {
  if (typeof window === "undefined") return createDefaultSettings();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultSettings();

    const parsed = JSON.parse(raw) as Partial<WorkspaceSettings>;
    const fallback = createDefaultSettings();

    return {
      profile: { ...fallback.profile, ...parsed.profile },
      account: { ...fallback.account, ...parsed.account },
      billing: { ...fallback.billing, ...parsed.billing },
      notifications: { ...fallback.notifications, ...parsed.notifications },
    };
  } catch {
    return createDefaultSettings();
  }
}

export function SettingsTabs({ section = "profile" }: { section?: SettingsSection }) {
  const toast = useToast();
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState<WorkspaceSettings>(() => createDefaultSettings());
  const [draft, setDraft] = useState<WorkspaceSettings>(() => createDefaultSettings());
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });

  useEffect(() => {
    const next = readSettings();
    setSaved(next);
    setDraft(next);
    setHydrated(true);
  }, []);

  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [draft, saved]);
  const activeNotifications = useMemo(
    () => Object.values(draft.notifications).filter(Boolean).length,
    [draft.notifications],
  );

  const updateDraft = <K extends keyof WorkspaceSettings>(key: K, values: Partial<WorkspaceSettings[K]>) => {
    setDraft((current) => ({ ...current, [key]: { ...current[key], ...values } }));
  };

  const saveSettings = (sectionLabel?: string) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setSaved(draft);
    toast.success(sectionLabel ? `${sectionLabel} sparat` : "Inställningar sparade", "Ändringarna sparas lokalt i webbläsaren.");
  };

  const resetSettings = () => {
    const defaults = createDefaultSettings();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    setSaved(defaults);
    setDraft(defaults);
    setPassword({ current: "", next: "", confirm: "" });
    toast.info("Inställningar återställda", "Arbetsytan är tillbaka på standardvärden.");
  };

  const savePassword = () => {
    if (!password.current || !password.next || !password.confirm) {
      toast.info("Fyll i alla lösenordsfält");
      return;
    }

    if (password.next.length < 8) {
      toast.info("Lösenordet är för kort", "Använd minst 8 tecken.");
      return;
    }

    if (password.next !== password.confirm) {
      toast.info("Lösenorden matchar inte");
      return;
    }

    setPassword({ current: "", next: "", confirm: "" });
    toast.success("Lösenord uppdaterat", "Demoåtgärden är validerad i gränssnittet.");
  };

  const meta = sectionMeta[section];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Plan" value={draft.billing.plan} hint={draft.billing.autoRenew ? "Förnyas 15 maj 2026" : "Förnyelse pausad"} />
        <StatCard
          label="Säkerhet"
          value={draft.account.twoFactorEnabled ? "2FA aktiv" : "2FA av"}
          hint={draft.account.sessionAlerts ? "Inloggningsvarningar på" : "Inloggningsvarningar av"}
        />
        <StatCard
          label="Notifieringar"
          value={String(activeNotifications)}
          hint={`av ${Object.keys(draft.notifications).length} kanaler aktiva`}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted">{meta.eyebrow}</div>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">{meta.label}</h2>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted">
            {dirty ? <RotateCcw size={13} /> : <Check size={13} />}
            {dirty ? "Osparade ändringar" : hydrated ? "Allt är sparat" : "Läser in"}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={!dirty} onClick={() => setDraft(saved)}>
            Ångra
          </Button>
          <Button variant="secondary" className="gap-1.5" onClick={() => setResetOpen(true)}>
            <RotateCcw size={13} />
            Återställ
          </Button>
          <Button className="gap-1.5" disabled={!dirty} onClick={() => saveSettings()}>
            <Save size={12} />
            Spara
          </Button>
        </div>
      </div>

      {section === "profile" && <ProfilePanel settings={draft} update={updateDraft} save={() => saveSettings("Profil")} />}
      {section === "account" && (
        <AccountPanel
          settings={draft}
          update={updateDraft}
          password={password}
          setPassword={setPassword}
          savePassword={savePassword}
          save={() => saveSettings("Konto")}
          openDelete={() => setDeleteOpen(true)}
        />
      )}
      {section === "billing" && <BillingPanel settings={draft} update={updateDraft} save={() => saveSettings("Fakturering")} />}
      {section === "notifications" && (
        <NotificationsPanel settings={draft} update={updateDraft} save={() => saveSettings("Notifieringar")} />
      )}

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => toast.success("Konto markerat för radering", "Demoåtgärden påverkar ingen riktig data.")}
        title="Radera ditt konto?"
        description="All profil- och arbetsytedata skulle tas bort permanent i en skarp miljö."
        confirmLabel="Radera konto"
        tone="danger"
      />

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={resetSettings}
        title="Återställ inställningar?"
        description="Lokalt sparade profil-, konto-, fakturerings- och notifieringsvärden ersätts med standardvärden."
        confirmLabel="Återställ"
      />
    </div>
  );
}

function Section({
  title,
  description,
  icon: Icon,
  children,
  footer,
}: {
  title: string;
  description: string;
  icon: typeof User;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fg/5">
          <Icon size={16} className="text-muted" />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          <p className="mt-1 text-xs text-muted">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
      {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
    </Card>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function ProfilePanel({
  settings,
  update,
  save,
}: {
  settings: WorkspaceSettings;
  update: <K extends keyof WorkspaceSettings>(section: K, values: Partial<WorkspaceSettings[K]>) => void;
  save: () => void;
}) {
  const fullName = `${settings.profile.firstName} ${settings.profile.lastName}`.trim();

  return (
    <Section
      title="Profil och arbetsyta"
      description="Uppgifter som visas i Admin Hub och används i interna arbetsflöden."
      icon={User}
      footer={
        <Button className="gap-1.5" onClick={save}>
          <Save size={12} />
          Spara profil
        </Button>
      }
    >
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-fg/10 text-base font-semibold">
          {fullName
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div className="min-w-0">
          <div className="font-medium">{fullName}</div>
          <div className="text-sm text-muted">{settings.profile.email}</div>
        </div>
      </div>

      <FieldGrid>
        <div>
          <Label htmlFor="settings-first-name">Förnamn</Label>
          <Input id="settings-first-name" value={settings.profile.firstName} onChange={(event) => update("profile", { firstName: event.target.value })} />
        </div>
        <div>
          <Label htmlFor="settings-last-name">Efternamn</Label>
          <Input id="settings-last-name" value={settings.profile.lastName} onChange={(event) => update("profile", { lastName: event.target.value })} />
        </div>
        <div>
          <Label htmlFor="settings-email">E-post</Label>
          <Input id="settings-email" type="email" value={settings.profile.email} onChange={(event) => update("profile", { email: event.target.value })} />
        </div>
        <div>
          <Label htmlFor="settings-title">Titel</Label>
          <Input id="settings-title" value={settings.profile.title} onChange={(event) => update("profile", { title: event.target.value })} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="settings-workspace">Arbetsytans namn</Label>
          <Input id="settings-workspace" value={settings.profile.workspaceName} onChange={(event) => update("profile", { workspaceName: event.target.value })} />
        </div>
      </FieldGrid>
    </Section>
  );
}

function AccountPanel({
  settings,
  update,
  password,
  setPassword,
  savePassword,
  save,
  openDelete,
}: {
  settings: WorkspaceSettings;
  update: <K extends keyof WorkspaceSettings>(section: K, values: Partial<WorkspaceSettings[K]>) => void;
  password: { current: string; next: string; confirm: string };
  setPassword: React.Dispatch<React.SetStateAction<{ current: string; next: string; confirm: string }>>;
  savePassword: () => void;
  save: () => void;
  openDelete: () => void;
}) {
  return (
    <div className="space-y-4">
      <Section
        title="Säkerhetsnivå"
        description="Kontroller för inloggning, sessionsvarningar och betrodda enheter."
        icon={LockKeyhole}
        footer={
          <Button className="gap-1.5" onClick={save}>
            <Save size={12} />
            Spara konto
          </Button>
        }
      >
        <div className="divide-y">
          <ToggleRow
            label="Tvåfaktorsautentisering"
            description="Kräv en engångskod från authenticator-app vid inloggning."
            checked={settings.account.twoFactorEnabled}
            onChange={(checked) => update("account", { twoFactorEnabled: checked })}
            icon={Shield}
          />
          <ToggleRow
            label="Varningar vid ny inloggning"
            description="Skicka notifiering när kontot används från en ny enhet."
            checked={settings.account.sessionAlerts}
            onChange={(checked) => update("account", { sessionAlerts: checked })}
            icon={Bell}
          />
        </div>
        <div className="mt-4 max-w-xs">
          <Label htmlFor="settings-trusted-days">Betrodda enheter gäller</Label>
          <select
            id="settings-trusted-days"
            value={settings.account.trustedDeviceDays}
            onChange={(event) => update("account", { trustedDeviceDays: Number(event.target.value) })}
            className="h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
          >
            <option value={7}>7 dagar</option>
            <option value={30}>30 dagar</option>
            <option value={90}>90 dagar</option>
          </select>
        </div>
      </Section>

      <Section title="Lösenord" description="Valideras i gränssnittet innan demoåtgärden bekräftas." icon={KeyRound} footer={<Button onClick={savePassword}>Uppdatera lösenord</Button>}>
        <FieldGrid>
          <div className="md:col-span-2">
            <Label htmlFor="settings-current-password">Nuvarande lösenord</Label>
            <Input id="settings-current-password" type="password" value={password.current} onChange={(event) => setPassword((current) => ({ ...current, current: event.target.value }))} />
          </div>
          <div>
            <Label htmlFor="settings-next-password">Nytt lösenord</Label>
            <Input id="settings-next-password" type="password" value={password.next} onChange={(event) => setPassword((current) => ({ ...current, next: event.target.value }))} />
          </div>
          <div>
            <Label htmlFor="settings-confirm-password">Bekräfta lösenord</Label>
            <Input id="settings-confirm-password" type="password" value={password.confirm} onChange={(event) => setPassword((current) => ({ ...current, confirm: event.target.value }))} />
          </div>
        </FieldGrid>
      </Section>

      <Card className="border-red-500/20 bg-red-500/[0.03]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-red-600 dark:text-red-400">Farlig zon</div>
            <div className="mt-1 text-xs text-muted">Radering är bara kopplad till en bekräftelsedialog i frontend-demon.</div>
          </div>
          <button
            type="button"
            onClick={openDelete}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/5 px-3.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
          >
            Radera konto
          </button>
        </div>
      </Card>
    </div>
  );
}

function BillingPanel({
  settings,
  update,
  save,
}: {
  settings: WorkspaceSettings;
  update: <K extends keyof WorkspaceSettings>(section: K, values: Partial<WorkspaceSettings[K]>) => void;
  save: () => void;
}) {
  return (
    <Section
      title="Prenumeration"
      description="Plan och förnyelse styr hur arbetsytan presenteras i Admin Hub."
      icon={ReceiptText}
      footer={
        <Button className="gap-1.5" onClick={save}>
          <Save size={12} />
          Spara fakturering
        </Button>
      }
    >
      <div className="mb-5 flex flex-col gap-3 rounded-xl border bg-bg/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{settings.billing.plan}</span>
            <Badge tone={settings.billing.autoRenew ? "success" : "warning"}>{settings.billing.autoRenew ? "Aktiv" : "Pausad"}</Badge>
          </div>
          <div className="mt-1 text-sm text-muted">499 kr/mån · nästa faktura 15 maj 2026</div>
        </div>
        <TogglePill label="Autoförnya" checked={settings.billing.autoRenew} onChange={(checked) => update("billing", { autoRenew: checked })} />
      </div>

      <FieldGrid>
        <div>
          <Label htmlFor="settings-plan">Plan</Label>
          <select
            id="settings-plan"
            value={settings.billing.plan}
            onChange={(event) => update("billing", { plan: event.target.value as WorkspaceSettings["billing"]["plan"] })}
            className="h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
          >
            <option value="Starter">Starter</option>
            <option value="Pro">Pro</option>
            <option value="Business">Business</option>
          </select>
        </div>
        <div>
          <Label htmlFor="settings-card">Kortnummer</Label>
          <Input id="settings-card" value={settings.billing.paymentCard} onChange={(event) => update("billing", { paymentCard: event.target.value })} />
        </div>
        <div>
          <Label htmlFor="settings-invoice-email">Fakturamail</Label>
          <Input id="settings-invoice-email" type="email" value={settings.billing.invoiceEmail} onChange={(event) => update("billing", { invoiceEmail: event.target.value })} />
        </div>
        <div>
          <Label htmlFor="settings-vat">VAT-nummer</Label>
          <Input id="settings-vat" value={settings.billing.vatNumber} onChange={(event) => update("billing", { vatNumber: event.target.value })} />
        </div>
      </FieldGrid>
    </Section>
  );
}

function NotificationsPanel({
  settings,
  update,
  save,
}: {
  settings: WorkspaceSettings;
  update: <K extends keyof WorkspaceSettings>(section: K, values: Partial<WorkspaceSettings[K]>) => void;
  save: () => void;
}) {
  return (
    <Section
      title="Notifieringsregler"
      description="Välj vilka händelser som ska visas i panelen eller skickas vidare."
      icon={Bell}
      footer={
        <Button className="gap-1.5" onClick={save}>
          <Save size={12} />
          Spara notifieringar
        </Button>
      }
    >
      <div className="divide-y">
        <ToggleRow label="Nya användare" description="Notifiera när en användare registreras, bjuds in eller får ny roll." checked={settings.notifications.newUsers} onChange={(checked) => update("notifications", { newUsers: checked })} icon={Users} />
        <ToggleRow label="Säkerhetshändelser" description="Misslyckade inloggningar, lösenordsbyten och ändrade åtkomster." checked={settings.notifications.securityEvents} onChange={(checked) => update("notifications", { securityEvents: checked })} icon={Shield} />
        <ToggleRow label="Fakturering" description="Kortproblem, förnyelser, skapade fakturor och betalningsstatus." checked={settings.notifications.billingEvents} onChange={(checked) => update("notifications", { billingEvents: checked })} icon={CreditCard} />
        <ToggleRow label="Veckosammanfattning" description="Skicka en komprimerad översikt över arbetsytans aktivitet via e-post." checked={settings.notifications.weeklyDigest} onChange={(checked) => update("notifications", { weeklyDigest: checked })} icon={Mail} />
        <ToggleRow label="Produktuppdateringar" description="Visa nyheter om moduler, funktioner och förbättringar i Admin Hub." checked={settings.notifications.productUpdates} onChange={(checked) => update("notifications", { productUpdates: checked })} icon={Check} />
        <ToggleRow label="Browsernotiser" description="Tillåt notifieringar från webbläsaren när Admin Hub är öppet." checked={settings.notifications.browserAlerts} onChange={(checked) => update("notifications", { browserAlerts: checked })} icon={Bell} />
      </div>
    </Section>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  icon: Icon,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: typeof User;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Icon size={14} className="text-muted" />
          {label}
        </div>
        <div className="mt-1 text-xs text-muted">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx("relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors", checked ? "bg-fg" : "bg-fg/15")}
      >
        <span className={clsx("pointer-events-none inline-block h-4 w-4 rounded-full bg-bg shadow transition-transform", checked ? "translate-x-4" : "translate-x-0")} />
      </button>
    </div>
  );
}

function TogglePill({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={clsx(
        "inline-flex h-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
        checked ? "bg-fg text-bg hover:opacity-90" : "bg-surface text-muted hover:bg-bg hover:text-fg",
      )}
    >
      {label}
    </button>
  );
}
