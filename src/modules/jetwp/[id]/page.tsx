"use client";

import { use, useEffect, useState } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  Globe,
  LayoutDashboard,
  Package,
  Palette,
  Settings as SettingsIcon,
} from "lucide-react";
import clsx from "clsx";
import { useToast } from "@/components/toast/ToastProvider";
import { getSiteRecord } from "@/modules/jetwp/data";
import { alerts } from "@/modules/jetwp/fleet/core";
import { SiteDetailHeader } from "@/modules/jetwp/site-detail/SiteDetailHeader";
import { OverviewTab } from "@/modules/jetwp/site-detail/OverviewTab";
import { PluginsTab } from "@/modules/jetwp/site-detail/PluginsTab";
import { ThemesTab } from "@/modules/jetwp/site-detail/ThemesTab";
import { DomainsTab } from "@/modules/jetwp/site-detail/DomainsTab";
import { LogsTab } from "@/modules/jetwp/site-detail/LogsTab";
import { SettingsTab } from "@/modules/jetwp/site-detail/SettingsTab";
import {
  getSiteOverviewModel,
  isSiteDetailTab,
  type SiteDetailTabId,
} from "@/modules/jetwp/selectors/site-detail";
import { useMockActionState, waitForMockAction } from "@/modules/jetwp/lib/useMockActionState";

const tabs = [
  { id: "overview", label: "Översikt", icon: LayoutDashboard },
  { id: "plugins", label: "Plugin", icon: Package },
  { id: "themes", label: "Teman", icon: Palette },
  { id: "domains", label: "Domäner", icon: Globe },
  { id: "logs", label: "Loggar", icon: FileText },
  { id: "settings", label: "Inställningar", icon: SettingsIcon },
] as const;

export default function SiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const purgeAction = useMockActionState();
  const site = getSiteRecord(id);
  const requestedTab = searchParams.get("tab");
  const [tab, setTab] = useState<SiteDetailTabId>(isSiteDetailTab(requestedTab) ? requestedTab : "overview");

  if (!site) notFound();

  useEffect(() => {
    setTab(isSiteDetailTab(requestedTab) ? requestedTab : "overview");
  }, [requestedTab]);

  const selectTab = (nextTab: SiteDetailTabId) => {
    setTab(nextTab);
    const nextParams = new URLSearchParams(searchParams.toString());
    if (nextTab === "overview") nextParams.delete("tab");
    else nextParams.set("tab", nextTab);
    const query = nextParams.toString();
    router.replace(query ? `/jetwp/${id}?${query}` : `/jetwp/${id}`);
  };

  const handlePurgeCache = async () => {
    try {
      await purgeAction.run(async () => {
        await waitForMockAction(400);
      });
      toast.success("Cache rensad", site.name);
    } catch {}
  };

  const overview = getSiteOverviewModel(site, alerts);

  return (
    <div className="space-y-6">
      <SiteDetailHeader
        site={site}
        onPurgeCache={handlePurgeCache}
        onOpenAdmin={() => toast.info("Öppnar", `${site.domain}/wp-admin`)}
        isPurging={purgeAction.isPending}
      />

      <div className="flex gap-1 border-b">
        {tabs.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => selectTab(tabId)}
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

      {tab === "overview" && <OverviewTab overview={overview} />}
      {tab === "plugins" && <PluginsTab updatesAvailable={site.updatesAvailable} />}
      {tab === "themes" && (
        <ThemesTab
          activeTheme={site.activeTheme}
          themeVersion={site.themeVersion}
          themeUpdateAvailable={site.themeUpdateAvailable}
        />
      )}
      {tab === "domains" && <DomainsTab siteId={site.id} domain={site.domain} sslDays={site.sslDays} />}
      {tab === "logs" && <LogsTab />}
      {tab === "settings" && <SettingsTab siteId={site.id} php={site.php} />}
    </div>
  );
}
