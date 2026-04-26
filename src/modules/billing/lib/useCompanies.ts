"use client";

import { useEffect, useState } from "react";
import { defaultCompanies } from "@/modules/billing/data";
import type { Company } from "@/modules/billing/types";

const KEY = "billing.companies";
const listeners = new Set<() => void>();

function read(): Company[] {
  if (typeof window === "undefined") return defaultCompanies;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultCompanies;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultCompanies;
  } catch {
    return defaultCompanies;
  }
}

function write(items: Company[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

export function useCompanies() {
  const [items, setItems] = useState<Company[]>(defaultCompanies);
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
    add(company: Omit<Company, "id">) {
      const current = read();
      const isFirst = current.length === 0;
      const next = [
        { ...company, id: `co-${Date.now()}`, isDefault: isFirst ? true : company.isDefault },
        ...current,
      ];
      write(next);
    },
    update(id: string, updates: Partial<Omit<Company, "id">>) {
      write(read().map((c) => (c.id === id ? { ...c, ...updates } : c)));
    },
    remove(id: string) {
      const current = read();
      const removed = current.find((c) => c.id === id);
      const filtered = current.filter((c) => c.id !== id);
      if (removed?.isDefault && filtered.length > 0) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }
      write(filtered);
    },
    setDefault(id: string) {
      write(read().map((c) => ({ ...c, isDefault: c.id === id })));
    },
    reset() {
      write(defaultCompanies);
    },
  };
}
