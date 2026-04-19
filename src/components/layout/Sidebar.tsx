"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, HelpCircle, PanelLeft, PanelLeftClose } from "lucide-react";
import clsx from "clsx";
import { navigationSections } from "@/config/navigation";

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
      const initialExpanded: Record<string, boolean> = {};
      navigationSections.forEach((section) =>
        section.items.forEach((item) => {
          if (item.children && pathname?.startsWith(item.href)) initialExpanded[item.href] = true;
        }),
      );
      setExpanded(initialExpanded);
    }
  }, [pathname]);

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
      <div className={clsx("flex h-14 items-center", collapsed ? "justify-center" : "justify-between px-4")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-fg text-italic">A</div>
            <span className="text-[15px] font-semibold tracking-tight">Admin Hub</span>
          </div>
        )}
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
                const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                const hasChildren = !!item.children && !collapsed;
                const isOpen = expanded[item.href];

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
                        {item.children?.map((child) => {
                          const [childPath, childHash] = child.href.split("#");
                          const childActive = childHash
                            ? false
                            : pathname === childPath || pathname?.startsWith(`${childPath}/`);
                          return (
                            <Link
                              key={`${item.href}-${child.href}`}
                              href={child.href}
                              className={clsx(
                                "rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                                childActive ? "bg-bg font-medium text-fg" : "text-muted hover:bg-bg hover:text-fg",
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
