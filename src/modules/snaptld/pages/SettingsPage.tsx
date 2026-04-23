"use client";

import { useState } from "react";
import { Bell, DollarSign, Eye, EyeOff, Key, Save, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { useToast } from "@/components/toast/ToastProvider";
import { saveSettingsAction } from "@/modules/snaptld/actions";
import { useAsyncAction } from "@/modules/snaptld/lib/useAsyncAction";
import type { SnapTldSettings } from "@/modules/snaptld/types";

interface ApiKey {
  id: string;
  label: string;
  provider: string;
  placeholder: string;
  hint: string;
}

const apiKeys: ApiKey[] = [
  {
    id: "openai",
    label: "OpenAI / GPT",
    provider: "sk-...",
    placeholder: "sk-proj-***********************",
    hint: "Används för AI-utlåtanden och brand-analys",
  },
  {
    id: "moz",
    label: "Moz API",
    provider: "Access-ID / Secret",
    placeholder: "mozscape_id:mozscape_secret",
    hint: "Hämtar DA/PA, backlinks och spam score",
  },
  {
    id: "wayback",
    label: "Wayback Machine",
    provider: "Valfri",
    placeholder: "Ingen nyckel krävs — endast rate-limit-token",
    hint: "Snapshots och historik. Publik endpoint används annars",
  },
];

export function SettingsPage({ initialSettings }: { initialSettings: SnapTldSettings }) {
  const toast = useToast();
  const action = useAsyncAction();
  const [settings, setSettings] = useState(initialSettings);
  const [reveal, setReveal] = useState<Record<string, boolean>>({});

  const usageThisMonth = 87.4;
  const analysesThisMonth = 142;
  const tokensThisMonth = 1_240_000;

  const save = async (section: string) => {
    try {
      const updated = await action.run(() => saveSettingsAction(settings));
      setSettings(updated);
      toast.success("Sparat", `${section} uppdaterade`);
    } catch (error) {
      toast.error("Kunde inte spara", error instanceof Error ? error.message : section);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inställningar"
        subtitle="API-nycklar, kostnadstak och aviseringar för SnapTLD."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Kostnad denna månad" value={`$${usageThisMonth.toFixed(2)}`} hint={`Tak: $${settings.thresholds.costCap}`} />
        <StatCard label="Analyser denna månad" value={String(analysesThisMonth)} delta={23} hint="Mot 200/mån" />
        <StatCard label="AI-tokens" value={`${(tokensThisMonth / 1000).toFixed(0)}k`} delta={12} hint="Input + output" />
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Key size={14} className="text-muted" />
          <h2 className="text-sm font-semibold">API-nycklar</h2>
        </div>
        <p className="mt-1 text-xs text-muted">
          Nycklar lagras krypterat och används bara vid analys-körningar.
        </p>
        <div className="mt-4 space-y-4">
          {apiKeys.map((key) => {
            const shown = reveal[key.id];
            return (
              <div key={key.id} className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-3">
                <div>
                  <div className="text-sm font-medium">{key.label}</div>
                  <div className="text-[11px] text-muted">{key.provider}</div>
                </div>
                <div>
                  <div className="relative">
                    <Input
                      type={shown ? "text" : "password"}
                      value={settings.apiKeys[key.id] ?? ""}
                      onChange={(event) =>
                        setSettings((current) => ({
                          ...current,
                          apiKeys: { ...current.apiKeys, [key.id]: event.target.value },
                        }))
                      }
                      placeholder={key.placeholder}
                      className="pr-9 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setReveal({ ...reveal, [key.id]: !shown })}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-fg"
                      aria-label={shown ? "Dölj" : "Visa"}
                    >
                      {shown ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  <div className="mt-1 text-[11px] text-muted">{key.hint}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end">
          <Button className="gap-1.5" onClick={() => void save("Nycklar")} disabled={action.isPending}>
            <Save size={12} /> Spara
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-muted" />
            <h2 className="text-sm font-semibold">Kostnadstak</h2>
          </div>
          <p className="mt-1 text-xs text-muted">
            Analysen pausar automatiskt när taket nås.
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="cost-cap">Månadstak (USD)</Label>
              <Input
                id="cost-cap"
                type="number"
                value={settings.thresholds.costCap}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    thresholds: { ...current.thresholds, costCap: Number(event.target.value) || 0 },
                  }))
                }
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="gap-1.5" onClick={() => void save("Kostnadstak")} disabled={action.isPending}>
              <Save size={12} /> Spara
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-muted" />
            <h2 className="text-sm font-semibold">Aviseringar</h2>
          </div>
          <p className="mt-1 text-xs text-muted">
            Notifieras om domäner som matchar dina trösklar.
          </p>
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="score-alert">Minsta score</Label>
                <Input
                  id="score-alert"
                  type="number"
                  min={0}
                  max={100}
                  value={settings.thresholds.scoreAlert}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      thresholds: { ...current.thresholds, scoreAlert: Number(event.target.value) || 0 },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="expiry-alert">Utgångsvarning (dagar)</Label>
                <Input
                  id="expiry-alert"
                  type="number"
                  min={0}
                  value={settings.thresholds.expiryAlert}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      thresholds: { ...current.thresholds, expiryAlert: Number(event.target.value) || 0 },
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notify-email">E-post</Label>
              <Input
                id="notify-email"
                type="email"
                value={settings.notifyEmail}
                onChange={(event) => setSettings((current) => ({ ...current, notifyEmail: event.target.value }))}
                placeholder="du@exempel.se"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.pushEnabled}
                onChange={(event) => setSettings((current) => ({ ...current, pushEnabled: event.target.checked }))}
                className="h-3.5 w-3.5 accent-fg"
              />
              <Sparkles size={12} className="text-muted" />
              Push-notiser i panelen
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="gap-1.5" onClick={() => void save("Aviseringar")} disabled={action.isPending}>
              <Save size={12} /> Spara
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
