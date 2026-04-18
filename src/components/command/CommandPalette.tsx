"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Server,
  Sun,
  Moon,
  LogOut,
  Search,
  UserPlus,
  Home,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { useTheme } from "@/components/theme/ThemeProvider";

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: LucideIcon;
  shortcut?: string[];
  run: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const commands: Command[] = useMemo(
    () => [
      { id: "go-dashboard", label: "Gå till Dashboard", group: "Navigering", icon: LayoutDashboard, run: () => router.push("/dashboard") },
      { id: "go-users", label: "Gå till Users", group: "Navigering", icon: Users, run: () => router.push("/users") },
      { id: "go-analytics", label: "Gå till Analytics", group: "Navigering", icon: BarChart3, run: () => router.push("/analytics") },
      { id: "go-settings", label: "Gå till Settings", group: "Navigering", icon: Settings, run: () => router.push("/settings") },
      { id: "go-jetwp", label: "Gå till JetWP", group: "Navigering", icon: Server, run: () => router.push("/jetwp") },
      { id: "go-jetwp-activity", label: "JetWP · Aktivitet", group: "Navigering", icon: Server, run: () => router.push("/jetwp/activity") },
      { id: "invite-user", label: "Bjud in användare", hint: "Skicka inbjudan", group: "Åtgärder", icon: UserPlus, run: () => router.push("/users?invite=1") },
      { id: "go-home", label: "Startsida", group: "Navigering", icon: Home, run: () => router.push("/dashboard") },
      {
        id: "theme",
        label: theme === "dark" ? "Byt till ljust läge" : "Byt till mörkt läge",
        group: "Inställningar",
        icon: theme === "dark" ? Sun : Moon,
        run: toggle,
      },
      { id: "logout", label: "Logga ut", group: "Konto", icon: LogOut, run: () => router.push("/login") },
    ],
    [router, theme, toggle],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [commands, query]);

  const grouped = useMemo(() => {
    const groups = new Map<string, Command[]>();
    filtered.forEach((c) => {
      if (!groups.has(c.group)) groups.set(c.group, []);
      groups.get(c.group)!.push(c);
    });
    return Array.from(groups.entries());
  }, [filtered]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (cmd: Command) => {
    setOpen(false);
    cmd.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[active];
      if (cmd) run(cmd);
    }
  };

  if (!open) return null;

  let flatIdx = -1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border bg-surface shadow-pop"
      >
        <div className="flex items-center gap-2 border-b px-4">
          <Search size={16} className="text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Sök kommandon, sidor eller användare…"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />
          <kbd className="rounded-md border px-1.5 py-0.5 text-[10px] font-medium text-muted">ESC</kbd>
        </div>

        <div ref={listRef} className="max-h-[360px] overflow-y-auto p-1.5">
          {grouped.length === 0 && (
            <div className="px-3 py-10 text-center text-sm text-muted">Inga resultat</div>
          )}
          {grouped.map(([group, items]) => (
            <div key={group} className="mb-1 last:mb-0">
              <div className="px-2.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
                {group}
              </div>
              {items.map((cmd) => {
                flatIdx++;
                const isActive = flatIdx === active;
                const myIdx = flatIdx;
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    data-idx={myIdx}
                    onMouseEnter={() => setActive(myIdx)}
                    onClick={() => run(cmd)}
                    className={clsx(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                      isActive ? "bg-bg text-fg" : "text-fg/90",
                    )}
                  >
                    <Icon size={15} strokeWidth={1.75} className="text-muted" />
                    <span className="flex-1">{cmd.label}</span>
                    {cmd.hint && <span className="text-xs text-muted">{cmd.hint}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t px-3 py-2 text-[11px] text-muted">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border px-1 py-0.5 text-[10px]">↑↓</kbd> navigera
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border px-1 py-0.5 text-[10px]">↵</kbd> välj
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="rounded border px-1 py-0.5 text-[10px]">⌘</kbd>
            <kbd className="rounded border px-1 py-0.5 text-[10px]">K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
