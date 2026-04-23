"use client";

import { useState } from "react";
import clsx from "clsx";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/toast/ToastProvider";
import { siteSettings } from "@/modules/mwp/extended-data";
import { SettingsRow, Toggle } from "@/modules/mwp/site-detail/SiteDetailPrimitives";

interface SettingsTabProps {
  siteId: string;
  php: string;
}

export function SettingsTab({ siteId, php }: SettingsTabProps) {
  const toast = useToast();
  const initial = siteSettings[siteId] ?? {
    maintenanceMode: false,
    wpCronMode: "wp-cron" as const,
    cronExpression: "every request",
    debugMode: false,
    debugLog: false,
    pageCache: true,
    objectCache: true,
    edgeCacheTtl: "30m",
    wpConfig: [
      { key: "WP_DEBUG", value: "false" },
      { key: "WP_CACHE", value: "true" },
    ],
  };
  const [values, setValues] = useState({
    php,
    ...initial,
  });

  const update = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    toast.success("Inställning sparad", String(key));
  };

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold tracking-tight">Körmiljö</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <SettingsRow label="PHP-version" desc="Ändring av version kan starta om sajten.">
            <div className="flex rounded-lg border bg-bg p-0.5">
              {["8.1", "8.2", "8.3"].map((version) => (
                <button
                  key={version}
                  onClick={() => update("php", version)}
                  className={clsx("rounded-md px-3 py-1 text-xs font-medium transition-colors", values.php === version ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg")}
                >
                  PHP {version}
                </button>
              ))}
            </div>
          </SettingsRow>
          <SettingsRow label="Cron-läge" desc="Växla mellan WP-Cron och system-cron.">
            <div className="flex rounded-lg border bg-bg p-0.5">
              {(["wp-cron", "system-cron"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => update("wpCronMode", mode)}
                  className={clsx("rounded-md px-3 py-1 text-xs font-medium transition-colors", values.wpCronMode === mode ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg")}
                >
                  {mode}
                </button>
              ))}
            </div>
          </SettingsRow>
          <SettingsRow label="Cron-uttryck" desc="Körschema för underhållsjobb.">
            <Input value={values.cronExpression} onChange={(event) => update("cronExpression", event.target.value)} />
          </SettingsRow>
          <SettingsRow label="TTL för edge-cache" desc="Hur länge sidor cachas på edge-noder.">
            <Input value={values.edgeCacheTtl} onChange={(event) => update("edgeCacheTtl", event.target.value)} />
          </SettingsRow>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold tracking-tight">Funktionsväxlar</h2>
        <div className="divide-y divide-border/60">
          <Toggle label="Underhållsläge" desc="Visa underhållsbanner och blockera editortrafik." value={values.maintenanceMode} onChange={(value) => update("maintenanceMode", value)} />
          <Toggle label="Debuggläge" desc="Aktivera WP_DEBUG och visa notices." value={values.debugMode} onChange={(value) => update("debugMode", value)} />
          <Toggle label="Debugglogg" desc="Skriv WP-fel till wp-content/debug.log." value={values.debugLog} onChange={(value) => update("debugLog", value)} />
          <Toggle label="Sidcache" desc="Cacha fullständiga HTML-sidor." value={values.pageCache} onChange={(value) => update("pageCache", value)} />
          <Toggle label="Objektcache" desc="Aktivera persistent Redis-objektcache." value={values.objectCache} onChange={(value) => update("objectCache", value)} />
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">wp-config-ögonblicksbild</h2>
            <p className="mt-1 text-xs text-muted">Skrivskyddad vy av kritiska nycklar i körmiljön.</p>
          </div>
          <Button variant="secondary" onClick={() => toast.info("wp-config-export köad")}>
            <Download size={13} className="mr-1.5" />
            Exportera
          </Button>
        </div>
        <div className="mt-4 space-y-2">
          {values.wpConfig.map((entry) => (
            <div key={entry.key} className="flex items-center justify-between gap-4 rounded-lg border bg-bg/40 px-3 py-2 text-sm">
              <div className="font-mono text-[12px]">{entry.key}</div>
              <div className="font-mono text-[12px] text-muted">{entry.value}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
