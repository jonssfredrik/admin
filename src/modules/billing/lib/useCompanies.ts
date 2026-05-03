"use client";

import { useCallback, useEffect, useState } from "react";
import type { Company } from "@/modules/billing/types";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function fetchCompanies(): Promise<Company[]> {
  const res = await fetch("/api/billing/companies", { cache: "no-store" });
  if (!res.ok) throw new Error("Kunde inte ladda företag");
  const json = (await res.json()) as { items: Company[] };
  return json.items;
}

export function useCompanies() {
  const [items, setItems] = useState<Company[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchCompanies();
      setItems(next);
    } catch (error) {
      console.error("useCompanies refresh failed", error);
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
    async add(input: Omit<Company, "id">) {
      const res = await fetch("/api/billing/companies", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Kunde inte spara företag");
      const json = (await res.json()) as { company: Company };
      // Setting a new default rotates other rows — refetch instead of patching locally.
      if (json.company.isDefault) {
        await refresh();
      } else {
        setItems((prev) => [...prev, json.company]);
      }
      notify();
      return json.company;
    },
    async update(id: string, updates: Partial<Omit<Company, "id">>) {
      const res = await fetch(`/api/billing/companies/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Kunde inte uppdatera företag");
      const json = (await res.json()) as { company: Company };
      setItems((prev) => prev.map((c) => (c.id === id ? json.company : c)));
      notify();
      return json.company;
    },
    async remove(id: string) {
      const res = await fetch(`/api/billing/companies/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Kunde inte ta bort företag");
      // Default-flaggan kan ha hoppat till nästa företag — hämta om listan.
      await refresh();
      notify();
    },
    async setDefault(id: string) {
      const res = await fetch(`/api/billing/companies/${id}/default`, { method: "POST" });
      if (!res.ok) throw new Error("Kunde inte sätta standardföretag");
      await refresh();
      notify();
    },
  };
}
