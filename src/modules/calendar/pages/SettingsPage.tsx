"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, CalendarClock, Eye, Monitor, RotateCcw, Save, Sparkles } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/components/toast/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { CalendarViewNav } from "@/modules/calendar/components/CalendarViewNav";
import {
  createDefaultCalendarSettings,
  useCalendarSettings,
  type CalendarSettings,
} from "@/modules/calendar/lib/useCalendarSettings";

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
  icon: typeof Bell;
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
        className={clsx(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
          checked ? "bg-fg" : "bg-fg/15",
        )}
      >
        <span
          className={clsx(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-bg shadow transition-transform",
            checked ? "translate-x-4" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const toast = useToast();
  const { hydrated, settings, save, reset } = useCalendarSettings();
  const [draft, setDraft] = useState<CalendarSettings>(createDefaultCalendarSettings());

  useEffect(() => {
    if (!hydrated) return;
    setDraft(settings);
  }, [hydrated, settings]);

  const activeNotifications = useMemo(
    () =>
      [draft.panelNotifications, draft.browserNotifications, draft.dailyAgendaDigest].filter(Boolean).length,
    [draft],
  );

  const syncDraft = (next: Partial<CalendarSettings>) => {
    setDraft((current) => ({ ...current, ...next }));
  };

  const saveNotifications = () => {
    save(draft);
    toast.success("Aviseringar sparade", "Kalenderns notifikationsinställningar har uppdaterats.");
  };

  const saveDisplay = () => {
    save(draft);
    toast.success("Vyinställningar sparade", "Kalendern använder nu dina nya visningspreferenser.");
  };

  const handleReset = () => {
    const defaults = createDefaultCalendarSettings();
    reset();
    setDraft(defaults);
    toast.info("Inställningar återställda", "Kalendern är tillbaka på standardläget.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Kalender"
          subtitle="Styr aviseringar, agendaintervall och hur kalendern presenteras i admin-panelen."
        />
        <CalendarViewNav current="settings" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Aktiva aviseringar"
          value={String(activeNotifications)}
          hint="Panel, browser och morgonsammanfattning"
        />
        <StatCard
          label="Agendafönster"
          value={`${draft.agendaDefaultDays} dagar`}
          hint="Standardintervall i agendavyn"
        />
        <StatCard
          label="Påminnelse"
          value={`${draft.reminderLeadMinutes} min`}
          hint="Tid före manuella händelser"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card>
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-muted" />
            <h2 className="text-sm font-semibold">Aviseringar</h2>
          </div>
          <p className="mt-1 text-xs text-muted">
            Bestäm hur kalendern ska påminna dig om kommande händelser och deadlines.
          </p>

          <div className="mt-4 divide-y">
            <ToggleRow
              label="Notiser i panelen"
              description="Visa interna notiser i admin-gränssnittet när viktiga händelser närmar sig."
              checked={draft.panelNotifications}
              onChange={(checked) => syncDraft({ panelNotifications: checked })}
              icon={Bell}
            />
            <ToggleRow
              label="Webbläsarnotiser"
              description="Tillåt kalendern att använda browsernotiser när fliken är öppen."
              checked={draft.browserNotifications}
              onChange={(checked) => syncDraft({ browserNotifications: checked })}
              icon={Monitor}
            />
            <ToggleRow
              label="Daglig agenda"
              description="Visa en morgonsammanfattning över dagens händelser i kalendern."
              checked={draft.dailyAgendaDigest}
              onChange={(checked) => syncDraft({ dailyAgendaDigest: checked })}
              icon={Sparkles}
            />
          </div>

          <div className="mt-4 max-w-xs">
            <Label htmlFor="calendar-reminder-lead">Påminn mig innan</Label>
            <select
              id="calendar-reminder-lead"
              value={draft.reminderLeadMinutes}
              onChange={(event) => syncDraft({ reminderLeadMinutes: Number(event.target.value) })}
              className="h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
            >
              <option value={10}>10 minuter</option>
              <option value={15}>15 minuter</option>
              <option value={30}>30 minuter</option>
              <option value={60}>1 timme</option>
              <option value={120}>2 timmar</option>
            </select>
          </div>

          <div className="mt-4 flex justify-end">
            <Button className="gap-1.5" onClick={saveNotifications}>
              <Save size={12} />
              Spara aviseringar
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-2">
              <CalendarClock size={14} className="text-muted" />
              <h2 className="text-sm font-semibold">Vyinställningar</h2>
            </div>
            <p className="mt-1 text-xs text-muted">
              Anpassa hur mycket information kalendern ska visa och hur snabbt du kommer till rätt kontext.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="calendar-agenda-days">Agenda visar som standard</Label>
                <select
                  id="calendar-agenda-days"
                  value={draft.agendaDefaultDays}
                  onChange={(event) => syncDraft({ agendaDefaultDays: Number(event.target.value) })}
                  className="h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
                >
                  <option value={14}>14 dagar</option>
                  <option value={30}>30 dagar</option>
                  <option value={60}>60 dagar</option>
                </select>
              </div>

              <div className="divide-y">
                <ToggleRow
                  label="Autoskroll i veckovyn"
                  description="Hoppa direkt till aktuell del av dagen när veckovyn öppnas."
                  checked={draft.autoScrollWeekToNow}
                  onChange={(checked) => syncDraft({ autoScrollWeekToNow: checked })}
                  icon={CalendarClock}
                />
                <ToggleRow
                  label="Visa mer eventtext"
                  description="Behåll beskrivningar och källtext synliga direkt i kalenderns kort och listor."
                  checked={draft.showEventDescriptions}
                  onChange={(checked) => syncDraft({ showEventDescriptions: checked })}
                  icon={Eye}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button className="gap-1.5" onClick={saveDisplay}>
                <Save size={12} />
                Spara vy
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-4">
              <div>
                <div className="text-sm font-medium">Återställ kalenderinställningar</div>
                <div className="mt-1 text-xs text-muted">
                  Tar bara bort personliga preferenser för vyn och notiser. Händelser påverkas inte.
                </div>
              </div>
              <Button variant="secondary" className="gap-1.5" onClick={handleReset}>
                <RotateCcw size={12} />
                Återställ
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
