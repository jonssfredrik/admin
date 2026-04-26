"use client";

import { RotateCcw, Save, Settings2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/components/toast/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { defaultSettings } from "@/modules/wp-orchestrator/data";
import { useWpOrchestratorWorkspace } from "@/modules/wp-orchestrator/lib/useWpOrchestratorWorkspace";
import type { WpOrchestratorSettings } from "@/modules/wp-orchestrator/types";

export function SettingsPage() {
  const { workspace, update } = useWpOrchestratorWorkspace();
  const toast = useToast();
  const settings = workspace.settings;

  function patch<K extends keyof WpOrchestratorSettings>(key: K, value: WpOrchestratorSettings[K]) {
    update((current) => ({
      ...current,
      settings: {
        ...current.settings,
        [key]: value,
      },
    }));
  }

  function resetSettings() {
    update((current) => ({ ...current, settings: { ...defaultSettings } }));
    toast.info("Demo-inställningar återställda");
  }

  function saveSettings() {
    update((current) => ({ ...current, settings: { ...current.settings } }));
    toast.success("Inställningar sparade", "Sparas endast i localStorage för frontend-demon.");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="WP Orchestrator inställningar"
          subtitle="Demo-inställningar för hur en framtida lokal WordPress-backend skulle kunna kopplas in."
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={resetSettings}>
            <RotateCcw size={14} className="mr-1.5" />
            Återställ
          </Button>
          <Button onClick={saveSettings}>
            <Save size={14} className="mr-1.5" />
            Spara
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Läge" value="Frontend-only" hint="Inga API-routes eller server actions." />
        <StatCard label="Backend-känsla" value="Mock runner" hint="WP-CLI och REST visas som actions." />
        <StatCard label="Persistens" value="localStorage" hint="Alla värden är lokala i webbläsaren." />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_0.75fr]">
        <Card className="p-0">
          <div className="border-b p-5">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <Settings2 size={16} />
              Lokal WordPress-profil
            </div>
            <p className="mt-1 text-sm text-muted">Dessa fält används bara för att göra demon realistisk.</p>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-2">
            <div>
              <Label>Lokal WP-url</Label>
              <Input value={settings.localUrl} onChange={(event) => patch("localUrl", event.target.value)} />
            </div>
            <div>
              <Label>WP-CLI arbetskatalog</Label>
              <Input value={settings.wpCliPath} onChange={(event) => patch("wpCliPath", event.target.value)} />
            </div>
            <div>
              <Label>Föredraget tema</Label>
              <select
                value={settings.preferredTheme}
                onChange={(event) => patch("preferredTheme", event.target.value)}
                className="h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
              >
                <option value="astra">Astra</option>
                <option value="twentytwentyfour">Twenty Twenty-Four</option>
                <option value="generatepress">GeneratePress</option>
              </select>
            </div>
            <div>
              <Label>Plugin-policy</Label>
              <select
                value={settings.pluginPolicy}
                onChange={(event) => patch("pluginPolicy", event.target.value as WpOrchestratorSettings["pluginPolicy"])}
                className="h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
              >
                <option value="minimal">Minimal</option>
                <option value="balanced">Balanserad</option>
                <option value="feature-rich">Feature-rich</option>
              </select>
            </div>
            <div>
              <Label>Bekräftelseläge</Label>
              <select
                value={settings.confirmationMode}
                onChange={(event) => patch("confirmationMode", event.target.value as WpOrchestratorSettings["confirmationMode"])}
                className="h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
              >
                <option value="all">Alla steg</option>
                <option value="risky">Riskfyllda steg</option>
                <option value="none">Ingen bekräftelse</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold tracking-tight">Demo-gräns</div>
          <div className="mt-3 space-y-3 text-sm text-muted">
            <p>Inställningarna kör inte WP-CLI, REST eller filsystemskommandon.</p>
            <p>De finns för att visa vilka parametrar en framtida backend behöver: lokal URL, arbetskatalog, tema, plugin-policy och bekräftelsenivå.</p>
            <p>Action-loggen är därför nära en backend-design, men implementationen är helt klientbaserad.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
