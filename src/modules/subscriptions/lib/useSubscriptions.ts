"use client";

import { useCallback, useEffect, useState } from "react";
import type { Subscription } from "@/modules/subscriptions/data/core";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function readError(res: Response, fallback: string): Promise<Error> {
  try {
    const json = (await res.json()) as { error?: string };
    return new Error(json.error || fallback);
  } catch {
    return new Error(fallback);
  }
}

async function fetchSubscriptions(): Promise<Subscription[]> {
  const res = await fetch("/api/subscriptions", { cache: "no-store" });
  if (!res.ok) throw await readError(res, "Kunde inte ladda abonnemang");
  const json = (await res.json()) as { items: Subscription[] };
  return json.items;
}

export function useSubscriptions() {
  const [items, setItems] = useState<Subscription[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchSubscriptions();
      setItems(next);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Kunde inte ladda abonnemang";
      setError(message);
      console.error("useSubscriptions refresh failed", err);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setHydrated(true));
    listeners.add(refresh);
    return () => {
      listeners.delete(refresh);
    };
  }, [refresh]);

  const add = useCallback(async (input: Omit<Subscription, "id">): Promise<Subscription> => {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw await readError(res, "Kunde inte spara abonnemang");
      const json = (await res.json()) as { subscription: Subscription };
      setItems((prev) => [json.subscription, ...prev]);
      notify();
      return json.subscription;
  }, []);

  const update = useCallback(async (id: string, updates: Partial<Omit<Subscription, "id">>): Promise<Subscription> => {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw await readError(res, "Kunde inte uppdatera abonnemang");
      const json = (await res.json()) as { subscription: Subscription };
      setItems((prev) => prev.map((sub) => (sub.id === id ? json.subscription : sub)));
      notify();
      return json.subscription;
  }, []);

  return {
    hydrated,
    error,
    items,
    add,
    update,
    async remove(id: string): Promise<void> {
      const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
      if (!res.ok) throw await readError(res, "Kunde inte ta bort abonnemang");
      setItems((prev) => prev.filter((sub) => sub.id !== id));
      notify();
    },
    async duplicate(id: string): Promise<Subscription | undefined> {
      const res = await fetch(`/api/subscriptions/${id}/duplicate`, { method: "POST" });
      if (!res.ok) throw await readError(res, "Kunde inte duplicera abonnemang");
      const json = (await res.json()) as { subscription: Subscription };
      setItems((prev) => [json.subscription, ...prev]);
      notify();
      return json.subscription;
    },
    async markPaid(id: string): Promise<Subscription> {
      const res = await fetch(`/api/subscriptions/${id}/mark-paid`, { method: "POST" });
      if (!res.ok) throw await readError(res, "Kunde inte markera som betald");
      const json = (await res.json()) as { subscription: Subscription };
      setItems((prev) => prev.map((sub) => (sub.id === id ? json.subscription : sub)));
      notify();
      return json.subscription;
    },
    async setArchived(id: string, archived: boolean): Promise<Subscription> {
      return update(id, { archived });
    },
    async replaceAll(newItems: Subscription[]): Promise<void> {
      for (const item of newItems) {
        const { id: _id, ...input } = item;
        await add(input);
      }
      notify();
    },
    refresh,
  };
}
