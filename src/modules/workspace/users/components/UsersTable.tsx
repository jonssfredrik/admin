"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Copy, Mail, Pencil, Search, Shield, Trash2, UserX } from "lucide-react";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { RowMenu, type RowMenuEntry } from "@/components/ui/RowMenu";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/toast/ToastProvider";
import type { User, UserStatus } from "@/modules/workspace/users/data";

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
  const [toDelete, setToDelete] = useState<User | null>(null);
  const toast = useToast();

  const menuFor = (user: User): RowMenuEntry[] => [
    { label: "Redigera", icon: Pencil, onClick: () => toast.info("Redigera", user.name) },
    { label: "Skicka e-post", icon: Mail, onClick: () => toast.success("E-post skickad", user.email) },
    {
      label: "Kopiera e-post",
      icon: Copy,
      onClick: () => {
        navigator.clipboard?.writeText(user.email);
        toast.success("Kopierad", user.email);
      },
    },
    { label: "Ändra roll", icon: Shield, onClick: () => toast.info("Ändra roll", user.name) },
    { divider: true },
    {
      label: user.status === "suspended" ? "Återaktivera" : "Stäng av",
      icon: UserX,
      onClick: () => toast.success(user.status === "suspended" ? "Återaktiverad" : "Avstängd", user.name),
    },
    { label: "Radera", icon: Trash2, onClick: () => setToDelete(user), danger: true },
  ];

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const base = normalized
      ? users.filter(
          (user) =>
            user.name.toLowerCase().includes(normalized) ||
            user.email.toLowerCase().includes(normalized) ||
            user.role.toLowerCase().includes(normalized),
        )
      : users;

    return [...base].sort((a, b) => {
      const av = a[sortKey].toString().toLowerCase();
      const bv = b[sortKey].toString().toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
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
          onChange={(event) => setQuery(event.target.value)}
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
          {filtered.map((user) => (
            <tr key={user.id} className="transition-colors hover:bg-bg/50">
              <Td>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-fg/10 text-[11px] font-medium">
                    {user.name.split(" ").map((name) => name[0]).join("").slice(0, 2)}
                  </div>
                  <span className="font-medium">{user.name}</span>
                </div>
              </Td>
              <Td className="text-muted">{user.email}</Td>
              <Td>{user.role}</Td>
              <Td>
                <Badge tone={statusTone[user.status]}>{statusLabel[user.status]}</Badge>
              </Td>
              <Td className="text-right text-muted tabular-nums">{user.lastActive}</Td>
              <Td>
                <RowMenu items={menuFor(user)} />
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

      <div className="px-1 text-xs text-muted">Visar {filtered.length} av {users.length} användare</div>

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
      <button onClick={onClick} className="-my-0.5 inline-flex items-center gap-1 rounded px-1 py-0.5 hover:bg-bg hover:text-fg">
        {label}
        <ArrowUpDown size={11} className={active ? "text-fg" : "opacity-40"} />
        {active && <span className="sr-only">{dir}</span>}
      </button>
    </Th>
  );
}
