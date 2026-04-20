import {
  BarChart3,
  LayoutDashboard,
  ReceiptText,
  Server,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import { adminModules } from "@/modules/registry";
import type { AdminArea, AdminNavChild, AdminNavItem, AdminNavSection } from "@/modules/types";

interface CoreRoute {
  href: string;
  label: string;
  icon: LucideIcon;
  area: Extract<AdminArea, "hub" | "workspace">;
  children?: AdminNavChild[];
}

interface NavigationCommand {
  id: string;
  label: string;
  group: string;
  icon: LucideIcon;
  href: string;
  hint?: string;
}

const areaTitles: Record<AdminArea, string> = {
  hub: "Hem",
  operations: "Drift",
  business: "Affär",
  workspace: "Arbetsyta",
};

const coreRoutes: CoreRoute[] = [
  {
    href: "/dashboard",
    label: "Hem",
    icon: LayoutDashboard,
    area: "hub",
  },
  {
    href: "/analytics",
    label: "Analys",
    icon: BarChart3,
    area: "hub",
    children: [
      { href: "/analytics", label: "Översikt" },
      { href: "/analytics#traffic", label: "Trafik" },
      { href: "/analytics#sources", label: "Källor" },
      { href: "/analytics#pages", label: "Topp-sidor" },
    ],
  },
  {
    href: "/users",
    label: "Användare",
    icon: Users,
    area: "workspace",
    children: [
      { href: "/users", label: "Alla användare" },
      { href: "/users#invites", label: "Inbjudningar" },
      { href: "/users#roles", label: "Roller" },
    ],
  },
  {
    href: "/settings",
    label: "Inställningar",
    icon: Settings,
    area: "workspace",
    children: [
      { href: "/settings", label: "Profil" },
      { href: "/settings#account", label: "Konto" },
      { href: "/settings#billing", label: "Fakturering" },
      { href: "/settings#notifications", label: "Notifikationer" },
    ],
  },
];

export const navigationSections: AdminNavSection[] = (["hub", "operations", "business", "workspace"] as const).map(
  (area) => {
    const items: AdminNavItem[] = [
      ...coreRoutes
        .filter((route) => route.area === area)
        .map((route) => ({
          href: route.href,
          label: route.label,
          icon: route.icon,
          children: route.children,
        })),
      ...adminModules
        .filter((module) => module.area === area)
        .map((module) => ({
          href: module.href,
          label: module.title,
          icon: module.icon,
          children: module.children,
        })),
    ];

    return {
      id: area,
      title: areaTitles[area],
      items,
    };
  },
);

export const navigationItems = navigationSections.flatMap((section) => section.items);

function buildNavigationCommands(item: AdminNavItem, group: string): NavigationCommand[] {
  const commands: NavigationCommand[] = [
    {
      id: `nav:${item.href}`,
      label: `Gå till ${item.label}`,
      group,
      icon: item.icon,
      href: item.href,
    },
  ];

  if (item.children) {
    commands.push(
      ...item.children.map((child) => ({
        id: `nav:${item.href}:${child.href}`,
        label: child.label,
        group: item.label,
        icon: item.icon,
        href: child.href,
        hint: group,
      })),
    );
  }

  return commands;
}

export const navigationCommands = navigationSections.flatMap((section) =>
  section.items.flatMap((item) => buildNavigationCommands(item, areaTitles[section.id])),
);

export const moduleHighlights = adminModules.map((module) => ({
  id: module.id,
  title: module.title,
  href: module.href,
  description: module.description,
  icon: module.icon,
  metrics: module.metrics ?? [],
}));

export const featuredAreas = [
  {
    title: "Hem",
    description: "Global överblick, tvärmodulär aktivitet och snabbnavigering.",
    icon: LayoutDashboard,
  },
  {
    title: "Drift",
    description: "Drift, domäner och operativ kontroll över system och tillgångar.",
    icon: Server,
  },
  {
    title: "Affär",
    description: "Fakturering, affärsflöden och ekonomiskt arbete.",
    icon: ReceiptText,
  },
];
