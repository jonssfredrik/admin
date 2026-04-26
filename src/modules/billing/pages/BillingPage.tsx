"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
  Undo2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { RowMenu, type RowMenuEntry } from "@/components/ui/RowMenu";
import { StatCard } from "@/components/ui/StatCard";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { todayIso } from "@/modules/billing/lib/dates";
import {
  formatInvoiceAmount,
  invoiceDisplayNumber,
  invoiceDisplayStatus,
  isOverdue,
} from "@/modules/billing/lib/format";
import { invoiceTotals } from "@/modules/billing/lib/totals";
import { useCompanies } from "@/modules/billing/lib/useCompanies";
import { useInvoices } from "@/modules/billing/lib/useInvoices";
import type { Invoice, InvoiceStatus } from "@/modules/billing/types";

type StatusFilter = "all" | InvoiceStatus | "overdue";
type SortBy = "newest" | "dueAsc" | "amountDesc";

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Alla" },
  { value: "draft", label: "Utkast" },
  { value: "sent", label: "Skickade" },
  { value: "overdue", label: "Förfallna" },
  { value: "paid", label: "Betalda" },
];

const sortOptions: { value: SortBy; label: string }[] = [
  { value: "newest", label: "Nyaste först" },
  { value: "dueAsc", label: "Förfaller snart" },
  { value: "amountDesc", label: "Högst belopp" },
];

const selectCls =
  "h-9 rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5 text-fg";

