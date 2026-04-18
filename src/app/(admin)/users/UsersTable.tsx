"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Search, Pencil, Mail, UserX, Trash2, Copy, Shield } from "lucide-react";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { RowMenu, type RowMenuEntry } from "@/components/ui/RowMenu";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/toast/ToastProvider";
import type { User, UserStatus } from "./data";

const statusTone: Record<UserStatus, "success" | "warning" | "danger"> = {
  active: "success",
  invited: "warning",
  suspended: "danger",
};

const statusLabel: Record<UserStatus, string> = {
  active: "Aktiv",
  invited: "Inbjuden",
  suspended: "Avstängd",
};

type SortKey = "name" | "role" | "status";

export function UsersTable({ users }: { users: User[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const toast = useToast();
  const [toDelete, setToDelete] = useState<User | null>(null);

  const menuFor = (u: User): RowMenuEntry[] => [
    { label: "Redigera", icon: Pencil, onClick: () => toast.info("Redigera", u.name) },
    { label: "Skicka e-post", icon: Mail, onClick: () => toast.success("E-post skickad", u.email) },
    { label: "Kopiera e-post", icon: Copy, onClick: () => {
      navigator.clipboard?.writeText(u.email);
      toast.success("Kopierad", u.email);
    }},
    { label: "Ändra roll", icon: Shield, onClick: () => toast.info("Ändra roll", u.name) },
    { divider: true },
    { label: u.status === "suspended" ? "Återaktivera" : "Stäng av", icon: UserX, onClick: () =>
      toast.success(u.status === "suspended" ? "Återaktiverad" : "Avstängd", u.name),
    },
    { label: "Radera", icon: Trash2, onClick: () => setToDelete(u), danger: true },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? users.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q),
        )
      : users;
    const sorted = [...base].sort((a, b) => {
      const av = a[sortKey].toString().toLowerCase();
      const bv = b[sortKey].toString().toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [users, query, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative max-w-xs">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <Input
          className="pl-9"
          placeholder="Sök namn, e-post eller roll…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Table>
        <thead>
          <tr>
            <SortableTh label="Namn" active={sortKey === "name"} dir={sortDir} onClick={() => toggleSort("name")} />
            <Th>E-post</Th>
            <SortableTh label="Roll" active={sortKey === "role"} dir={sortDir} onClick={() => toggleSort("role")} />
            <SortableTh label="Status" active={sortKey === "status"} dir={sortDir} onClick={() => toggleSort("status")} />
            <Th className="text-right">Senast aktiv</Th>
            <Th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id} className="transition-colors hover:bg-bg/50">
              <Td>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-fg/10 text-[11px] font-medium">
                    {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <span className="font-medium">{u.name}</span>
                </div>
              </Td>
              <Td className="text-muted">{u.email}</Td>
              <Td>{u.role}</Td>
              <Td>
                <Badge tone={statusTone[u.status]}>{statusLabel[u.status]}</Badge>
              </Td>
              <Td className="text-right text-muted tabular-nums">{u.lastActive}</Td>
              <Td>
                <RowMenu items={menuFor(u)} />
              </Td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <Td className="py-10 text-center text-muted" colSpan={6}>
                Inga användare matchar din sökning
              </Td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="px-1 text-xs text-muted">
        Visar {filtered.length} av {users.length} användare
      </div>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) toast.success("Användare raderad", toDelete.name);
        }}
        title={toDelete ? `Radera ${toDelete.name}?` : ""}
        description="Användaren kommer att tas bort permanent från systemet."
        confirmLabel="Radera"
        tone="danger"
      />
    </div>
  );
}

function SortableTh({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <Th>
      <button
        onClick={onClick}
        className="-my-0.5 inline-flex items-center gap-1 rounded px-1 py-0.5 hover:bg-bg hover:text-fg"
      >
        {label}
        <ArrowUpDown size={11} className={active ? "text-fg" : "opacity-40"} />
        {active && <span className="sr-only">{dir}</span>}
      </button>
    </Th>
  );
}
