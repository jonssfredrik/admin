"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  RefreshCw,
  HardDrive,
  Package,
  Palette,
  Plus,
  Shield,
  FileText,
  Settings as SettingsIcon,
  LayoutDashboard,
  Play,
  Pause,
  Download,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock3,
  Trash2,
  Wrench,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { AreaChart } from "@/components/charts/AreaChart";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/toast/ToastProvider";
import { sites, type SiteStatus } from "../data";
import { SiteThumb } from "../SiteThumb";
import { defaultPlugins, themes, backups as baseBackups, logs as baseLogs, visitsByDay, type Plugin, type Theme } from "./data";
import { backupDetails, domainInventory, siteSettings, type BackupDetail, type DomainEntry } from "../extended-data";

const statusConfig: Record<SiteStatus, { label: string; dot: string; text: string }> = {
  online: { label: "Online", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  warning: { label: "Warning", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  maintenance: { label: "Maintenance", dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" },
  offline: { label: "Offline", dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
};

const tabs = [
  { id: "overview", label: "Oversikt", icon: LayoutDashboard },
  { id: "plugins", label: "Plugins", icon: Package },
  { id: "themes", label: "Themes", icon: Palette },
  { id: "backups", label: "Backups", icon: HardDrive },
  { id: "domains", label: "Domains", icon: Globe },
  { id: "logs", label: "Logs", icon: FileText },
  { id: "settings", label: "Settings", icon: SettingsIcon },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function SiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const site = sites.find((entry) => entry.id === id);
  const toast = useToast();
  const [tab, setTab] = useState<TabId>("overview");

  if (!site) notFound();

  const cfg = statusConfig[site.status];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          JetWP
        </Link>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <SiteThumb screenshot={site.screenshot} domain={site.domain} size="lg" />
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="truncate text-2xl font-semibold tracking-tight">{site.name}</h1>
                <div className={clsx("flex items-center gap-1.5 rounded-md border bg-surface px-2 py-0.5 text-xs font-medium", cfg.text)}>
                  <span className={clsx("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                  {cfg.label}
                </div>
                {site.environment === "staging" && <span className="rounded bg-fg/5 px-1.5 py-0.5 text-[10px] font-medium text-muted">STAGING</span>}
              </div>
              <div className="mt-1 flex items-center gap-3 text-sm text-muted">
                <a href={`https://${site.domain}`} className="inline-flex items-center gap-1 hover:text-fg">
                  {site.domain}
                  <ExternalLink size={12} />
                </a>
                <span>·</span>
                <span>{site.plan}</span>
                <span>·</span>
                <span className="font-mono text-xs">WP {site.wp} / PHP {site.php}</span>
                <span>·</span>
                <span>agent {site.agentVersion}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => toast.success("Cache rensad", site.name)}>
              <RefreshCw size={14} className="mr-1.5" />
              Purge cache
            </Button>
            <Button onClick={() => toast.info("Oppnar", `${site.domain}/wp-admin`)}>
              <ExternalLink size={14} className="mr-1.5" />
              WP-admin
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b">
        {tabs.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setTab(tabId)}
            className={clsx(
              "relative flex items-center gap-1.5 px-3 py-2 text-sm transition-colors",
              tab === tabId ? "font-medium text-fg" : "text-muted hover:text-fg",
            )}
          >
            <Icon size={14} />
            {label}
            {tab === tabId && <span className="absolute inset-x-2 -bottom-px h-px bg-fg" />}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab siteId={site.id} site={site} />}
      {tab === "plugins" && <PluginsTab updatesAvailable={site.updatesAvailable} />}
      {tab === "themes" && <ThemesTab site={site} />}
      {tab === "backups" && <BackupsTab siteId={site.id} />}
      {tab === "domains" && <DomainsTab siteId={site.id} domain={site.domain} sslDays={site.sslDays} />}
      {tab === "logs" && <LogsTab />}
      {tab === "settings" && <SettingsTab siteId={site.id} php={site.php} />}
    </div>
  );
}

function OverviewTab({ site, siteId }: { site: (typeof sites)[number]; siteId: string }) {
  const storagePct = (site.storageGB / site.storageLimitGB) * 100;
  const securityCount = backupDetails.filter((item) => item.siteId === siteId).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MiniStat label="Visits 30d" value={site.visits30d.toLocaleString("sv-SE")} />
        <MiniStat label="Updates" value={String(site.updatesAvailable)} tone={site.updatesAvailable > 0 ? "warning" : "default"} />
        <MiniStat label="Storage" value={`${site.storageGB} / ${site.storageLimitGB} GB`} pct={storagePct} />
        <MiniStat label="Backups tracked" value={String(securityCount)} />
      </div>

      <Card className="p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold tracking-tight">Traffic trend</h2>
          <p className="mt-0.5 text-sm text-muted">Daily unique visits over the last 30 days.</p>
        </div>
        <AreaChart data={visitsByDay} />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-tight">Health checklist</h2>
          <div className="space-y-2.5">
            <HealthRow ok label="HTTP" detail="200 OK · 142 ms" />
            <HealthRow ok label="SSL" detail={`${site.sslDays} days remaining`} warn={site.sslDays < 30} />
            <HealthRow ok label="Heartbeat" detail={site.lastHeartbeat} warn={site.heartbeatStale} />
            <HealthRow ok label="Backup" detail={`Last backup ${site.lastBackup}`} />
            <HealthRow ok={site.securityUpdates === 0} label="Security findings" detail={`${site.securityUpdates} outstanding`} warn={site.securityUpdates > 0} />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-tight">Resources</h2>
          <div className="space-y-4">
            <ResourceRow label="CPU" value={22} max="4 vCPU" />
            <ResourceRow label="Memory" value={58} max="8 GB" />
            <ResourceRow label="Disk I/O" value={14} max="480 IOPS" />
            <ResourceRow label="Bandwidth" value={41} max="100 Mbit/s" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function PluginsTab({ updatesAvailable }: { updatesAvailable: number }) {
  const [list, setList] = useState<Plugin[]>(() => defaultPlugins(updatesAvailable));
  const [query, setQuery] = useState("");
  const [updateAllOpen, setUpdateAllOpen] = useState(false);
  const toast = useToast();

  const filtered = list.filter((plugin) => plugin.name.toLowerCase().includes(query.toLowerCase()) || plugin.author.toLowerCase().includes(query.toLowerCase()));
  const updateCount = list.filter((plugin) => plugin.updateAvailable).length;

  const toggle = (slug: string) => {
    setList((current) => current.map((plugin) => plugin.slug === slug ? { ...plugin, active: !plugin.active } : plugin));
    const plugin = list.find((entry) => entry.slug === slug);
    if (plugin) toast.success(plugin.active ? `${plugin.name} stoppat` : `${plugin.name} aktiverat`);
  };

  const updateOne = (slug: string) => {
    setList((current) => current.map((plugin) => plugin.slug === slug ? { ...plugin, version: plugin.latestVersion, updateAvailable: false } : plugin));
    toast.success("Plugin uppdaterat");
  };

  const updateAll = () => {
    setList((current) => current.map((plugin) => ({ ...plugin, version: plugin.latestVersion, updateAvailable: false })));
    toast.success("Alla plugins uppdaterade", `${updateCount} uppdateringar kordes`);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input className="pl-9" placeholder="Sok plugin..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          {updateCount > 0 && (
            <Button onClick={() => setUpdateAllOpen(true)}>
              <RefreshCw size={14} className="mr-1.5" />
              Uppdatera alla ({updateCount})
            </Button>
          )}
        </div>
      </Card>

      <Table>
        <thead>
          <tr>
            <Th>Plugin</Th>
            <Th>Version</Th>
            <Th>Status</Th>
            <Th className="w-40 text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((plugin) => (
            <tr key={plugin.slug} className="transition-colors hover:bg-bg/50">
              <Td>
                <div>
                  <div className="font-medium">{plugin.name}</div>
                  <div className="text-xs text-muted">{plugin.author}</div>
                </div>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs tabular-nums">{plugin.version}</span>
                  {plugin.updateAvailable && <Badge tone="warning">→ {plugin.latestVersion}</Badge>}
                </div>
              </Td>
              <Td>
                <Badge tone={plugin.active ? "success" : "neutral"}>{plugin.active ? "Active" : "Inactive"}</Badge>
              </Td>
              <Td className="text-right">
                <div className="inline-flex items-center gap-1">
                  {plugin.updateAvailable && (
                    <button onClick={() => updateOne(plugin.slug)} className="inline-flex h-7 items-center rounded-md border bg-surface px-2 text-xs font-medium hover:bg-bg">
                      <RefreshCw size={11} className="mr-1" />
                      Update
                    </button>
                  )}
                  <button onClick={() => toggle(plugin.slug)} className="inline-flex h-7 items-center rounded-md border bg-surface px-2 text-xs font-medium hover:bg-bg">
                    {plugin.active ? <Pause size={11} className="mr-1" /> : <Play size={11} className="mr-1" />}
                    {plugin.active ? "Stop" : "Start"}
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ConfirmDialog
        open={updateAllOpen}
        onClose={() => setUpdateAllOpen(false)}
        onConfirm={updateAll}
        title={`Uppdatera ${updateCount} plugins?`}
        description="Backup rekommenderas innan uppdateringen kors."
        confirmLabel="Update all"
      />
    </div>
  );
}

function ThemesTab({ site }: { site: (typeof sites)[number] }) {
  const [list, setList] = useState<Theme[]>(() => themes(site.activeTheme, site.themeVersion, site.themeUpdateAvailable));
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
        <Card className="p-0 overflow-hidden">
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
            <div className="h-24 w-40 shrink-0 rounded-lg border" style={{ background: active.screenshot }} />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Active theme</div>
              <div className="mt-1 flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight">{active.name}</h2>
                <span className="font-mono text-xs text-muted">v{active.version}</span>
                {active.updateAvailable && <Badge tone="warning">→ {active.latestVersion}</Badge>}
              </div>
              <div className="mt-0.5 text-xs text-muted">By {active.author}</div>
            </div>
            <div className="flex gap-2">
              {active.updateAvailable && (
                <Button variant="secondary" onClick={() => updateOne(active.slug)}>
                  <RefreshCw size={14} className="mr-1.5" />
                  Update
                </Button>
              )}
              <Button variant="secondary" onClick={() => toast.info("Opening customizer", active.name)}>
                Customize
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((theme) => (
          <Card key={theme.slug} className="overflow-hidden p-0">
            <div className="relative h-32 border-b" style={{ background: theme.screenshot }}>
              {theme.active && <span className="absolute left-2 top-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Active</span>}
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
                    Active
                  </button>
                ) : (
                  <button onClick={() => setToActivate(theme)} className="inline-flex h-7 flex-1 items-center justify-center rounded-md bg-fg text-xs font-medium text-bg">
                    Activate
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
        title={toActivate ? `Activate ${toActivate.name}?` : ""}
        description="Theme switch applies immediately on the site."
        confirmLabel="Activate"
      />
    </div>
  );
}

function BackupsTab({ siteId }: { siteId: string }) {
  const toast = useToast();
  const siteBackups = backupDetails.filter((item) => item.siteId === siteId);
  const fallback = baseBackups.map((item) => ({
    ...item,
    siteId,
    location: "s3://jetwp-backups/fallback.tar.zst",
    filesIncluded: ["uploads", "plugins", "themes"],
    database: { engine: "MariaDB", size: "120 MB", tables: 84 },
    checksum: "sha256:fallback",
  }));
  const [selectedBackup, setSelectedBackup] = useState<BackupDetail>((siteBackups[0] ?? fallback[0]) as BackupDetail);
  const [schedule, setSchedule] = useState("daily 04:00");
  const [restoreMode, setRestoreMode] = useState<"staging" | "production">("staging");
  const [confirmRestore, setConfirmRestore] = useState(false);

  const list = siteBackups.length > 0 ? siteBackups : (fallback as BackupDetail[]);

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Backup schedule</h2>
            <p className="mt-1 text-xs text-muted">Choose per-site schedule and retention.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["hourly", "daily 04:00", "daily 02:00", "weekly Sunday"].map((item) => (
                <button
                  key={item}
                  onClick={() => setSchedule(item)}
                  className={clsx("rounded-md border px-3 py-1.5 text-xs font-medium", schedule === item ? "bg-bg text-fg" : "text-muted")}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-bg/40 p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted">Restore flow</div>
            <div className="mt-2 flex gap-2">
              {(["staging", "production"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setRestoreMode(item)}
                  className={clsx("rounded-md border px-3 py-1.5 text-xs font-medium", restoreMode === item ? "bg-surface text-fg" : "text-muted")}
                >
                  {item}
                </button>
              ))}
            </div>
            <Button className="mt-3 w-full" onClick={() => setConfirmRestore(true)}>
              <RotateCcw size={14} className="mr-1.5" />
              Start restore
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Table>
          <thead>
            <tr>
              <Th>Created</Th>
              <Th>Type</Th>
              <Th>Size</Th>
              <Th>Retention</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((backup) => (
              <tr key={backup.id} className={clsx("transition-colors hover:bg-bg/50", selectedBackup.id === backup.id && "bg-bg/60")}>
                <Td>
                  <button onClick={() => setSelectedBackup(backup)} className="text-left font-medium hover:text-fg">
                    {backup.createdAt}
                  </button>
                </Td>
                <Td><Badge tone={backup.type === "manual" ? "success" : "neutral"}>{backup.type}</Badge></Td>
                <Td className="font-mono text-[12px] text-muted">{backup.size}</Td>
                <Td className="text-xs text-muted">{backup.retention}</Td>
                <Td className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <button onClick={() => toast.info("Backup archive queued", backup.id)} className="inline-flex h-7 items-center rounded-md border bg-surface px-2 text-xs font-medium hover:bg-bg">
                      <Download size={11} className="mr-1" />
                      Download
                    </button>
                    <button onClick={() => setConfirmRestore(true)} className="inline-flex h-7 items-center rounded-md border bg-surface px-2 text-xs font-medium hover:bg-bg">
                      <RotateCcw size={11} className="mr-1" />
                      Restore
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold tracking-tight">Backup detail</div>
            <Badge tone="neutral">{selectedBackup.type}</Badge>
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            <MetaRow label="Archive" value={selectedBackup.location} mono />
            <MetaRow label="Checksum" value={selectedBackup.checksum} mono />
            <MetaRow label="DB" value={`${selectedBackup.database.engine} · ${selectedBackup.database.size}`} />
            <MetaRow label="Tables" value={String(selectedBackup.database.tables)} />
          </dl>
          <div className="mt-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted">Includes</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selectedBackup.filesIncluded.map((entry) => <Badge key={entry} tone="neutral">{entry}</Badge>)}
            </div>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmRestore}
        onClose={() => setConfirmRestore(false)}
        onConfirm={() => toast.success("Restore queued", `${selectedBackup.id} -> ${restoreMode}`)}
        title={`Restore ${selectedBackup.id} to ${restoreMode}?`}
        description="Step 1 validates archive. Step 2 verifies target. Step 3 executes database and file restore."
        confirmLabel="Queue restore"
        tone="danger"
      />
    </div>
  );
}

function DomainsTab({ siteId, domain, sslDays }: { siteId: string; domain: string; sslDays: number }) {
  const toast = useToast();
  const [domains, setDomains] = useState<DomainEntry[]>(domainInventory[siteId] ?? [{
    id: `${siteId}-default`,
    host: domain,
    kind: "primary",
    dnsStatus: "verified",
    sslStatus: sslDays < 30 ? "expiring" : "active",
    wwwMode: "root",
    records: [
      { type: "A", name: "@", value: "203.0.113.55", status: "ok" },
      { type: "CNAME", name: "www", value: domain, status: "ok" },
    ],
  }]);
  const [selectedDomainId, setSelectedDomainId] = useState(domains[0]?.id ?? "");
  const [newDomain, setNewDomain] = useState("");

  const selected = domains.find((entry) => entry.id === selectedDomainId) ?? domains[0];

  const addDomain = () => {
    if (!newDomain.trim()) return;
    const item: DomainEntry = {
      id: `domain-${Date.now()}`,
      host: newDomain.trim(),
      kind: "alias",
      dnsStatus: "pending",
      sslStatus: "renewing",
      wwwMode: "both",
      records: [{ type: "CNAME", name: newDomain.split(".")[0], value: "edge.jetwp.io", status: "pending" }],
    };
    setDomains((current) => [...current, item]);
    setSelectedDomainId(item.id);
    setNewDomain("");
    toast.success("Domain added", item.host);
  };

  const removeDomain = (id: string) => {
    setDomains((current) => current.filter((entry) => entry.id !== id));
    setSelectedDomainId((current) => current === id ? domains[0]?.id ?? "" : current);
    toast.info("Domain removed", id);
  };

  const updateWww = (mode: "root" | "www" | "both") => {
    setDomains((current) => current.map((entry) => entry.id === selected.id ? { ...entry, wwwMode: mode } : entry));
    toast.success("www mode updated", mode);
  };

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <div className="text-sm font-semibold tracking-tight">Additional domains</div>
            <div className="mt-1 text-xs text-muted">Manage aliases, redirects, DNS and SSL status.</div>
          </div>
          <div className="flex min-w-[320px] gap-2">
            <Input placeholder="kund.example.se" value={newDomain} onChange={(event) => setNewDomain(event.target.value)} />
            <Button onClick={addDomain}>
              <Plus size={14} className="mr-1.5" />
              Add
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Card className="p-0 overflow-hidden">
          <div className="border-b px-5 py-3 text-sm font-semibold tracking-tight">Domain inventory</div>
          <div className="divide-y divide-border/60">
            {domains.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedDomainId(entry.id)}
                className={clsx("flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-bg/50", selected?.id === entry.id && "bg-bg/60")}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{entry.host}</span>
                    <Badge tone={entry.kind === "primary" ? "success" : entry.kind === "redirect" ? "warning" : "neutral"}>{entry.kind}</Badge>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
                    <span>DNS {entry.dnsStatus}</span>
                    <span>·</span>
                    <span>SSL {entry.sslStatus}</span>
                    {entry.redirectTo && (
                      <>
                        <span>·</span>
                        <span>{entry.redirectTo}</span>
                      </>
                    )}
                  </div>
                </div>
                {entry.kind !== "primary" && (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      removeDomain(entry.id);
                    }}
                    className="rounded-md p-1.5 text-muted hover:bg-red-500/10 hover:text-red-600"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </button>
            ))}
          </div>
        </Card>

        {selected && (
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold tracking-tight">{selected.host}</div>
                <div className="text-xs text-muted">DNS and redirect controls</div>
              </div>
              <Badge tone={selected.dnsStatus === "verified" ? "success" : selected.dnsStatus === "pending" ? "warning" : "danger"}>
                {selected.dnsStatus}
              </Badge>
            </div>

            <div className="mt-4">
              <div className="text-xs font-medium uppercase tracking-wider text-muted">www mode</div>
              <div className="mt-2 flex gap-2">
                {(["root", "www", "both"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => updateWww(mode)}
                    className={clsx("rounded-md border px-3 py-1.5 text-xs font-medium", selected.wwwMode === mode ? "bg-bg text-fg" : "text-muted")}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {selected.redirectTo && (
              <div className="mt-4 rounded-lg border bg-bg/40 p-3 text-sm">
                <div className="font-medium">Redirect target</div>
                <div className="mt-1 text-muted">{selected.redirectTo}</div>
              </div>
            )}

            <div className="mt-4">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">DNS records</div>
              <div className="space-y-2">
                {selected.records.map((record, index) => (
                  <div key={`${record.name}-${index}`} className="flex items-center gap-3 rounded-lg border bg-bg/40 px-3 py-2 text-sm">
                    <span className="w-14 font-mono text-xs text-muted">{record.type}</span>
                    <span className="w-20 font-mono text-xs">{record.name}</span>
                    <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted">{record.value}</span>
                    <Badge tone={record.status === "ok" ? "success" : record.status === "pending" ? "warning" : "danger"}>
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function LogsTab() {
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
                {entry === "all" ? "All levels" : entry.toUpperCase()}
              </button>
            ))}
          </div>
          <select value={source} onChange={(event) => setSource(event.target.value as typeof source)} className="rounded-lg border bg-surface px-3 py-2 text-sm">
            <option value="all">All log types</option>
            <option value="php">PHP error</option>
            <option value="wp">WP debug</option>
            <option value="access">Access</option>
            <option value="cron">Cron</option>
            <option value="backup">Backup</option>
            <option value="security">Security</option>
            <option value="db">DB</option>
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
          <Button variant="secondary" onClick={() => toast.success("Export started", `${filtered.length} log rows`)}>
            <Download size={13} className="mr-1.5" />
            Export
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b px-4 py-3 text-sm font-medium">Showing {filtered.length} rows · window {window}</div>
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

function SettingsTab({ siteId, php }: { siteId: string; php: string }) {
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
    toast.success("Setting saved", String(key));
  };

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold tracking-tight">Runtime</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <Row label="PHP version" desc="Changing version may restart the site.">
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
          </Row>
          <Row label="Cron mode" desc="Switch between WP-Cron and system cron.">
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
          </Row>
          <Row label="Cron expression" desc="Execution schedule for maintenance jobs.">
            <Input value={values.cronExpression} onChange={(event) => update("cronExpression", event.target.value)} />
          </Row>
          <Row label="Edge cache TTL" desc="How long pages remain cached on edge nodes.">
            <Input value={values.edgeCacheTtl} onChange={(event) => update("edgeCacheTtl", event.target.value)} />
          </Row>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold tracking-tight">Feature toggles</h2>
        <div className="divide-y divide-border/60">
          <Toggle label="Maintenance mode" desc="Serve maintenance banner and block editor traffic." value={values.maintenanceMode} onChange={(value) => update("maintenanceMode", value)} />
          <Toggle label="Debug mode" desc="Enable WP_DEBUG and surface notices." value={values.debugMode} onChange={(value) => update("debugMode", value)} />
          <Toggle label="Debug log" desc="Write WP errors to wp-content/debug.log." value={values.debugLog} onChange={(value) => update("debugLog", value)} />
          <Toggle label="Page cache" desc="Cache full HTML pages." value={values.pageCache} onChange={(value) => update("pageCache", value)} />
          <Toggle label="Object cache" desc="Enable persistent Redis object cache." value={values.objectCache} onChange={(value) => update("objectCache", value)} />
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">wp-config snapshot</h2>
            <p className="mt-1 text-xs text-muted">Read-only view of critical runtime keys.</p>
          </div>
          <Button variant="secondary" onClick={() => toast.info("wp-config export queued")}>
            <Download size={13} className="mr-1.5" />
            Export
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

function MiniStat({ label, value, pct, tone }: { label: string; value: string; pct?: number; tone?: "warning" | "default" }) {
  return (
    <Card className="p-4">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted">{label}</div>
      <div className={clsx("mt-1.5 text-xl font-semibold tracking-tight tabular-nums", tone === "warning" && "text-amber-600 dark:text-amber-400")}>
        {value}
      </div>
      {typeof pct === "number" && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-fg/5">
          <div className={clsx("h-full rounded-full", pct > 85 ? "bg-amber-500" : "bg-fg/60")} style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      )}
    </Card>
  );
}

function HealthRow({ ok, label, detail, warn }: { ok: boolean; label: string; detail: string; warn?: boolean }) {
  const Icon = !ok ? XCircle : warn ? AlertTriangle : CheckCircle2;
  const color = !ok ? "text-red-600 dark:text-red-400" : warn ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400";
  return (
    <div className="flex items-center gap-2.5">
      <Icon size={14} className={clsx("shrink-0", color)} />
      <span className="text-sm font-medium">{label}</span>
      <span className="flex-1 truncate text-xs text-muted">{detail}</span>
    </div>
  );
}

function ResourceRow({ label, value, max }: { label: string; value: number; max: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted">{value}% · {max}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-fg/5">
        <div className="h-full rounded-full bg-fg/60" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MetaRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={clsx("text-right", mono && "font-mono text-[12px]")}>{value}</dd>
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-medium">{label}</div>
      {desc && <div className="mt-0.5 text-xs text-muted">{desc}</div>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {desc && <div className="mt-0.5 text-xs text-muted">{desc}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={clsx("relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors", value ? "bg-fg" : "bg-fg/15")}
      >
        <span className={clsx("absolute top-0.5 h-[18px] w-[18px] rounded-full bg-surface shadow-soft transition-transform", value ? "translate-x-[18px]" : "translate-x-0.5")} />
      </button>
    </label>
  );
}
