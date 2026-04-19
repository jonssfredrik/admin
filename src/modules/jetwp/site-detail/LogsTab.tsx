"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { logs as baseLogs } from "@/modules/jetwp/[id]/data";

export function LogsTab() {
  const toast = useToast();
  const [level, setLevel] = useState<"all" | "info" | "warn" | "error">("all");
  const [source, setSource] = useState<"all" | "php" | "wp" | "access" | "cron" | "backup" | "security" | "cache" | "db">("all");
  const [window, setWindow] = useState<"15m" | "1h" | "24h">("1h");

  const accessLogs = [
    { id: "acc-1", level: "info" as const, time: "14:33:02", source: "access", message: 'GET / 200 132ms "Mozilla/5.0"' },
    { id: "acc-2", level: "warn" as const, time: "14:31:52", source: "access", message: 'GET /wp-login.php 429 9ms "curl/8.6"' },
  ];
  const logs = [...baseLogs, ...accessLogs];

  const filtered = logs.filter((entry) => (level === "all" || entry.level === level) && (source === "all" || entry.source === source));
  const levelStyles = {
    info: "bg-fg/5 text-muted",
    warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    error: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["all", "info", "warn", "error"] as const).map((entry) => (
              <button
                key={entry}
                onClick={() => setLevel(entry)}
                className={clsx("rounded-md px-3 py-1 text-xs font-medium transition-colors", level === entry ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg")}
              >
                {entry === "all" ? "Alla nivåer" : entry.toUpperCase()}
              </button>
            ))}
          </div>
          <select value={source} onChange={(event) => setSource(event.target.value as typeof source)} className="rounded-lg border bg-surface px-3 py-2 text-sm">
            <option value="all">Alla loggtyper</option>
            <option value="php">PHP-fel</option>
            <option value="wp">WP-debugg</option>
            <option value="access">Access</option>
            <option value="cron">Cron</option>
            <option value="backup">Backup</option>
            <option value="security">Säkerhet</option>
            <option value="db">Databas</option>
          </select>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {(["15m", "1h", "24h"] as const).map((entry) => (
              <button
                key={entry}
                onClick={() => setWindow(entry)}
                className={clsx("rounded-md px-3 py-1 text-xs font-medium transition-colors", window === entry ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg")}
              >
                {entry}
              </button>
            ))}
          </div>
          <Button variant="secondary" onClick={() => toast.success("Export startad", `${filtered.length} loggrader`)}>
            <Download size={13} className="mr-1.5" />
            Exportera
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b px-4 py-3 text-sm font-medium">Visar {filtered.length} rader · tidsfönster {window}</div>
        <div className="divide-y divide-border/60 font-mono text-[12px]">
          {filtered.map((entry) => (
            <div key={entry.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-bg/50">
              <span className="shrink-0 tabular-nums text-muted">{entry.time}</span>
              <span className={clsx("shrink-0 rounded px-1.5 text-[10px] font-semibold uppercase", levelStyles[entry.level])}>{entry.level}</span>
              <span className="shrink-0 text-muted">[{entry.source}]</span>
              <span className="min-w-0 flex-1 break-all">{entry.message}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
