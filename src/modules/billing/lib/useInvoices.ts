"use client";

import { useEffect, useState } from "react";
import { defaultInvoices } from "@/modules/billing/data";
import { addDays, todayIso } from "@/modules/billing/lib/dates";
import type { Invoice, InvoiceLine } from "@/modules/billing/types";

const KEY = "billing.invoices";
const listeners = new Set<() => void>();

function newLineId(): string {
  return `line-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function read(): Invoice[] {
  if (typeof window === "undefined") return defaultInvoices;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultInvoices;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultInvoices;
  } catch {
    return defaultInvoices;
  }
}

function write(items: Invoice[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

export function nextInvoiceId(existing: Invoice[], companyId: string): string {
  const prefix = `${companyId}-inv-`;
  const numbers = existing
    .filter((inv) => inv.companyId === companyId)
    .map((inv) => inv.id)
    .filter((id) => id.startsWith(prefix))
    .map((id) => parseInt(id.slice(prefix.length), 10))
    .filter((n) => Number.isFinite(n));
  if (numbers.length === 0) return `${prefix}0`;
  return `${prefix}${Math.max(...numbers) + 1}`;
}

export function useInvoices() {
  const [items, setItems] = useState<Invoice[]>(defaultInvoices);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(read());
    setHydrated(true);
    const update = () => setItems(read());
    listeners.add(update);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) update();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(update);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return {
    hydrated,
    items,
    add(invoice: Omit<Invoice, "id"> & { id?: string }) {
      const current = read();
      const id = invoice.id ?? nextInvoiceId(current, invoice.companyId);
      write([{ ...invoice, id }, ...current]);
      return id;
    },
    update(id: string, updates: Partial<Omit<Invoice, "id">>) {
      write(read().map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)));
    },
    remove(id: string) {
      write(read().filter((inv) => inv.id !== id));
    },
    duplicate(id: string): string | undefined {
      const current = read();
      const src = current.find((inv) => inv.id === id);
      if (!src) return undefined;
      const issued = todayIso();
      const dueDate = src.paymentTermsDays
        ? addDays(issued, src.paymentTermsDays)
        : addDays(issued, 30);
      const newLines: InvoiceLine[] = src.lines.map((line) => ({ ...line, id: newLineId() }));
      const newId = nextInvoiceId(current, src.companyId);
      const copy: Invoice = {
        ...src,
        id: newId,
        status: "draft",
        issuedDate: issued,
        dueDate,
        paidDate: undefined,
        lines: newLines,
      };
      write([copy, ...current]);
      return newId;
    },
    getById(id: string): Invoice | undefined {
      return read().find((inv) => inv.id === id);
    },
    reset() {
      write(defaultInvoices);
    },
  };
}
