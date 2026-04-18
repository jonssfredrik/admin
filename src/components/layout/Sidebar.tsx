"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeft,
  HelpCircle,
  ChevronRight,
  Shield,
  CreditCard,
  Bell,
  FileText,
  Globe,
  Server,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";

interface SubItem {
  href: string;
  label: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: SubItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: "Översikt",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      {
        href: "/analytics",
        label: "Analytics",
        icon: BarChart3,
        children: [
          { href: "/analytics", label: "Översikt" },
          { href: "/analytics#traffic", label: "Trafik" },
          { href: "/analytics#sources", label: "Källor" },
          { href: "/analytics#pages", label: "Topp-sidor" },
        ],
      },
    ],
  },
  {
    title: "Tjänster",
    items: [
      {
        href: "/jetwp",
        label: "JetWP",
        icon: Server,
        children: [
          { href: "/jetwp", label: "Översikt" },
          { href: "/jetwp/sites", label: "Sites" },
          { href: "/jetwp/jobs", label: "Jobs" },
          { href: "/jetwp/backups", label: "Backups" },
          { href: "/jetwp/workflow", label: "Workflows" },
          { href: "/jetwp/security", label: "Security" },
          { href: "/jetwp/inventory", label: "Inventory" },
          { href: "/jetwp/alerts", label: "Alerts" },
          { href: "/jetwp/notifications", label: "Notifications" },
          { href: "/jetwp/integrations", label: "Integrations" },
          { href: "/jetwp/reports", label: "Reports" },
          { href: "/jetwp/agents", label: "Agents" },
          { href: "/jetwp/bulk-update", label: "Bulk update" },
          { href: "/jetwp/staging", label: "Staging" },
          { href: "/jetwp/access", label: "Access" },
          { href: "/jetwp/activity", label: "Aktivitet" },
          { href: "/jetwp/health", label: "Serverhälsa" },
          { href: "/jetwp/onboarding", label: "Onboarding" },
        ],
      },
    ],
  },
  {
    title: "Hantera",
    items: [
      {
        href: "/users",
        label: "Users",
        icon: Users,
        children: [
          { href: "/users", label: "Alla användare" },
          { href: "/users#invites", label: "Inbjudningar" },
          { href: "/users#roles", label: "Roller" },
        ],
      },
      { href: "#", label: "Dokument", icon: FileText },
      { href: "#", label: "Domäner", icon: Globe },
    ],
  },
  {
    title: "Konto",
    items: [
      {
        href: "/settings",
        label: "Settings",
        icon: Settings,
        children: [
          { href: "/settings", label: "Profil" },
          { href: "/settings#account", label: "Konto" },
          { href: "/settings#billing", label: "Fakturering" },
          { href: "/settings#notifications", label: "Notifikationer" },
        ],
      },
      { href: "#", label: "Säkerhet", icon: Shield },
      { href: "#", label: "Fakturering", icon: CreditCard },
      { href: "#", label: "Notiser", icon: Bell },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem("sidebar:collapsed");
    if (stored === "1") setCollapsed(true);
    const storedExp = localStorage.getItem("sidebar:expanded");
    if (storedExp) {
      try {
        setExpanded(JSON.parse(storedExp));
      } catch {}
    } else {
      const init: Record<string, boolean> = {};
      sections.forEach((s) =>
        s.items.forEach((i) => {
          if (i.children && pathname?.startsWith(i.href)) init[i.href] = true;
        }),
      );
      setExpanded(init);
    }
  }, [pathname]);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar:collapsed", next ? "1" : "0");
  };

  const toggleExpand = (key: string) => {
    setExpanded((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem("sidebar:expanded", JSON.stringify(next));
      return next;
    });
  };

  return (
    <aside
      className={clsx(
        "hidden shrink-0 flex-col border-r bg-surface transition-[width] duration-200 md:flex",
        collapsed ? "w-[60px]" : "w-60",
      )}
    >
      <div className={clsx("flex h-14 items-center", collapsed ? "justify-center" : "justify-between px-4")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-fg" />
            <span className="text-[15px] font-semibold tracking-tight">Admin</span>
          </div>
        )}
        <button
          onClick={toggle}
          aria-label={collapsed ? "Expandera sidebar" : "Minimera sidebar"}
          className="rounded-md p-1.5 text-muted hover:bg-bg hover:text-fg"
        >
          {collapsed ? <PanelLeft size={15} /> : <PanelLeftClose size={15} />}
        </button>
      </div>

      <nav className={clsx("flex-1 overflow-y-auto py-2", collapsed ? "px-2" : "px-3")}>
        {sections.map((section, si) => (
          <div key={section.title} className={si > 0 ? "mt-4" : ""}>
            {!collapsed ? (
              <div className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
                {section.title}
              </div>
            ) : (
              si > 0 && <div className="my-2 h-px bg-border" />
            )}

            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = item.href !== "#" && pathname?.startsWith(item.href);
                const isOpen = expanded[item.href];
                const hasChildren = !!item.children && !collapsed;

                return (
                  <div key={`${section.title}-${item.label}`}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={clsx(
                          "flex flex-1 items-center rounded-lg text-sm transition-colors",
                          collapsed ? "h-9 w-9 justify-center" : "gap-2.5 px-3 py-2",
                          active ? "bg-bg text-fg font-medium" : "text-muted hover:bg-bg hover:text-fg",
                        )}
                      >
                        <Icon size={16} strokeWidth={1.75} />
                        {!collapsed && <span className="flex-1">{item.label}</span>}
                      </Link>
                      {hasChildren && (
                        <button
                          onClick={() => toggleExpand(item.href)}
                          aria-label={isOpen ? "Fäll ihop" : "Expandera"}
                          className="ml-0.5 rounded-md p-1.5 text-muted hover:bg-bg hover:text-fg"
                        >
                          <ChevronRight
                            size={13}
                            strokeWidth={2}
                            className={clsx("transition-transform", isOpen && "rotate-90")}
                          />
                        </button>
                      )}
                    </div>

                    {hasChildren && isOpen && (
                      <div className="mt-0.5 ml-[22px] flex flex-col gap-0.5 border-l pl-3">
                        {item.children!.map((child) => {
                          const [childPath, childHash] = child.href.split("#");
                          const parentPath = item.href;
                          const isParentRoot = childPath === parentPath;
                          const childActive = childHash
                            ? false
                            : isParentRoot
                              ? pathname === parentPath
                              : pathname === childPath || pathname?.startsWith(childPath + "/");
                          return (
                            <Link
                              key={child.href + child.label}
                              href={child.href}
                              className={clsx(
                                "rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                                childActive
                                  ? "bg-bg font-medium text-fg"
                                  : "text-muted hover:bg-bg hover:text-fg",
                              )}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={clsx("border-t", collapsed ? "p-2" : "p-3")}>
        <Link
          href="#"
          title={collapsed ? "Hjälp" : undefined}
          className={clsx(
            "flex items-center rounded-lg text-sm text-muted transition-colors hover:bg-bg hover:text-fg",
            collapsed ? "h-9 w-9 justify-center" : "gap-2.5 px-3 py-2",
          )}
        >
          <HelpCircle size={16} strokeWidth={1.75} />
          {!collapsed && <span>Hjälp & support</span>}
        </Link>

        <div
          className={clsx(
            "mt-2 flex items-center rounded-lg",
            collapsed ? "justify-center p-1" : "gap-2.5 bg-bg px-2.5 py-2",
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fg/10 text-[11px] font-medium">
            F
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium">Fredrik Jonsson</div>
              <div className="truncate text-[11px] text-muted">Admin</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
