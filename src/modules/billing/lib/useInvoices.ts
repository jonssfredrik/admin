"use client";

import { useCallback, useEffect, useState } from "react";
import type { Invoice } from "@/modules/billing/types";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function fetchInvoices(): Promise<Invoice[]> {
  const res = await fetch("/api/billing/invoices", { cache: "no-store" });
  if (!res.ok) throw new Error("Kunde inte ladda fakturor");
  const json = (await res.json()) as { items: Invoice[] };
  return json.items;
}

export function useInvoices() {
  const [items, setItems] = useState<Invoice[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchInvoices();
      setItems(next);
    } catch (error) {
      console.error("useInvoices refresh failed", error);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setHydrated(true));
    listeners.add(refresh);
    return () => {
      listeners.delete(refresh);
    };
  }, [refresh]);

  return {
    hydrated,
    items,
    async add(input: Omit<Invoice, "id">): Promise<Invoice> {
      const res = await fetch("/api/billing/invoices", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Kunde inte spara faktura");
      const json = (await res.json()) as { invoice: Invoice };
      setItems((prev) => [json.invoice, ...prev]);
      notify();
      return json.invoice;
    },
    async update(id: string, updates: Partial<Omit<Invoice, "id" | "companyId">>): Promise<Invoice> {
      const res = await fetch(`/api/billing/invoices/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Kunde inte uppdatera faktura");
      const json = (await res.json()) as { invoice: Invoice };
      setItems((prev) => prev.map((inv) => (inv.id === id ? json.invoice : inv)));
      notify();
      return json.invoice;
    },
    async remove(id: string): Promise<void> {
      const res = await fetch(`/api/billing/invoices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Kunde inte ta bort faktura");
      setItems((prev) => prev.filter((inv) => inv.id !== id));
      notify();
    },
    async duplicate(id: string): Promise<Invoice | undefined> {
      const res = await fetch(`/api/billing/invoices/${id}/duplicate`, { method: "POST" });
      if (!res.ok) return undefined;
      const json = (await res.json()) as { invoice: Invoice };
      setItems((prev) => [json.invoice, ...prev]);
      notify();
      return json.invoice;
    },
    getById(id: string): Invoice | undefined {
      return items.find((inv) => inv.id === id);
    },
  };
}
