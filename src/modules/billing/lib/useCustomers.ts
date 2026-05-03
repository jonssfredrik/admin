"use client";

import { useCallback, useEffect, useState } from "react";
import type { Customer } from "@/modules/billing/types";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch("/api/billing/customers", { cache: "no-store" });
  if (!res.ok) throw new Error("Kunde inte ladda kunder");
  const json = (await res.json()) as { items: Customer[] };
  return json.items;
}

export function useCustomers() {
  const [items, setItems] = useState<Customer[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchCustomers();
      setItems(next);
    } catch (error) {
      console.error("useCustomers refresh failed", error);
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
    async add(input: Omit<Customer, "id">) {
      const res = await fetch("/api/billing/customers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Kunde inte spara kund");
      const json = (await res.json()) as { customer: Customer };
      setItems((prev) => [...prev, json.customer]);
      notify();
      return json.customer;
    },
    async update(id: string, updates: Partial<Omit<Customer, "id">>) {
      const res = await fetch(`/api/billing/customers/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Kunde inte uppdatera kund");
      const json = (await res.json()) as { customer: Customer };
      setItems((prev) => prev.map((c) => (c.id === id ? json.customer : c)));
      notify();
      return json.customer;
    },
    async remove(id: string) {
      const res = await fetch(`/api/billing/customers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Kunde inte ta bort kund");
      setItems((prev) => prev.filter((c) => c.id !== id));
      notify();
    },
  };
}
