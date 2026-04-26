"use client";

import { useEffect, useState } from "react";
import { defaultCustomers } from "@/modules/billing/data";
import type { Customer } from "@/modules/billing/types";

const KEY = "billing.customers";
const listeners = new Set<() => void>();

function read(): Customer[] {
  if (typeof window === "undefined") return defaultCustomers;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultCustomers;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultCustomers;
  } catch {
    return defaultCustomers;
  }
}

function write(items: Customer[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

export function useCustomers() {
  const [items, setItems] = useState<Customer[]>(defaultCustomers);
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
    add(customer: Omit<Customer, "id">) {
      const next = [{ ...customer, id: `cust-${Date.now()}` }, ...read()];
      write(next);
    },
    update(id: string, updates: Partial<Omit<Customer, "id">>) {
      write(read().map((c) => (c.id === id ? { ...c, ...updates } : c)));
    },
    remove(id: string) {
      write(read().filter((c) => c.id !== id));
    },
    reset() {
      write(defaultCustomers);
    },
  };
}
