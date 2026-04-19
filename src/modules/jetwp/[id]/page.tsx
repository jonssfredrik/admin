"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { FileText, Globe, HardDrive, LayoutDashboard, Package, Palette, Settings as SettingsIcon } from "lucide-react";
import clsx from "clsx";
import { useToast } from "@/components/toast/ToastProvider";
import { sites } from "../data";
import { SiteDetailHeader } from "@/modules/jetwp/site-detail/SiteDetailHeader";
import { OverviewTab } from "@/modules/jetwp/site-detail/OverviewTab";
import { PluginsTab } from "@/modules/jetwp/site-detail/PluginsTab";
import { ThemesTab } from "@/modules/jetwp/site-detail/ThemesTab";
import { BackupsTab } from "@/modules/jetwp/site-detail/BackupsTab";
import { DomainsTab } from "@/modules/jetwp/site-detail/DomainsTab";
import { LogsTab } from "@/modules/jetwp/site-detail/LogsTab";
import { SettingsTab } from "@/modules/jetwp/site-detail/SettingsTab";

const tabs = [
  { id: "overview", label: "Översikt", icon: LayoutDashboard },
  { id: "plugins", label: "Plugin", icon: Package },
  { id: "themes", label: "Teman", icon: Palette },
  { id: "backups", label: "Backuper", icon: HardDrive },
  { id: "domains", label: "Domäner", icon: Globe },
  { id: "logs", label: "Loggar", icon: FileText },
  { id: "settings", label: "Inställningar", icon: SettingsIcon },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function SiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const site = sites.find((entry) => entry.id === id);
  const toast = useToast();
  const [tab, setTab] = useState<TabId>("overview");

  if (!site) notFound();

  return (
    <div className="space-y-6">
      <SiteDetailHeader
        site={site}
        onPurgeCache={() => toast.success("Cache rensad", site.name)}
        onOpenAdmin={() => toast.info("Öppnar", `${site.domain}/wp-admin`)}
      />

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
