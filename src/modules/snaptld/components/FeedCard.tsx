"use client";

import { useState } from "react";
import { CalendarClock, CheckCircle2, PauseCircle, RefreshCcw, XCircle } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Table";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Label } from "@/components/ui/Input";
import { useToast } from "@/components/toast/ToastProvider";
import { formatDateTime, formatFeedSchedule } from "@/modules/snaptld/lib/format";
import { updateFeedScheduleAction, toggleFeedStatusAction } from "@/modules/snaptld/actions";
import { useAsyncAction } from "@/modules/snaptld/lib/useAsyncAction";
import type { FeedSource } from "@/modules/snaptld/types";

const cadencePresets = [
  { id: "hourly", label: "Varje timme", value: { type: "hourly", label: "Varje timme", intervalHours: 1 } },
  { id: "6h", label: "Var 6:e timme", value: { type: "interval", label: "Var 6:e timme", intervalHours: 6 } },
  { id: "daily", label: "Dagligen 08:00", value: { type: "daily", label: "Dagligen 08:00", time: "08:00" } },
  { id: "weekly", label: "Veckovis (måndag)", value: { type: "weekly", label: "Veckovis (måndag)", weekday: "måndag", time: "08:00" } },
] as const;

const statusMap = {
  active: { icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", label: "Aktiv", tone: "success" as const },
  paused: { icon: PauseCircle, color: "text-muted", label: "Pausad", tone: "neutral" as const },
  error: { icon: XCircle, color: "text-red-600 dark:text-red-400", label: "Fel", tone: "danger" as const },
};

export function FeedCard({ feed: initialFeed }: { feed: FeedSource }) {
  const toast = useToast();
  const scheduleAction = useAsyncAction();
  const toggleAction = useAsyncAction();
  const [feed, setFeed] = useState(initialFeed);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [schedule, setSchedule] = useState(feed.schedule);
  const [custom, setCustom] = useState("");
  const status = statusMap[feed.status];
  const Icon = status.icon;

  const saveSchedule = async () => {
    const nextSchedule = custom.trim()
      ? { type: "custom" as const, label: custom.trim(), cron: custom.trim() }
      : schedule;

    try {
      const updated = await scheduleAction.run(() => updateFeedScheduleAction(feed.id, nextSchedule));
      setFeed(updated);
      setSchedule(updated.schedule);
      setScheduleOpen(false);
      setCustom("");
      toast.success("Schema uppdaterat", `${feed.name} · ${formatFeedSchedule(updated.schedule)}`);
    } catch (error) {
      toast.error("Kunde inte uppdatera schema", error instanceof Error ? error.message : feed.name);
    }
  };

  const toggleStatus = async () => {
    try {
      const updated = await toggleAction.run(() => toggleFeedStatusAction(feed.id));
      setFeed(updated);
      toast.success(updated.status === "paused" ? "Feed pausad" : "Feed återupptagen", feed.name);
    } catch (error) {
      toast.error("Kunde inte uppdatera feed", error instanceof Error ? error.message : feed.name);
    }
  };

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Icon size={14} className={clsx("shrink-0", status.color)} />
            <h3 className="truncate text-sm font-semibold">{feed.name}</h3>
          </div>
          <p className="mt-1 break-all text-[11px] font-mono text-muted">{feed.url}</p>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
        <div className="text-muted">TLD</div>
        <div className="font-medium">{feed.tld}</div>
        <div className="text-muted">Typ</div>
        <div className="font-medium uppercase">{feed.type}</div>
        <div className="text-muted">Kadens</div>
        <div className="font-medium">{formatFeedSchedule(feed.schedule)}</div>
        <div className="text-muted">Senaste hämtning</div>
        <div className="font-mono">{formatDateTime(feed.lastFetchedAt)}</div>
        <div className="text-muted">Domäner (senaste)</div>
        <div className="font-medium tabular-nums">{feed.domainsLastRun.toLocaleString("sv-SE")}</div>
      </dl>

      <div className="flex gap-2 border-t pt-3">
        <Button
          variant="secondary"
          className="flex-1 gap-1.5"
          onClick={() => toast.info("Hämtar feed", `${feed.name} kö-lagd för nästa analys`)}
        >
          <RefreshCcw size={14} />
          Hämta nu
        </Button>
        <Button
          variant="ghost"
          className="gap-1.5"
          onClick={() => setScheduleOpen(true)}
          aria-label="Schemalägg"
        >
          <CalendarClock size={14} />
          Schema
        </Button>
        <Button variant="ghost" onClick={toggleStatus} disabled={toggleAction.isPending}>
          {feed.status === "paused" ? "Återuppta" : "Pausa"}
        </Button>
      </div>

      <Dialog
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Schemalägg feed"
        description={feed.name}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setScheduleOpen(false)}>
              Avbryt
            </Button>
            <Button onClick={saveSchedule} disabled={scheduleAction.isPending}>Spara</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <Label>Kadens</Label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {cadencePresets.map((preset) => {
                const active = schedule.label === preset.value.label && !custom.trim();
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSchedule(preset.value);
                      setCustom("");
                    }}
                    className={clsx(
                      "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      active ? "border-fg bg-fg/5" : "hover:bg-bg/60",
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <Label htmlFor="custom-cron">Anpassad (cron-uttryck)</Label>
            <Input
              id="custom-cron"
              placeholder="0 */4 * * *"
              value={custom}
              onChange={(event) => setCustom(event.target.value)}
              className="font-mono"
            />
            <div className="mt-1 text-[11px] text-muted">
              Skriv ett eget cron-uttryck för att åsidosätta valda presets.
            </div>
          </div>
        </div>
      </Dialog>
    </Card>
  );
}
