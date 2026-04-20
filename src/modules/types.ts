import type { LucideIcon } from "lucide-react";

export type AdminArea = "hub" | "operations" | "business" | "workspace";

export interface AdminNavChild {
  href: string;
  label: string;
  matchPaths?: string[];
}

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchPaths?: string[];
  children?: AdminNavChild[];
}

export interface AdminNavSection {
  id: AdminArea;
  title: string;
  items: AdminNavItem[];
}

export interface AdminModuleMetric {
  label: string;
  value: string;
  hint?: string;
}

export interface AdminModuleDefinition {
  id: string;
  title: string;
  shortTitle?: string;
  description: string;
  area: Exclude<AdminArea, "hub">;
  href: string;
  icon: LucideIcon;
  children?: AdminNavChild[];
  metrics?: AdminModuleMetric[];
}
