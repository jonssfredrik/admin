"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, HelpCircle, PanelLeft, PanelLeftClose } from "lucide-react";
import clsx from "clsx";
import { AdminHubMark } from "@/components/brand/AdminHubMark";
import { navigationSections } from "@/config/navigation";
import type { AdminNavChild, AdminNavItem } from "@/modules/types";

function normalizePath(path: string) {
  if (!path || path === "/") return "/";
  return path.endsWith("/") ? path.slice(0, -1) : path;
}

function splitHref(href: string) {
  const [path, hash] = href.split("#");
  return {
    path: normalizePath(path),
    hash,
  };
}

function matchesPath(pathname: string, href: string) {
  const { path } = splitHref(href);
  return pathname === path || pathname.startsWith(`${path}/`);
}

function matchesDynamicPattern(pathname: string, pattern: string) {
  const currentSegments = normalizePath(pathname).split("/").filter(Boolean);
  const patternSegments = normalizePath(pattern).split("/").filter(Boolean);

  if (currentSegments.length !== patternSegments.length) return false;

  return patternSegments.every((segment, index) => {
    if (segment.startsWith("[") && segment.endsWith("]")) {
      return currentSegments[index].length > 0;
    }

    return currentSegments[index] === segment;
  });
}

function getPathSegmentCount(path: string) {
  return normalizePath(path).split("/").filter(Boolean).length;
}

function getStaticSegmentCount(pattern: string) {
  return normalizePath(pattern)
    .split("/")
    .filter(Boolean)
    .filter((segment) => !(segment.startsWith("[") && segment.endsWith("]"))).length;
}

function getChildMatchScore(pathname: string, currentHash: string, child: AdminNavChild) {
  const { path, hash } = splitHref(child.href);
  const pathSegments = getPathSegmentCount(path);

  if (hash) {
    if (pathname === path && currentHash === hash) return 500 + path.length;
    return 0;
  }

  if (pathname === path) return 600 + pathSegments * 100;
  if (pathname.startsWith(`${path}/`)) return 300 + pathSegments * 100;

  const matchingPattern = child.matchPaths?.find((pattern) => matchesDynamicPattern(pathname, pattern));
  if (matchingPattern) {
    return 350 + getStaticSegmentCount(matchingPattern) * 100 + getPathSegmentCount(matchingPattern) * 10;
  }

  return 0;
}

function getActiveChild(item: AdminNavItem, pathname: string, currentHash: string) {
  if (!item.children?.length) return null;

  return item.children.reduce<{ child: AdminNavChild | null; score: number }>(
    (best, child) => {
      const score = getChildMatchScore(pathname, currentHash, child);
      if (score > best.score) return { child, score };
      return best;
    },
    { child: null, score: 0 },
  ).child;
}

function isItemActive(item: AdminNavItem, pathname: string, currentHash: string) {
  if (item.matchPaths?.some((pattern) => matchesDynamicPattern(pathname, pattern))) return true;
  if (matchesPath(pathname, item.href)) return true;
  return getActiveChild(item, pathname, currentHash) !== null;
}

export function Sidebar() {
  const pathname = normalizePath(usePathname() ?? "/");
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    const syncHash = () => setCurrentHash(window.location.hash.replace(/^#/, ""));
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar:collapsed");
    if (stored === "1") setCollapsed(true);

    const storedExpanded = localStorage.getItem("sidebar:expanded");
    if (!storedExpanded) return;

    try {
      setExpanded(JSON.parse(storedExpanded));
    } catch {}
  }, []);

  const expandedState = useMemo(() => {
    const next = { ...expanded };

    navigationSections.forEach((section) =>
      section.items.forEach((item) => {
        if (item.children && isItemActive(item, pathname, currentHash)) {
          next[item.href] = true;
        }
      }),
    );

    return next;
  }, [currentHash, expanded, pathname]);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar:collapsed", next ? "1" : "0");
  };

  const toggleExpanded = (key: string) => {
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
        collapsed ? "w-[60px]" : "w-64",
      )}
    >
      <div
        className={clsx(
          "border-b",
          collapsed ? "flex flex-col items-center gap-2 py-3" : "flex h-14 items-center justify-between px-4",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="pl-2 mt-[-0.2rem]">
            <AdminHubMark className="h-[22px] w-[22px] shrink-0" />
          </div>
          {!collapsed && <span className="text-[15px] font-semibold tracking-tight">Admin Hub</span>}
        </div>
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expandera sidebar" : "Minimera sidebar"}
          className="rounded-md p-1.5 text-muted hover:bg-bg hover:text-fg"
        >
          {collapsed ? <PanelLeft size={15} /> : <PanelLeftClose size={15} />}
        </button>
      </div>

      <nav className={clsx("flex-1 overflow-y-auto py-2", collapsed ? "px-2" : "px-3")}>
        {navigationSections.map((section, sectionIndex) => (
          <div key={section.id} className={sectionIndex > 0 ? "mt-4" : ""}>
            {!collapsed ? (
              <div className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
                {section.title}
              </div>
            ) : (
              sectionIndex > 0 && <div className="my-2 h-px bg-border" />
            )}

            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const activeChild = getActiveChild(item, pathname, currentHash);
                const active = isItemActive(item, pathname, currentHash);
                const hasChildren = !!item.children && !collapsed;
                const isOpen = expandedState[item.href];

                return (
                  <div key={`${section.id}-${item.href}`}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={clsx(
                          "flex flex-1 items-center rounded-lg text-sm transition-colors",
                          collapsed ? "h-9 w-9 justify-center" : "gap-2.5 px-3 py-2",
                          active ? "bg-bg font-medium text-fg" : "text-muted hover:bg-bg hover:text-fg",
                        )}
                      >
                        <Icon size={16} strokeWidth={1.75} />
                        {!collapsed && <span className="flex-1">{item.label}</span>}
                      </Link>
                      {hasChildren && (
                        <button
                          onClick={() => toggleExpanded(item.href)}
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
                        {item.children?.map((child) => (
                          <Link
                            key={`${item.href}-${child.href}`}
                            href={child.href}
                            className={clsx(
                              "rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                              activeChild?.href === child.href
                                ? "bg-bg font-medium text-fg"
                                : "text-muted hover:bg-bg hover:text-fg",
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
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
          href="/settings"
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