export function BillingPage() {
  const router = useRouter();
  const toast = useToast();
  const { items: invoices, update, remove, duplicate } = useInvoices();
  const { items: companies } = useCompanies();

  const [confirmRemove, setConfirmRemove] = useState<Invoice | undefined>();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("newest");

  const companyName = useMemo(() => {
    const map = new Map(companies.map((c) => [c.id, c.name]));
    return (id: string) => map.get(id) ?? "—";
  }, [companies]);

  const stats = useMemo(() => {
    const today = todayIso();
    const currentYear = today.slice(0, 4);
    const outstanding = invoices.filter((i) => i.status === "sent");
    const overdue = invoices.filter(isOverdue);
    const paidYtd = invoices.filter(
      (i) => i.status === "paid" && i.paidDate?.startsWith(currentYear),
    );
    const sum = (list: Invoice[]) => list.reduce((acc, i) => acc + invoiceTotals(i).totalOre, 0);
    return {
      outstandingTotal: sum(outstanding),
      outstandingCount: outstanding.length,
      overdueTotal: sum(overdue),
      overdueCount: overdue.length,
      paidYtdTotal: sum(paidYtd),
      paidYtdCount: paidYtd.length,
      currentYear,
    };
  }, [invoices]);

  const visibleInvoices = useMemo(() => {
    let result = invoices;
    if (statusFilter === "overdue") result = result.filter(isOverdue);
    else if (statusFilter !== "all") result = result.filter((i) => i.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.customer.name.toLowerCase().includes(q) ||
          companyName(i.companyId).toLowerCase().includes(q),
      );
    }
    const sorted = [...result];
    if (sortBy === "newest") sorted.sort((a, b) => b.issuedDate.localeCompare(a.issuedDate));
    else if (sortBy === "dueAsc") sorted.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    else if (sortBy === "amountDesc")
      sorted.sort((a, b) => invoiceTotals(b).totalOre - invoiceTotals(a).totalOre);
    return sorted;
  }, [invoices, statusFilter, search, sortBy, companyName]);

  const noCompanies = companies.length === 0;
  const hasOverdue = stats.overdueCount > 0;

  const markSent = (invoice: Invoice) => {
    update(invoice.id, { status: "sent", paidDate: undefined });
    toast.success("Markerad som skickad", invoiceDisplayNumber(invoice));
  };
  const markPaid = (invoice: Invoice) => {
    update(invoice.id, { status: "paid", paidDate: invoice.paidDate ?? todayIso() });
    toast.success("Markerad som betald", invoiceDisplayNumber(invoice));
  };
  const markDraft = (invoice: Invoice) => {
    update(invoice.id, { status: "draft", paidDate: undefined });
    toast.info("Återställd till utkast", invoiceDisplayNumber(invoice));
  };
  const handleDuplicate = (invoice: Invoice) => {
    const newId = duplicate(invoice.id);
    if (newId) {
      toast.success("Faktura duplicerad", invoiceDisplayNumber({ id: newId }));
      router.push(`/billing/${newId}/edit`);
    }
  };

  const buildRowMenu = (invoice: Invoice): RowMenuEntry[] => {
    const items: RowMenuEntry[] = [
      { label: "Redigera", icon: Pencil, onClick: () => router.push(`/billing/${invoice.id}/edit`) },
      { label: "Duplicera", icon: Copy, onClick: () => handleDuplicate(invoice) },
      { divider: true },
    ];
    if (invoice.status === "draft") {
      items.push({ label: "Markera som skickad", icon: Send, onClick: () => markSent(invoice) });
    }
    if (invoice.status !== "paid") {
      items.push({ label: "Markera som betald", icon: CheckCircle2, onClick: () => markPaid(invoice) });
    }
    if (invoice.status !== "draft") {
      items.push({ label: "Återställ till utkast", icon: Undo2, onClick: () => markDraft(invoice) });
    }
    items.push({ divider: true });
    items.push({ label: "Ta bort", icon: Trash2, onClick: () => setConfirmRemove(invoice), danger: true });
    return items;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Fakturering"
          subtitle="Utgående fakturor — översikt över utkast, skickade och betalda."
        />
        {noCompanies ? (
          <Button disabled>
            <Plus size={14} strokeWidth={2} className="mr-1.5" />
            Ny faktura
          </Button>
        ) : (
          <Link
            href="/billing/new"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-fg px-3.5 text-sm font-medium text-bg transition-colors hover:opacity-90"
          >
            <Plus size={14} strokeWidth={2} className="mr-1.5" />
            Ny faktura
          </Link>
        )}
      </div>

      {noCompanies && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-sm text-amber-700 dark:text-amber-300">
          Lägg till minst ett <Link href="/billing/companies" className="font-medium underline underline-offset-2">avsändarbolag</Link> för att kunna skapa fakturor.
        </div>
      )}

      {hasOverdue && (
        <button
          type="button"
          onClick={() => setStatusFilter("overdue")}
          className="flex w-full items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-left text-sm transition-colors hover:bg-red-500/10"
        >
          <AlertTriangle size={16} className="shrink-0 text-red-600 dark:text-red-400" />
          <div className="flex-1">
            <span className="font-medium text-red-700 dark:text-red-300">
              {stats.overdueCount} {stats.overdueCount === 1 ? "faktura är förfallen" : "fakturor är förfallna"}
            </span>
            <span className="ml-2 text-red-600/80 dark:text-red-400/80">
              {formatInvoiceAmount(stats.overdueTotal, "SEK")} totalt
            </span>
          </div>
          <span className="text-xs text-red-600/70 dark:text-red-400/70">Visa →</span>
        </button>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Utestående"
          value={formatInvoiceAmount(stats.outstandingTotal, "SEK")}
          hint={`${stats.outstandingCount} skickade fakturor`}
        />
        <StatCard
          label="Förfallet"
          value={formatInvoiceAmount(stats.overdueTotal, "SEK")}
          hint={`${stats.overdueCount} förfallna`}
        />
        <StatCard
          label={`Betalt ${stats.currentYear}`}
          value={formatInvoiceAmount(stats.paidYtdTotal, "SEK")}
          hint={`${stats.paidYtdCount} betalda fakturor`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border bg-bg/40 p-0.5 text-xs">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={clsx(
                "rounded-md px-2.5 py-1 transition-colors",
                statusFilter === filter.value
                  ? "bg-surface font-medium text-fg shadow-sm"
                  : "text-muted hover:text-fg",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative ml-auto w-56">
          <Search size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök id, kund eller bolag…"
            className="pl-8"
          />
        </div>

        <select
          className={selectCls}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {visibleInvoices.length === 0 ? (
        <div className="rounded-2xl border bg-surface py-12 text-center text-sm text-muted">
          {invoices.length === 0
            ? "Inga fakturor ännu — skapa din första via ”Ny faktura”."
            : "Inga fakturor matchar nuvarande filter."}
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Faktura</Th>
              <Th>Bolag</Th>
              <Th>Kund</Th>
              <Th>Status</Th>
              <Th>Förfallodatum</Th>
              <Th className="text-right">Belopp</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {visibleInvoices.map((invoice) => {
              const display = invoiceDisplayStatus(invoice);
              return (
                <tr key={invoice.id} className="transition-colors hover:bg-bg/50">
                  <Td className="font-mono text-xs">
                    <Link href={`/billing/${invoice.id}`} className="hover:text-fg">
                      {invoiceDisplayNumber(invoice)}
                    </Link>
                  </Td>
                  <Td>{companyName(invoice.companyId)}</Td>
                  <Td>
                    <div>{invoice.customer.name}</div>
                    {!invoice.customerId && (
                      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted">Manuell</div>
                    )}
                  </Td>
                  <Td>
                    <Badge tone={display.tone}>{display.label}</Badge>
                  </Td>
                  <Td className="font-mono text-xs tabular-nums text-muted">{invoice.dueDate}</Td>
                  <Td className="text-right font-medium">
                    {formatInvoiceAmount(invoiceTotals(invoice).totalOre, invoice.currency)}
                  </Td>
                  <Td>
                    <RowMenu items={buildRowMenu(invoice)} />
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <ConfirmDialog
        open={!!confirmRemove}
        onClose={() => setConfirmRemove(undefined)}
        onConfirm={() => {
          if (!confirmRemove) return;
          remove(confirmRemove.id);
          toast.info("Faktura borttagen", invoiceDisplayNumber(confirmRemove));
        }}
        title="Ta bort faktura?"
        description={confirmRemove ? `${invoiceDisplayNumber(confirmRemove)} tas bort från listan.` : undefined}
        confirmLabel="Ta bort"
        tone="danger"
      />
    </div>
  );
}
