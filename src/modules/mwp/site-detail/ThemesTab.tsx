"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/toast/ToastProvider";
import { themes, type Theme } from "@/modules/mwp/[id]/data";

interface ThemesTabProps {
  activeTheme: string;
  themeVersion: string;
  themeUpdateAvailable: boolean;
}

export function ThemesTab({ activeTheme, themeVersion, themeUpdateAvailable }: ThemesTabProps) {
  const [list, setList] = useState<Theme[]>(() => themes(activeTheme, themeVersion, themeUpdateAvailable));
  const toast = useToast();
  const [toActivate, setToActivate] = useState<Theme | null>(null);

  const activate = (slug: string) => {
    setList((current) => current.map((theme) => ({ ...theme, active: theme.slug === slug })));
    const theme = list.find((entry) => entry.slug === slug);
    if (theme) toast.success("Tema aktiverat", theme.name);
  };

  const updateOne = (slug: string) => {
    setList((current) => current.map((theme) => theme.slug === slug ? { ...theme, version: theme.latestVersion, updateAvailable: false } : theme));
    toast.success("Tema uppdaterat");
  };

  const active = list.find((theme) => theme.active);

  return (
    <div className="space-y-6">
      {active && (
        <Card className="overflow-hidden p-0">
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
            <div className="h-24 w-40 shrink-0 rounded-lg border" style={{ background: active.screenshot }} />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Aktivt tema</div>
              <div className="mt-1 flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight">{active.name}</h2>
                <span className="font-mono text-xs text-muted">v{active.version}</span>
                {active.updateAvailable && <Badge tone="warning">→ {active.latestVersion}</Badge>}
              </div>
              <div className="mt-0.5 text-xs text-muted">Av {active.author}</div>
            </div>
            <div className="flex gap-2">
              {active.updateAvailable && (
                <Button variant="secondary" onClick={() => updateOne(active.slug)}>
                  <RefreshCw size={14} className="mr-1.5" />
                  Uppdatera
                </Button>
              )}
              <Button variant="secondary" onClick={() => toast.info("Öppnar anpassaren", active.name)}>
                Anpassa
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((theme) => (
          <Card key={theme.slug} className="overflow-hidden p-0">
            <div className="relative h-32 border-b" style={{ background: theme.screenshot }}>
              {theme.active && <span className="absolute left-2 top-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Aktiv</span>}
            </div>
            <div className="p-3.5">
              <div className="flex items-baseline justify-between gap-2">
                <div className="truncate font-medium">{theme.name}</div>
                <span className="shrink-0 font-mono text-[11px] text-muted">v{theme.version}</span>
              </div>
              <div className="mt-0.5 truncate text-xs text-muted">{theme.author}</div>
              <div className="mt-3 flex gap-1.5">
                {theme.active ? (
                  <button disabled className="inline-flex h-7 flex-1 items-center justify-center rounded-md border bg-bg text-xs font-medium text-muted">
                    Aktivt
                  </button>
                ) : (
                  <button onClick={() => setToActivate(theme)} className="inline-flex h-7 flex-1 items-center justify-center rounded-md bg-fg text-xs font-medium text-bg">
                    Aktivera
                  </button>
                )}
                {theme.updateAvailable && (
                  <button onClick={() => updateOne(theme.slug)} className="inline-flex h-7 items-center rounded-md border bg-surface px-2 text-xs font-medium hover:bg-bg">
                    <RefreshCw size={11} />
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={!!toActivate}
        onClose={() => setToActivate(null)}
        onConfirm={() => toActivate && activate(toActivate.slug)}
        title={toActivate ? `Aktivera ${toActivate.name}?` : ""}
        description="Temabytet slår igenom direkt på sajten."
        confirmLabel="Aktivera"
      />
    </div>
  );
}
