"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Moon, Search, Sun, UserPlus, type LucideIcon } from "lucide-react";
import clsx from "clsx";
import { navigationCommands } from "@/config/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: LucideIcon;
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
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === "Escape") {
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
      ...navigationCommands.map((command) => ({
        id: command.id,
        label: command.label,
        hint: command.hint,
        group: command.group,
        icon: command.icon,
        run: () => router.push(command.href),
      })),
      {
        id: "invite-user",
        label: "Bjud in användare",
        hint: "Skicka inbjudan",
        group: "Åtgärder",
        icon: UserPlus,
        run: () => router.push("/users?invite=1"),
      },
      {
        id: "theme",
        label: theme === "dark" ? "Byt till ljust läge" : "Byt till mörkt läge",
        group: "Inställningar",
        icon: theme === "dark" ? Sun : Moon,
        run: toggle,
      },
      {
        id: "logout",
        label: "Logga ut",
        group: "Konto",
        icon: LogOut,
        run: () => router.push("/login"),
      },
    ],
    [router, theme, toggle],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter(
      (command) =>
        command.label.toLowerCase().includes(normalized) ||
        command.group.toLowerCase().includes(normalized) ||
        command.hint?.toLowerCase().includes(normalized),
    );
  }, [commands, query]);

  const grouped = useMemo(() => {
    const groups = new Map<string, Command[]>();
    filtered.forEach((command) => {
      if (!groups.has(command.group)) groups.set(command.group, []);
      groups.get(command.group)?.push(command);
    });
    return Array.from(groups.entries());
  }, [filtered]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const element = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    element?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (command: Command) => {
    setOpen(false);
    command.run();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const command = filtered[active];
      if (command) run(command);
    }
  };

  if (!open) return null;

  let flatIndex = -1;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border bg-surface shadow-pop"
      >
        <div className="flex items-center gap-2 border-b px-4">
          <Search size={16} className="text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Sök kommandon, sidor eller användare..."
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />
          <kbd className="rounded-md border px-1.5 py-0.5 text-[10px] font-medium text-muted">ESC</kbd>
        </div>

        <div ref={listRef} className="max-h-[360px] overflow-y-auto p-1.5">
          {grouped.length === 0 && <div className="px-3 py-10 text-center text-sm text-muted">Inga resultat</div>}
          {grouped.map(([group, items]) => (
            <div key={group} className="mb-1 last:mb-0">
              <div className="px-2.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
                {group}
              </div>
              {items.map((command) => {
                flatIndex++;
                const isActive = flatIndex === active;
                const myIndex = flatIndex;
                const Icon = command.icon;
                return (
                  <button
                    key={command.id}
                    data-idx={myIndex}
                    onMouseEnter={() => setActive(myIndex)}
                    onClick={() => run(command)}
                    className={clsx(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                      isActive ? "bg-bg text-fg" : "text-fg/90",
                    )}
                  >
                    <Icon size={15} strokeWidth={1.75} className="text-muted" />
                    <span className="flex-1">{command.label}</span>
                    {command.hint && <span className="text-xs text-muted">{command.hint}</span>}
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
