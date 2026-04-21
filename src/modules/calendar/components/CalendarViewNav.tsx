"use client";

import Link from "next/link";
import clsx from "clsx";

type CalendarView = "month" | "week" | "agenda" | "settings";

interface Props {
  current: CalendarView;
}

const links: { id: CalendarView; href: string; label: string }[] = [
  { id: "month", href: "/calendar", label: "Månad" },
  { id: "week", href: "/calendar/week", label: "Vecka" },
  { id: "agenda", href: "/calendar/agenda", label: "Agenda" },
  { id: "settings", href: "/calendar/settings", label: "Inställningar" },
];

export function CalendarViewNav({ current }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={clsx(
            "inline-flex h-9 items-center rounded-lg px-3 text-sm transition-colors",
            current === link.id
              ? "bg-fg font-medium text-bg"
              : "border bg-surface text-muted hover:bg-bg hover:text-fg",
          )}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
