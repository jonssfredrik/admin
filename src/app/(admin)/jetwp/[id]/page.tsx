"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  RefreshCw,
  HardDrive,
  Activity,
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
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
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
import { defaultPlugins, themes, backups, logs, visitsByDay, type Plugin, type Theme } from "./data";

const statusConfig: Record<SiteStatus, { label: string; dot: string; text: string }> = {
  online: { label: "Online", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  warning: { label: "Varning", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  maintenance: { label: "Underhåll", dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" },
  offline: { label: "Offline", dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
};

const tabs = [
  { id: "overview", label: "Översikt", icon: LayoutDashboard },
  { id: "plugins", label: "Plugins", icon: Package },
  { id: "themes", label: "Teman", icon: Palette },
  { id: "backups", label: "Backups", icon: HardDrive },
  { id: "domains", label: "Domäner", icon: Globe },
  { id: "logs", label: "Loggar", icon: FileText },
  { id: "settings", label: "Inställningar", icon: SettingsIcon },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function SiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const site = sites.find((s) => s.id === id);
  if (!site) notFound();

  const [tab, setTab] = useState<TabId>("overview");
  const cfg = statusConfig[site.status];
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/jetwp"
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"
        >
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
              {site.environment === "staging" && (
                <span className="rounded bg-fg/5 px-1.5 py-0.5 text-[10px] font-medium text-muted">STAGING</span>
              )}
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
              <span className="inline-flex items-center gap-1">
                <Palette size={11} />
                {site.activeTheme}
              </span>
            </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => toast.success("Cache rensad", site.name)}>
              <Zap size={14} strokeWidth={2} className="mr-1.5" />
              Rensa cache
            </Button>
            <Button onClick={() => toast.info("Öppnar", `${site.domain}/wp-admin`)}>
              <ExternalLink size={14} strokeWidth={2} className="mr-1.5" />
              WP-admin
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b">
        {tabs.map(({ id: tid, label, icon: Icon }) => (
          <button
            key={tid}
            onClick={() => setTab(tid)}
            className={clsx(
              "relative flex items-center gap-1.5 px-3 py-2 text-sm transition-colors",
              tab === tid ? "text-fg font-medium" : "text-muted hover:text-fg",
            )}
          >
            <Icon size={14} strokeWidth={1.75} />
            {label}
            {tab === tid && <span className="absolute inset-x-2 -bottom-px h-px bg-fg" />}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab site={site} />}
      {tab === "plugins" && <PluginsTab updatesAvailable={site.updatesAvailable} />}
      {tab === "themes" && <ThemesTab site={site} />}
      {tab === "backups" && <BackupsTab />}
      {tab === "domains" && <DomainsTab domain={site.domain} sslDays={site.sslDays} />}
      {tab === "logs" && <LogsTab />}
      {tab === "settings" && <SettingsTab php={site.php} />}
    </div>
  );
}

function OverviewTab({ site }: { site: (typeof sites)[number] }) {
  const storagePct = (site.storageGB / site.storageLimitGB) * 100;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MiniStat label="Besök (30d)" value={site.visits30d.toLocaleString("sv-SE")} />
        <MiniStat label="Uppdateringar" value={String(site.updatesAvailable)} tone={site.updatesAvailable > 0 ? "warning" : "default"} />
        <MiniStat label="Lagring" value={`${site.storageGB} / ${site.storageLimitGB} GB`} pct={storagePct} />
        <MiniStat label="SSL" value={`${site.sslDays} dagar kvar`} tone={site.sslDays < 30 ? "warning" : "default"} />
      </div>

      <Card className="p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold tracking-tight">Trafik (30 dagar)</h2>
          <p className="mt-0.5 text-sm text-muted">Unika besökare per dag</p>
        </div>
        <AreaChart data={visitsByDay} />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-tight">Hälsokontroll</h2>
          <div className="space-y-2.5">
            <HealthRow ok label="HTTP-svar" detail="200 OK · 142 ms" />
            <HealthRow ok label="SSL-certifikat" detail={`Giltigt ${site.sslDays} dagar till`} warn={site.sslDays < 30} />
            <HealthRow ok label="PHP-version" detail={`PHP ${site.php} · upp till datum`} />
            <HealthRow ok label="WordPress-kärna" detail={`WP ${site.wp}`} />
            <HealthRow ok={site.updatesAvailable === 0} label="Plugins" detail={site.updatesAvailable > 0 ? `${site.updatesAvailable} uppdateringar tillgängliga` : "Alla uppdaterade"} warn={site.updatesAvailable > 0} />
            <HealthRow ok label="Backup" detail={`Senast: ${site.lastBackup}`} />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-tight">Resurser (senaste timmen)</h2>
          <div className="space-y-4">
            <ResourceRow label="CPU" value={22} max="4 vCPU" />
            <ResourceRow label="Minne" value={58} max="8 GB" />
            <ResourceRow label="Diskläsningar" value={14} max="IOPS" />
            <ResourceRow label="Bandbredd" value={41} max="100 Mbit/s" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function MiniStat({ label, value, pct, tone }: { label: string; value: string; pct?: number; tone?: "warning" | "default" }) {
  return (
    <Card className="p-4">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted">{label}</div>
      <div className={clsx(
        "mt-1.5 text-xl font-semibold tracking-tight tabular-nums",
        tone === "warning" && "text-amber-600 dark:text-amber-400",
      )}>
        {value}
      </div>
      {typeof pct === "number" && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-fg/5">
          <div
            className={clsx("h-full rounded-full", pct > 85 ? "bg-amber-500" : "bg-fg/60")}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      )}
    </Card>
  );
}

function HealthRow({ ok, label, detail, warn }: { ok: boolean; label: string; detail: string; warn?: boolean }) {
  const Icon = !ok ? XCircle : warn ? AlertTriangle : CheckCircle2;
  const color = !ok
    ? "text-red-600 dark:text-red-400"
    : warn
    ? "text-amber-600 dark:text-amber-400"
    : "text-emerald-600 dark:text-emerald-400";
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
        <span className="tabular-nums text-muted">{value}% <span className="opacity-60">· {max}</span></span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-fg/5">
        <div className="h-full rounded-full bg-fg/60" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function PluginsTab({ updatesAvailable }: { updatesAvailable: number }) {
  const [list, setList] = useState<Plugin[]>(() => defaultPlugins(updatesAvailable));
  const [query, setQuery] = useState("");
  const [updateAllOpen, setUpdateAllOpen] = useState(false);
  const toast = useToast();

  const filtered = list.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.author.toLowerCase().includes(query.toLowerCase()),
  );
  const updateCount = list.filter((p) => p.updateAvailable).length;

  const toggle = (slug: string) => {
    setList((xs) => xs.map((p) => (p.slug === slug ? { ...p, active: !p.active } : p)));
    const p = list.find((x) => x.slug === slug);
    if (p) toast.success(p.active ? `${p.name} inaktiverat` : `${p.name} aktiverat`);
  };

  const updateOne = (slug: string) => {
    setList((xs) => xs.map((p) => (p.slug === slug ? { ...p, version: p.latestVersion, updateAvailable: false } : p)));
    toast.success("Plugin uppdaterat");
  };

  const updateAll = () => {
    setList((xs) => xs.map((p) => ({ ...p, version: p.latestVersion, updateAvailable: false })));
    toast.success("Alla plugins uppdaterade", `${updateCount} uppdateringar kördes`);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input className="pl-9" placeholder="Sök plugin…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          {updateCount > 0 && (
            <Button onClick={() => setUpdateAllOpen(true)}>
              <RefreshCw size={14} strokeWidth={2} className="mr-1.5" />
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
            <Th className="w-40 text-right">Åtgärder</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.slug} className="transition-colors hover:bg-bg/50">
              <Td>
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted">{p.author}</div>
                </div>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs tabular-nums">{p.version}</span>
                  {p.updateAvailable && (
                    <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                      → {p.latestVersion}
                    </span>
                  )}
                </div>
              </Td>
              <Td>
                <Badge tone={p.active ? "success" : "neutral"}>{p.active ? "Aktiv" : "Inaktiv"}</Badge>
              </Td>
              <Td className="text-right">
                <div className="inline-flex items-center gap-1">
                  {p.updateAvailable && (
                    <button
                      onClick={() => updateOne(p.slug)}
                      className="inline-flex h-7 items-center rounded-md border bg-surface px-2 text-xs font-medium hover:bg-bg"
                    >
                      <RefreshCw size={11} className="mr-1" />
                      Uppdatera
                    </button>
                  )}
                  <button
                    onClick={() => toggle(p.slug)}
                    className="inline-flex h-7 items-center rounded-md border bg-surface px-2 text-xs font-medium hover:bg-bg"
                  >
                    {p.active ? <Pause size={11} className="mr-1" /> : <Play size={11} className="mr-1" />}
                    {p.active ? "Stoppa" : "Starta"}
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
        description="Rekommenderat att ta backup först. Sajten kan vara otillgänglig i några sekunder."
        confirmLabel="Uppdatera alla"
      />
    </div>
  );
}

function ThemesTab({ site }: { site: (typeof sites)[number] }) {
  const [list, setList] = useState<Theme[]>(() =>
    themes(site.activeTheme, site.themeVersion, site.themeUpdateAvailable),
  );
  const toast = useToast();
  const [toActivate, setToActivate] = useState<Theme | null>(null);

  const activate = (slug: string) => {
    setList((xs) => xs.map((t) => ({ ...t, active: t.slug === slug })));
    const t = list.find((x) => x.slug === slug);
    if (t) toast.success("Tema aktiverat", t.name);
  };

  const updateOne = (slug: string) => {
    setList((xs) => xs.map((t) => (t.slug === slug ? { ...t, version: t.latestVersion, updateAvailable: false } : t)));
    toast.success("Tema uppdaterat");
  };

  const active = list.find((t) => t.active);

  return (
    <div className="space-y-6">
      {active && (
        <Card className="p-0 overflow-hidden">
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
            <div
              className="h-24 w-40 shrink-0 rounded-lg border"
              style={{ background: active.screenshot }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Aktivt tema
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight">{active.name}</h2>
                <span className="font-mono text-xs text-muted">v{active.version}</span>
                {active.updateAvailable && (
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                    → {active.latestVersion}
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-xs text-muted">Av {active.author}</div>
            </div>
            <div className="flex gap-2">
              {active.updateAvailable && (
                <Button variant="secondary" onClick={() => updateOne(active.slug)}>
                  <RefreshCw size={14} strokeWidth={2} className="mr-1.5" />
                  Uppdatera
                </Button>
              )}
              <Button variant="secondary" onClick={() => toast.info("Öppnar theme customizer", active.name)}>
                Anpassa
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight">Installerade teman</h2>
          <Button variant="secondary" onClick={() => toast.info("Tema-katalog", "Bläddra bland 10 000+ teman")}>
            <Plus size={14} strokeWidth={2} className="mr-1.5" />
            Installera tema
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <Card key={t.slug} className="overflow-hidden p-0">
              <div
                className="relative h-32 border-b"
                style={{ background: t.screenshot }}
              >
                {t.active && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 shadow-soft">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Aktivt
                  </span>
                )}
                {t.updateAvailable && !t.active && (
                  <span className="absolute right-2 top-2 rounded-md bg-amber-500/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-soft">
                    Uppdatering
                  </span>
                )}
              </div>
              <div className="p-3.5">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="truncate font-medium">{t.name}</div>
                  <span className="shrink-0 font-mono text-[11px] text-muted">v{t.version}</span>
                </div>
                <div className="mt-0.5 truncate text-xs text-muted">{t.author}</div>
                <div className="mt-3 flex gap-1.5">
                  {t.active ? (
                    <button
                      disabled
                      className="inline-flex h-7 flex-1 items-center justify-center rounded-md border bg-bg text-xs font-medium text-muted"
                    >
                      Aktivt
                    </button>
                  ) : (
                    <button
                      onClick={() => setToActivate(t)}
                      className="inline-flex h-7 flex-1 items-center justify-center rounded-md bg-fg text-xs font-medium text-bg hover:opacity-90"
                    >
                      Aktivera
                    </button>
                  )}
                  {t.updateAvailable && (
                    <button
                      onClick={() => updateOne(t.slug)}
                      className="inline-flex h-7 items-center rounded-md border bg-surface px-2 text-xs font-medium hover:bg-bg"
                    >
                      <RefreshCw size={11} />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={!!toActivate}
        onClose={() => setToActivate(null)}
        onConfirm={() => toActivate && activate(toActivate.slug)}
        title={toActivate ? `Aktivera ${toActivate.name}?` : ""}
        description="Sajtens utseende ändras omedelbart. Du kan alltid växla tillbaka."
        confirmLabel="Aktivera"
      />
    </div>
  );
}

function BackupsTab() {
  const [toRestore, setToRestore] = useState<string | null>(null);
  const toast = useToast();

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Automatiska backups</h2>
            <p className="mt-0.5 text-xs text-muted">Körs dagligen kl 04:00 · Behålls i 30 dagar</p>
          </div>
          <Button onClick={() => toast.success("Backup startad", "Detta tar några minuter")}>
            <HardDrive size={14} strokeWidth={2} className="mr-1.5" />
            Skapa backup nu
          </Button>
        </div>
      </Card>

      <Table>
        <thead>
          <tr>
            <Th>Skapad</Th>
            <Th>Typ</Th>
            <Th>Storlek</Th>
            <Th>Lagring</Th>
            <Th className="text-right">Åtgärder</Th>
          </tr>
        </thead>
        <tbody>
          {backups.map((b) => (
            <tr key={b.id} className="transition-colors hover:bg-bg/50">
              <Td className="tabular-nums">{b.createdAt}</Td>
              <Td>
                <Badge tone={b.type === "manual" ? "success" : "neutral"}>
                  {b.type === "manual" ? "Manuell" : "Automatisk"}
                </Badge>
              </Td>
              <Td className="tabular-nums text-muted">{b.size}</Td>
              <Td className="text-xs text-muted">{b.retention}</Td>
              <Td className="text-right">
                <div className="inline-flex items-center gap-1">
                  <button
                    onClick={() => toast.info("Laddar ner…", b.createdAt)}
                    className="inline-flex h-7 items-center rounded-md border bg-surface px-2 text-xs font-medium hover:bg-bg"
                  >
                    <Download size={11} className="mr-1" />
                    Ladda ner
                  </button>
                  <button
                    onClick={() => setToRestore(b.id)}
                    className="inline-flex h-7 items-center rounded-md border bg-surface px-2 text-xs font-medium hover:bg-bg"
                  >
                    <RotateCcw size={11} className="mr-1" />
                    Återställ
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ConfirmDialog
        open={!!toRestore}
        onClose={() => setToRestore(null)}
        onConfirm={() => toast.success("Återställning startad", "Sajten kan vara otillgänglig i några minuter")}
        title="Återställ från backup?"
        description="Allt innehåll som skapats efter denna backup kommer att förloras."
        confirmLabel="Återställ"
        tone="danger"
      />
    </div>
  );
}

function DomainsTab({ domain, sslDays }: { domain: string; sslDays: number }) {
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight">Primär domän</h2>
          <Button variant="secondary">Lägg till domän</Button>
        </div>
        <div className="flex items-center gap-4 rounded-lg border bg-bg p-4">
          <Globe size={20} className="shrink-0 text-muted" />
          <div className="flex-1">
            <div className="font-medium">{domain}</div>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
              <Shield size={11} className={sslDays < 30 ? "text-amber-600 dark:text-amber-400" : ""} />
              <span>SSL via Let&apos;s Encrypt · förnyas automatiskt</span>
              <span>·</span>
              <span className={sslDays < 30 ? "font-medium text-amber-600 dark:text-amber-400" : ""}>
                {sslDays} dagar kvar
              </span>
            </div>
          </div>
          <Badge tone="success">Primär</Badge>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold tracking-tight">Redirects</h2>
        <div className="space-y-2">
          {[
            { from: "www." + domain, to: domain, code: 301 },
            { from: domain + "/old-blog", to: domain + "/blog", code: 301 },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border bg-bg px-3 py-2 text-sm">
              <span className="font-mono text-xs text-muted">{r.from}</span>
              <span className="text-muted">→</span>
              <span className="font-mono text-xs">{r.to}</span>
              <span className="ml-auto rounded bg-fg/5 px-1.5 py-0.5 text-[10px] font-medium">{r.code}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function LogsTab() {
  const [level, setLevel] = useState<"all" | "info" | "warn" | "error">("all");
  const filtered = logs.filter((l) => level === "all" || l.level === level);

  const levelStyles = {
    info: "bg-fg/5 text-muted",
    warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    error: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  return (
    <div className="space-y-4">
      <div className="flex rounded-lg border bg-bg p-0.5 w-fit">
        {(["all", "info", "warn", "error"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={clsx(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              level === l ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
            )}
          >
            {l === "all" ? "Alla" : l.toUpperCase()}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="divide-y divide-border/60 font-mono text-[12px]">
          {filtered.map((log) => (
            <div key={log.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-bg/50">
              <span className="shrink-0 text-muted tabular-nums">{log.time}</span>
              <span className={clsx("shrink-0 rounded px-1.5 text-[10px] font-semibold uppercase", levelStyles[log.level])}>
                {log.level}
              </span>
              <span className="shrink-0 text-muted">[{log.source}]</span>
              <span className="min-w-0 flex-1 break-all">{log.message}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted">Inga loggposter matchar filtret</div>
          )}
        </div>
      </Card>
    </div>
  );
}

function SettingsTab({ php }: { php: string }) {
  const toast = useToast();
  const [values, setValues] = useState({
    php,
    caching: true,
    wafEnabled: true,
    xmlrpc: false,
    autoUpdates: true,
    staging: false,
  });

  const update = <K extends keyof typeof values>(k: K, v: (typeof values)[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    toast.success("Inställning sparad");
  };

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold tracking-tight">Stack</h2>
        <div className="space-y-4">
          <Row label="PHP-version" desc="Byt kan kräva omstart av sajten">
            <div className="flex rounded-lg border bg-bg p-0.5">
              {["8.1", "8.2", "8.3"].map((v) => (
                <button
                  key={v}
                  onClick={() => update("php", v)}
                  className={clsx(
                    "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    values.php === v ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                  )}
                >
                  PHP {v}
                </button>
              ))}
            </div>
          </Row>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold tracking-tight">Prestanda & säkerhet</h2>
        <div className="divide-y divide-border/60">
          <Toggle label="Full page cache" desc="Cachar rendererade HTML-sidor" value={values.caching} onChange={(v) => update("caching", v)} />
          <Toggle label="Web Application Firewall" desc="Blockerar kända attacker automatiskt" value={values.wafEnabled} onChange={(v) => update("wafEnabled", v)} />
          <Toggle label="XML-RPC" desc="Krävs av vissa äldre plugins" value={values.xmlrpc} onChange={(v) => update("xmlrpc", v)} />
          <Toggle label="Automatiska uppdateringar" desc="Små WP-patchar installeras automatiskt" value={values.autoUpdates} onChange={(v) => update("autoUpdates", v)} />
          <Toggle label="Staging-miljö" desc="Skapa en kopia av sajten för tester" value={values.staging} onChange={(v) => update("staging", v)} />
        </div>
      </Card>
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {desc && <div className="mt-0.5 text-xs text-muted">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
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
        className={clsx(
          "relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors",
          value ? "bg-fg" : "bg-fg/15",
        )}
      >
        <span
          className={clsx(
            "absolute top-0.5 h-[18px] w-[18px] rounded-full bg-surface shadow-soft transition-transform",
            value ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </button>
    </label>
  );
}
