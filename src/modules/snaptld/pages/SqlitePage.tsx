"use client";

import { useState } from "react";
import clsx from "clsx";
import { ChevronDown, Database } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Table, Th, Td } from "@/components/ui/Table";
import type { SqliteSnapshot, SqliteTableSnapshot } from "@/modules/snaptld/server/sqlite-inspect";

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function isJsonColumn(column: string) {
  return column.endsWith("Json") || column.endsWith("Yaml");
}

function TableSection({ table, previewLimit }: { table: SqliteTableSnapshot; previewLimit: number }) {
  const [open, setOpen] = useState(true);
  const truncatedAt = table.rows.length < table.total ? table.rows.length : null;

  return (
    <Card className="p-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <Database size={16} className="text-muted" />
          <div>
            <div className="font-medium">{table.name}</div>
            <div className="text-xs text-muted">{table.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-fg/5 px-2 py-0.5 text-xs font-medium tabular-nums text-muted">
            {table.total} rader
          </span>
          <ChevronDown
            size={16}
            className={clsx("text-muted transition-transform", open && "rotate-180")}
          />
        </div>
      </button>

      {open && (
        <div className="border-t">
          {table.rows.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted">
              Inga rader i denna tabell ännu.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {table.columns.map((column) => (
                      <Th key={column} className="whitespace-nowrap">
                        {column}
                      </Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, index) => (
                    <tr key={index}>
                      {table.columns.map((column) => {
                        const raw = formatCellValue(row[column]);
                        return (
                          <Td
                            key={column}
                            className={clsx(
                              "align-top",
                              isJsonColumn(column) ? "max-w-[280px] truncate font-mono text-xs text-muted" : "whitespace-nowrap",
                            )}
                            title={isJsonColumn(column) ? raw : undefined}
                          >
                            {raw}
                          </Td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {truncatedAt !== null && (
            <div className="border-t px-5 py-2 text-xs text-muted">
              Visar de senaste {truncatedAt} av {table.total} raderna (gräns: {previewLimit}).
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export function SqlitePage({ snapshot }: { snapshot: SqliteSnapshot }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="SQLite"
        subtitle="Direktinsyn i SnapTLD-databasen via Prisma. Visar de senaste raderna per tabell."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Tabeller" value={String(snapshot.tables.length)} hint="SnapTLD-modeller i schema" />
        <StatCard label="Totalt antal rader" value={snapshot.totalRows.toLocaleString("sv-SE")} hint="Summa över alla tabeller" />
        <StatCard label="Databas" value="SQLite" hint={snapshot.databaseUrl} />
      </div>

      <div className="space-y-4">
        {snapshot.tables.map((table) => (
          <TableSection key={table.name} table={table} previewLimit={snapshot.previewLimit} />
        ))}
      </div>
    </div>
  );
}
